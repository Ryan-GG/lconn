import { VoteButtons } from './VoteButtons';
import type { Connection } from '@lconn/shared';

interface ConnectionSpecCardProps {
  id: string;
  connections: Connection[];
  voteCount: number;
  createdAt: Date;
  onVoteChange?: () => void;
}

export const ConnectionSpecCard = ({
  id,
  connections,
  voteCount,
  createdAt,
  onVoteChange,
}: ConnectionSpecCardProps) => {
  return (
    <div style={styles.card}>
      <div style={styles.voteSection}>
        <VoteButtons
          connectionSpecId={id}
          initialVoteCount={voteCount}
          onVoteChange={onVoteChange}
        />
      </div>
      <div style={styles.content}>
        <h3>Connection Specification</h3>
        <div style={styles.connections}>
          {connections.map((conn, idx) => (
            <div key={idx} style={styles.connection}>
              <strong>Type:</strong> {conn.type}
              {conn.description && (
                <>
                  <br />
                  <span style={styles.description}>{conn.description}</span>
                </>
              )}
            </div>
          ))}
        </div>
        <p style={styles.date}>
          Created: {new Date(createdAt).toLocaleDateString()}
        </p>
      </div>
    </div>
  );
};

const styles = {
  card: {
    display: 'flex',
    gap: '1rem',
    padding: '1rem',
    border: '1px solid #ddd',
    borderRadius: '8px',
    marginBottom: '1rem',
  },
  voteSection: {
    flexShrink: 0,
  },
  content: {
    flex: 1,
  },
  connections: {
    marginTop: '1rem',
  },
  connection: {
    padding: '0.75rem',
    backgroundColor: '#f5f5f5',
    borderRadius: '4px',
    marginBottom: '0.5rem',
  },
  description: {
    fontSize: '0.9rem',
    color: '#666',
  },
  date: {
    fontSize: '0.85rem',
    color: '#888',
    marginTop: '1rem',
  },
};
