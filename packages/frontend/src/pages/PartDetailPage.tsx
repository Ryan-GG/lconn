import { useParams, Link } from 'react-router-dom';
import { useApi } from '../hooks/useApi';
import { useAuth } from '../context/AuthContext';
import { ConnectionSpecList } from '../components/Connections/ConnectionSpecList';
import type { Part } from '@lconn/shared';

export const PartDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { data: part, loading, error } = useApi<Part>(`/api/parts/${id}`);

  if (loading) return <div>Loading part details...</div>;
  if (error) return <div style={{ color: 'red' }}>Error: {error}</div>;
  if (!part) return <div>Part not found</div>;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div>
          <h1>{part.name}</h1>
          {part.partNumber && (
            <p style={styles.partNumber}>Part #{part.partNumber}</p>
          )}
          {part.description && <p style={styles.description}>{part.description}</p>}
        </div>
        {user && (
          <Link to={`/parts/${id}/connections/create`} style={styles.button}>
            Add Connection Spec
          </Link>
        )}
      </div>
      <div style={styles.content}>
        <ConnectionSpecList partId={id!} />
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
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '2rem',
  },
  partNumber: {
    fontSize: '1.1rem',
    color: '#666',
    marginTop: '0.5rem',
  },
  description: {
    fontSize: '1rem',
    color: '#666',
    marginTop: '1rem',
  },
  button: {
    padding: '0.75rem 1.5rem',
    backgroundColor: '#0366d6',
    color: 'white',
    textDecoration: 'none',
    borderRadius: '4px',
    fontSize: '1rem',
  },
  content: {
    marginTop: '2rem',
  },
};
