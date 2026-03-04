import { useState } from 'react';
import { useApi } from '../hooks/useApi';
import type { LdrawPartSummary, LdrawPartType, PaginatedResponse } from '@lconn/shared';

export const PartsTable = () => {
  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [partType, setPartType] = useState<LdrawPartType | ''>('part');
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [sortBy, setSortBy] = useState('filename');
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');

  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
    sortBy,
    order,
  });
  if (partType) params.set('partType', partType);
  if (search) params.set('search', search);

  const { data, loading, error } = useApi<PaginatedResponse<LdrawPartSummary>>(
    `/api/ldraw/parts?${params.toString()}`,
  );

  const handleSort = (column: string) => {
    if (sortBy === column) {
      setOrder(order === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setOrder('asc');
    }
    setPage(1);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearch(searchInput);
    setPage(1);
  };

  const sortIndicator = (column: string) => {
    if (sortBy !== column) return '';
    return order === 'asc' ? ' ▲' : ' ▼';
  };

  return (
    <div style={styles.wrapper}>
      <h2 style={styles.heading}>LDraw Parts</h2>

      <div style={styles.controls}>
        <form onSubmit={handleSearch} style={styles.searchForm}>
          <input
            type="text"
            placeholder="Search parts..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            style={styles.searchInput}
          />
          <button type="submit" style={styles.button}>Search</button>
        </form>

        <select
          value={partType}
          onChange={(e) => { setPartType(e.target.value as LdrawPartType | ''); setPage(1); }}
          style={styles.select}
        >
          <option value="">All Types</option>
          <option value="part">Parts</option>
          <option value="subpart">Sub-parts</option>
          <option value="primitive">Primitives</option>
        </select>
      </div>

      {error && <p style={styles.error}>{error}</p>}

      {loading ? (
        <p style={styles.loading}>Loading parts...</p>
      ) : !data || data.data.length === 0 ? (
        <p style={styles.empty}>No parts found.</p>
      ) : (
        <>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th} onClick={() => handleSort('filename')}>
                  Filename{sortIndicator('filename')}
                </th>
                <th style={styles.th} onClick={() => handleSort('description')}>
                  Description{sortIndicator('description')}
                </th>
                <th style={styles.th} onClick={() => handleSort('partType')}>
                  Type{sortIndicator('partType')}
                </th>
              </tr>
            </thead>
            <tbody>
              {data.data.map((part) => (
                <tr key={part.filename} style={styles.tr}>
                  <td style={styles.td}>{part.filename}</td>
                  <td style={styles.td}>{part.description}</td>
                  <td style={styles.td}>{part.partType}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div style={styles.pagination}>
            <button
              onClick={() => setPage(page - 1)}
              disabled={page <= 1}
              style={styles.button}
            >
              Previous
            </button>
            <span style={styles.pageInfo}>
              Page {data.pagination.page} of {data.pagination.totalPages} ({data.pagination.total} total)
            </span>
            <button
              onClick={() => setPage(page + 1)}
              disabled={page >= data.pagination.totalPages}
              style={styles.button}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

const styles = {
  wrapper: {
    padding: '2rem 0',
  },
  heading: {
    fontSize: '1.5rem',
    marginBottom: '1rem',
    color: '#333',
  },
  controls: {
    display: 'flex',
    gap: '1rem',
    marginBottom: '1rem',
    flexWrap: 'wrap' as const,
    alignItems: 'center',
  },
  searchForm: {
    display: 'flex',
    gap: '0.5rem',
  },
  searchInput: {
    padding: '0.5rem',
    border: '1px solid #ccc',
    borderRadius: '4px',
    fontSize: '0.9rem',
    width: '250px',
  },
  select: {
    padding: '0.5rem',
    border: '1px solid #ccc',
    borderRadius: '4px',
    fontSize: '0.9rem',
  },
  button: {
    padding: '0.5rem 1rem',
    border: '1px solid #ccc',
    borderRadius: '4px',
    background: '#f5f5f5',
    cursor: 'pointer',
    fontSize: '0.9rem',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse' as const,
    fontSize: '0.9rem',
  },
  th: {
    textAlign: 'left' as const,
    padding: '0.75rem',
    borderBottom: '2px solid #ddd',
    cursor: 'pointer',
    userSelect: 'none' as const,
    color: '#333',
  },
  tr: {
    borderBottom: '1px solid #eee',
  },
  td: {
    padding: '0.75rem',
    color: '#444',
  },
  pagination: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '1rem',
    marginTop: '1rem',
  },
  pageInfo: {
    color: '#666',
    fontSize: '0.9rem',
  },
  error: {
    color: '#c00',
  },
  loading: {
    color: '#666',
  },
  empty: {
    color: '#666',
    fontStyle: 'italic' as const,
  },
};
