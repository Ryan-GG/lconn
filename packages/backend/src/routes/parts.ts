import { Router } from 'express';
import { db } from '../config/database';
import { parts } from '../db/schema';
import { requireAuth } from '../middleware/auth';
import { eq, desc, sql } from 'drizzle-orm';
import type { CreatePartRequest } from '@lconn/shared';

const router = Router();

// Get all parts with pagination
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const offset = (page - 1) * limit;

    const [partsData, countResult] = await Promise.all([
      db
        .select()
        .from(parts)
        .orderBy(desc(parts.createdAt))
        .limit(limit)
        .offset(offset),
      db.select({ count: sql<number>`count(*)` }).from(parts),
    ]);

    const total = Number(countResult[0].count);

    res.json({
      success: true,
      data: partsData,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching parts:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch parts' });
  }
});

// Get single part by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const part = await db.select().from(parts).where(eq(parts.id, id)).limit(1);

    if (part.length === 0) {
      return res.status(404).json({ success: false, error: 'Part not found' });
    }

    res.json({ success: true, data: part[0] });
  } catch (error) {
    console.error('Error fetching part:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch part' });
  }
});

// Create new part (authenticated)
router.post('/', requireAuth, async (req, res) => {
  try {
    const { name, partNumber, description } = req.body as CreatePartRequest;
    const user = req.user as any;

    if (!name || name.trim().length === 0) {
      return res.status(400).json({ success: false, error: 'Part name is required' });
    }

    const newPart = await db
      .insert(parts)
      .values({
        name: name.trim(),
        partNumber: partNumber?.trim(),
        description: description?.trim(),
        createdBy: user.id,
      })
      .returning();

    res.status(201).json({ success: true, data: newPart[0] });
  } catch (error) {
    console.error('Error creating part:', error);
    res.status(500).json({ success: false, error: 'Failed to create part' });
  }
});

export default router;
