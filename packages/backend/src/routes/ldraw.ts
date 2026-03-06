import { Router } from 'express';
import { eq, ilike, or, sql, asc, desc, count } from 'drizzle-orm';
import { db } from '../config/database';
import { ldrawParts } from '../db/schema';
import { sendSuccess, sendError } from '../lib/response';

const router = Router();

// GET /api/ldraw/parts — List parts (paginated, excludes content)
router.get('/parts', async (req, res) => {
  try {
    // Query params are already validated and coerced by express-openapi-validator
    const page = req.query.page as unknown as number;
    const limit = req.query.limit as unknown as number;
    const partType = req.query.partType as 'part' | 'subpart' | 'primitive' | undefined;
    const search = req.query.search as string | undefined;
    const sortBy = (req.query.sortBy as string) || 'filename';
    const order = req.query.order as 'asc' | 'desc';

    const offset = (page - 1) * limit;

    // Build where conditions
    const conditions = [];
    if (partType) {
      conditions.push(eq(ldrawParts.partType, partType));
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

    sendSuccess(res, {
      data: rows,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    console.error('Error fetching ldraw parts:', err);
    sendError(res, 'Failed to fetch parts', 500);
  }
});

// GET /api/ldraw/parts/* — Get single part by filename (wildcard for paths with /)
router.get('/parts/*', async (req, res) => {
  try {
    const filename = (req.params as any)[0]?.replace(/\\/g, '/');
    if (!filename) {
      return sendError(res, 'Filename is required', 400);
    }

    const [part] = await db
      .select()
      .from(ldrawParts)
      .where(eq(ldrawParts.filename, filename))
      .limit(1);

    if (!part) {
      return sendError(res, 'Part not found', 404);
    }

    sendSuccess(res, part);
  } catch (err) {
    console.error('Error fetching ldraw part:', err);
    sendError(res, 'Failed to fetch part', 500);
  }
});

export default router;
