import { Link } from 'react-router-dom';
import { useApi } from '../../hooks/useApi';
import type { Part, PaginatedResponse } from '@lconn/shared';

export const PartsList = () => {
  const { data, loading, error } = useApi<PaginatedResponse<Part>>('/api/parts');

  if (loading) return <div>Loading parts...</div>;
  if (error) return <div style={{ color: 'red' }}>Error: {error}</div>;
  if (!data || data.data.length === 0) return <div>No parts found. Create the first one!</div>;

  return (
    <div style={styles.container}>
      <h2>LEGO Parts</h2>
      <div style={styles.grid}>
        {data.data.map((part) => (
          <Link key={part.id} to={`/parts/${part.id}`} style={styles.card}>
            <h3>{part.name}</h3>
            {part.partNumber && (
              <p style={styles.partNumber}>Part #{part.partNumber}</p>
            )}
            {part.description && <p style={styles.description}>{part.description}</p>}
          </Link>
        ))}
      </div>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 1rem',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
    gap: '1rem',
    marginTop: '1rem',
  },
  card: {
    padding: '1.5rem',
    border: '1px solid #ddd',
    borderRadius: '8px',
    textDecoration: 'none',
    color: 'inherit',
    transition: 'box-shadow 0.2s',
    cursor: 'pointer',
  },
  partNumber: {
    fontSize: '0.9rem',
    color: '#666',
    marginTop: '0.5rem',
  },
  description: {
    fontSize: '0.85rem',
    color: '#888',
    marginTop: '0.5rem',
  },
};
