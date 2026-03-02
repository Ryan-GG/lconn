import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiPost } from '../../hooks/useApi';
import { ConnectionType } from '@lconn/shared';
import type { CreateConnectionSpecRequest } from '@lconn/shared';

interface CreateConnectionFormProps {
  partId: string;
}

export const CreateConnectionForm = ({ partId }: CreateConnectionFormProps) => {
  const navigate = useNavigate();
  const [connectionType, setConnectionType] = useState<ConnectionType>(ConnectionType.STUD);
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const request: CreateConnectionSpecRequest = {
        partId,
        connections: [
          {
            type: connectionType,
            description: description.trim() || undefined,
          },
        ],
      };

      await apiPost('/api/connections', request);
      navigate(`/parts/${partId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create connection spec');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <h2>Add Connection Specification</h2>
      {error && <div style={styles.error}>{error}</div>}
      <div style={styles.field}>
        <label htmlFor="type" style={styles.label}>
          Connection Type *
        </label>
        <select
          id="type"
          value={connectionType}
          onChange={(e) => setConnectionType(e.target.value as ConnectionType)}
          style={styles.input}
        >
          <option value={ConnectionType.STUD}>Stud</option>
          <option value={ConnectionType.ANTI_STUD}>Anti-Stud</option>
        </select>
      </div>
      <div style={styles.field}>
        <label htmlFor="description" style={styles.label}>
          Description (optional)
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          style={{ ...styles.input, minHeight: '100px' }}
          placeholder="Describe this connection..."
        />
      </div>
      <div style={styles.info}>
        <p>
          Note: This is a simplified form. More connection properties will be added as the
          community defines them through pull requests to the TypeScript type definitions.
        </p>
      </div>
      <button type="submit" disabled={loading} style={styles.button}>
        {loading ? 'Creating...' : 'Create Connection Spec'}
      </button>
    </form>
  );
};

const styles = {
  form: {
    maxWidth: '600px',
    margin: '2rem auto',
    padding: '2rem',
    border: '1px solid #ddd',
    borderRadius: '8px',
  },
  field: {
    marginBottom: '1.5rem',
  },
  label: {
    display: 'block',
    marginBottom: '0.5rem',
    fontWeight: 'bold',
  },
  input: {
    width: '100%',
    padding: '0.75rem',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '1rem',
  },
  info: {
    padding: '1rem',
    backgroundColor: '#f0f8ff',
    borderRadius: '4px',
    marginBottom: '1rem',
    fontSize: '0.9rem',
  },
  button: {
    padding: '0.75rem 1.5rem',
    backgroundColor: '#0366d6',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '1rem',
  },
  error: {
    padding: '1rem',
    backgroundColor: '#fee',
    color: '#c00',
    borderRadius: '4px',
    marginBottom: '1rem',
  },
};
