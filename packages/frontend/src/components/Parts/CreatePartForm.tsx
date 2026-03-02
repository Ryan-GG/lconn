import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiPost } from '../../hooks/useApi';
import type { CreatePartRequest, Part } from '@lconn/shared';

export const CreatePartForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<CreatePartRequest>({
    name: '',
    partNumber: '',
    description: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const part = await apiPost<Part>('/api/parts', formData);
      navigate(`/parts/${part.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create part');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <h2>Create New Part</h2>
      {error && <div style={styles.error}>{error}</div>}
      <div style={styles.field}>
        <label htmlFor="name" style={styles.label}>
          Part Name *
        </label>
        <input
          id="name"
          type="text"
          required
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          style={styles.input}
          placeholder="e.g., 2x4 Brick"
        />
      </div>
      <div style={styles.field}>
        <label htmlFor="partNumber" style={styles.label}>
          Part Number (optional)
        </label>
        <input
          id="partNumber"
          type="text"
          value={formData.partNumber}
          onChange={(e) => setFormData({ ...formData, partNumber: e.target.value })}
          style={styles.input}
          placeholder="e.g., 3001"
        />
      </div>
      <div style={styles.field}>
        <label htmlFor="description" style={styles.label}>
          Description (optional)
        </label>
        <textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          style={{ ...styles.input, minHeight: '100px' }}
          placeholder="Describe this LEGO part..."
        />
      </div>
      <button type="submit" disabled={loading} style={styles.button}>
        {loading ? 'Creating...' : 'Create Part'}
      </button>
    </form>
  );
};

const styles = {
  form: {
    maxWidth: '600px',
    margin: '0 auto',
    padding: '2rem',
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
