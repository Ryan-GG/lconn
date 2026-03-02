import { useState } from 'react';
import { apiPost, apiDelete } from '../../hooks/useApi';
import { useAuth } from '../../context/AuthContext';
import { VoteType } from '@lconn/shared';

interface VoteButtonsProps {
  connectionSpecId: string;
  initialVoteCount: number;
  onVoteChange?: () => void;
}

export const VoteButtons = ({ connectionSpecId, initialVoteCount, onVoteChange }: VoteButtonsProps) => {
  const { user, login } = useAuth();
  const [voteCount, setVoteCount] = useState(initialVoteCount);
  const [userVote, setUserVote] = useState<VoteType | null>(null);
  const [loading, setLoading] = useState(false);

  const handleVote = async (voteType: VoteType) => {
    if (!user) {
      login();
      return;
    }

    setLoading(true);
    try {
      if (userVote === voteType) {
        // Remove vote
        await apiDelete(`/api/connections/${connectionSpecId}/vote`);
        setVoteCount(voteCount + (voteType === 'upvote' ? -1 : 1));
        setUserVote(null);
      } else {
        // Add or change vote
        await apiPost(`/api/connections/${connectionSpecId}/vote`, { voteType });
        const delta = userVote
          ? voteType === 'upvote' ? 2 : -2
          : voteType === 'upvote' ? 1 : -1;
        setVoteCount(voteCount + delta);
        setUserVote(voteType);
      }
      onVoteChange?.();
    } catch (error) {
      console.error('Error voting:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <button
        onClick={() => handleVote(VoteType.UPVOTE)}
        disabled={loading}
        style={{
          ...styles.button,
          ...(userVote === 'upvote' ? styles.activeUpvote : {}),
        }}
      >
        ▲
      </button>
      <span style={styles.count}>{voteCount}</span>
      <button
        onClick={() => handleVote(VoteType.DOWNVOTE)}
        disabled={loading}
        style={{
          ...styles.button,
          ...(userVote === 'downvote' ? styles.activeDownvote : {}),
        }}
      >
        ▼
      </button>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    gap: '0.25rem',
  },
  button: {
    padding: '0.25rem 0.5rem',
    backgroundColor: 'transparent',
    border: '1px solid #ddd',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '1rem',
  },
  activeUpvote: {
    color: 'green',
    borderColor: 'green',
  },
  activeDownvote: {
    color: 'red',
    borderColor: 'red',
  },
  count: {
    fontSize: '1.1rem',
    fontWeight: 'bold',
  },
};
