import { Router } from 'express';
import { db } from '../config/database';
import { votes } from '../db/schema';
import { requireAuth } from '../middleware/auth';
import { eq, and } from 'drizzle-orm';
import type { VoteRequest } from '@lconn/shared';

const router = Router();

// Vote on a connection spec
router.post('/:id/vote', requireAuth, async (req, res) => {
  try {
    const { id } = req.params; // connection spec ID
    const { voteType } = req.body as VoteRequest;
    const user = req.user as any;

    if (!voteType || (voteType !== 'upvote' && voteType !== 'downvote')) {
      return res.status(400).json({ success: false, error: 'Invalid vote type' });
    }

    // Check if user already voted
    const existingVote = await db
      .select()
      .from(votes)
      .where(and(eq(votes.connectionSpecId, id), eq(votes.userId, user.id)))
      .limit(1);

    if (existingVote.length > 0) {
      // Update existing vote
      const updated = await db
        .update(votes)
        .set({ voteType })
        .where(and(eq(votes.connectionSpecId, id), eq(votes.userId, user.id)))
        .returning();

      return res.json({ success: true, data: updated[0] });
    }

    // Create new vote
    const newVote = await db
      .insert(votes)
      .values({
        connectionSpecId: id,
        userId: user.id,
        voteType,
      })
      .returning();

    res.status(201).json({ success: true, data: newVote[0] });
  } catch (error) {
    console.error('Error voting:', error);
    res.status(500).json({ success: false, error: 'Failed to vote' });
  }
});

// Remove vote from connection spec
router.delete('/:id/vote', requireAuth, async (req, res) => {
  try {
    const { id } = req.params; // connection spec ID
    const user = req.user as any;

    await db.delete(votes).where(and(eq(votes.connectionSpecId, id), eq(votes.userId, user.id)));

    res.json({ success: true, message: 'Vote removed successfully' });
  } catch (error) {
    console.error('Error removing vote:', error);
    res.status(500).json({ success: false, error: 'Failed to remove vote' });
  }
});

export default router;
