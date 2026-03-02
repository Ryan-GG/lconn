import { ConnectionSpecCard } from './ConnectionSpecCard';
import { useApi } from '../../hooks/useApi';
import type { PaginatedResponse } from '@lconn/shared';

interface ConnectionSpec {
  id: string;
  partId: string;
  specData: any[];
  voteCount: number;
  createdAt: string;
}

interface ConnectionSpecListProps {
  partId: string;
}

export const ConnectionSpecList = ({ partId }: ConnectionSpecListProps) => {
  const { data, loading, error, refetch } = useApi<PaginatedResponse<ConnectionSpec>>(
    `/api/connections?partId=${partId}`
  );

  if (loading) return <div>Loading connection specs...</div>;
  if (error) return <div style={{ color: 'red' }}>Error: {error}</div>;
  if (!data || data.data.length === 0) {
    return <div>No connection specifications yet. Be the first to add one!</div>;
  }

  return (
    <div>
      <h2>Connection Specifications ({data.data.length})</h2>
      {data.data.map((spec) => (
        <ConnectionSpecCard
          key={spec.id}
          id={spec.id}
          connections={spec.specData}
          voteCount={spec.voteCount}
          createdAt={new Date(spec.createdAt)}
          onVoteChange={refetch}
        />
      ))}
    </div>
  );
};
