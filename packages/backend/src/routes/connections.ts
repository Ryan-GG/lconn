import { Router } from 'express';
import { db } from '../config/database';
import { connectionSpecs, votes } from '../db/schema';
import { requireAuth } from '../middleware/auth';
import { eq, desc, sql } from 'drizzle-orm';
import type { CreateConnectionSpecRequest, UpdateConnectionSpecRequest } from '@lconn/shared';

const router = Router();

// Helper function to get vote count
const getVoteCount = (specId: string) => {
  return db
    .select({
      upvotes: sql<number>`count(*) filter (where ${votes.voteType} = 'upvote')`,
      downvotes: sql<number>`count(*) filter (where ${votes.voteType} = 'downvote')`,
    })
    .from(votes)
    .where(eq(votes.connectionSpecId, specId));
};

// Get all connection specs with pagination and sorting
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const offset = (page - 1) * limit;
    const partId = req.query.partId as string;

    let query = db.select().from(connectionSpecs);

    if (partId) {
      query = query.where(eq(connectionSpecs.partId, partId)) as any;
    }

    const specs = await query.orderBy(desc(connectionSpecs.createdAt)).limit(limit).offset(offset);

    // Get vote counts for each spec
    const specsWithVotes = await Promise.all(
      specs.map(async (spec) => {
        const voteData = await getVoteCount(spec.id);
        const upvotes = Number(voteData[0]?.upvotes || 0);
        const downvotes = Number(voteData[0]?.downvotes || 0);
        return {
          ...spec,
          voteCount: upvotes - downvotes,
        };
      })
    );

    // Sort by vote count if requested
    if (req.query.sortBy === 'votes') {
      specsWithVotes.sort((a, b) => b.voteCount - a.voteCount);
    }

    const total = specs.length; // Simplified for now

    res.json({
      success: true,
      data: specsWithVotes,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching connection specs:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch connection specs' });
  }
});

// Get single connection spec by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const spec = await db.select().from(connectionSpecs).where(eq(connectionSpecs.id, id)).limit(1);

    if (spec.length === 0) {
      return res.status(404).json({ success: false, error: 'Connection spec not found' });
    }

    const voteData = await getVoteCount(id);
    const upvotes = Number(voteData[0]?.upvotes || 0);
    const downvotes = Number(voteData[0]?.downvotes || 0);

    res.json({
      success: true,
      data: {
        ...spec[0],
        voteCount: upvotes - downvotes,
      },
    });
  } catch (error) {
    console.error('Error fetching connection spec:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch connection spec' });
  }
});

// Create new connection spec (authenticated)
router.post('/', requireAuth, async (req, res) => {
  try {
    const { partId, connections } = req.body as CreateConnectionSpecRequest;
    const user = req.user as any;

    if (!partId || !connections || !Array.isArray(connections)) {
      return res.status(400).json({ success: false, error: 'Invalid connection spec data' });
    }

    const newSpec = await db
      .insert(connectionSpecs)
      .values({
        partId,
        specData: connections,
        createdBy: user.id,
      })
      .returning();

    res.status(201).json({ success: true, data: newSpec[0] });
  } catch (error) {
    console.error('Error creating connection spec:', error);
    res.status(500).json({ success: false, error: 'Failed to create connection spec' });
  }
});

// Update connection spec (authenticated, owner only)
router.put('/:id', requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const { connections } = req.body as UpdateConnectionSpecRequest;
    const user = req.user as any;

    // Check if spec exists and user is owner
    const existing = await db.select().from(connectionSpecs).where(eq(connectionSpecs.id, id)).limit(1);

    if (existing.length === 0) {
      return res.status(404).json({ success: false, error: 'Connection spec not found' });
    }

    if (existing[0].createdBy !== user.id) {
      return res.status(403).json({ success: false, error: 'Not authorized to update this spec' });
    }

    const updated = await db
      .update(connectionSpecs)
      .set({
        specData: connections,
        updatedAt: new Date(),
      })
      .where(eq(connectionSpecs.id, id))
      .returning();

    res.json({ success: true, data: updated[0] });
  } catch (error) {
    console.error('Error updating connection spec:', error);
    res.status(500).json({ success: false, error: 'Failed to update connection spec' });
  }
});

// Delete connection spec (authenticated, owner only)
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const user = req.user as any;

    // Check if spec exists and user is owner
    const existing = await db.select().from(connectionSpecs).where(eq(connectionSpecs.id, id)).limit(1);

    if (existing.length === 0) {
      return res.status(404).json({ success: false, error: 'Connection spec not found' });
    }

    if (existing[0].createdBy !== user.id) {
      return res.status(403).json({ success: false, error: 'Not authorized to delete this spec' });
    }

    await db.delete(connectionSpecs).where(eq(connectionSpecs.id, id));

    res.json({ success: true, message: 'Connection spec deleted successfully' });
  } catch (error) {
    console.error('Error deleting connection spec:', error);
    res.status(500).json({ success: false, error: 'Failed to delete connection spec' });
  }
});

export default router;
