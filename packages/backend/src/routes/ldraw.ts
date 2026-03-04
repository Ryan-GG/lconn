import { Router } from 'express';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { eq, ilike, or, sql, asc, desc, count } from 'drizzle-orm';
import { ldrawParts } from '../db/schema';

const router = Router();

const pool = new Pool({ connectionString: process.env.DATABASE_URL! });
const db = drizzle(pool);

// GET /api/ldraw/parts — List parts (paginated, excludes content)
router.get('/parts', async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string) || 20));
    const partType = req.query.partType as string | undefined;
    const search = req.query.search as string | undefined;
    const sortBy = (req.query.sortBy as string) || 'filename';
    const order = (req.query.order as string) === 'desc' ? 'desc' : 'asc';

    const offset = (page - 1) * limit;

    // Build where conditions
    const conditions = [];
    if (partType && ['part', 'subpart', 'primitive'].includes(partType)) {
      conditions.push(eq(ldrawParts.partType, partType as 'part' | 'subpart' | 'primitive'));
    }
    if (search) {
      conditions.push(
        or(
          ilike(ldrawParts.filename, `%${search}%`),
          ilike(ldrawParts.description, `%${search}%`),
        )!,
      );
    }

    const where = conditions.length > 0
      ? conditions.length === 1
        ? conditions[0]
        : sql`${conditions[0]} AND ${conditions[1]}`
      : undefined;

    // Determine sort column
    const sortColumn = sortBy === 'description' ? ldrawParts.description
      : sortBy === 'partType' ? ldrawParts.partType
      : ldrawParts.filename;
    const orderFn = order === 'desc' ? desc : asc;

    // Query data (excluding content)
    const [rows, totalResult] = await Promise.all([
      db
        .select({
          filename: ldrawParts.filename,
          description: ldrawParts.description,
          partType: ldrawParts.partType,
          createdAt: ldrawParts.createdAt,
          updatedAt: ldrawParts.updatedAt,
        })
        .from(ldrawParts)
        .where(where)
        .orderBy(orderFn(sortColumn))
        .limit(limit)
        .offset(offset),
      db
        .select({ total: count() })
        .from(ldrawParts)
        .where(where),
    ]);

    const total = totalResult[0]?.total ?? 0;

    res.json({
      success: true,
      data: {
        data: rows,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
    });
  } catch (err) {
    console.error('Error fetching ldraw parts:', err);
    res.status(500).json({ success: false, error: 'Failed to fetch parts' });
  }
});

// GET /api/ldraw/parts/* — Get single part by filename (wildcard for paths with /)
router.get('/parts/*', async (req, res) => {
  try {
    const filename = (req.params as any)[0]?.replace(/\\/g, '/');
    if (!filename) {
      return res.status(400).json({ success: false, error: 'Filename is required' });
    }

    const [part] = await db
      .select()
      .from(ldrawParts)
      .where(eq(ldrawParts.filename, filename))
      .limit(1);

    if (!part) {
      return res.status(404).json({ success: false, error: 'Part not found' });
    }

    res.json({ success: true, data: part });
  } catch (err) {
    console.error('Error fetching ldraw part:', err);
    res.status(500).json({ success: false, error: 'Failed to fetch part' });
  }
});

export default router;
