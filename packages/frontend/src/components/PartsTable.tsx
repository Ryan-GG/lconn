import { useState } from 'react';
import type { SortingState } from '@tanstack/react-table';
import { useQuery } from '@tanstack/react-query';
import type { LdrawPartSummary, PaginatedResponse } from '@lconn/shared';
import { columns } from './parts/columns';
import { DataTable } from './parts/data-table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

async function fetchParts(params: URLSearchParams): Promise<PaginatedResponse<LdrawPartSummary>> {
  const response = await fetch(`${API_URL}/api/ldraw/parts?${params.toString()}`, {
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const result = await response.json();
  if (!result.success) {
    throw new Error(result.error || 'Unknown error');
  }
  return result.data;
}

export const PartsTable = () => {
  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [sorting, setSorting] = useState<SortingState>([
    { id: 'filename', desc: false },
  ]);

  const sortBy = sorting[0]?.id ?? 'filename';
  const order = sorting[0]?.desc ? 'desc' : 'asc';

  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
    sortBy,
    order,
  });
  if (search) params.set('search', search);

  const { data, isLoading, error } = useQuery({
    queryKey: ['parts', page, limit, sortBy, order, search],
    queryFn: () => fetchParts(params),
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearch(searchInput);
    setPage(1);
  };

  const handleSortingChange = (newSorting: SortingState) => {
    setSorting(newSorting);
    setPage(1);
  };

  return (
    <div className="py-8">
      <h2 className="text-xl mb-4 text-foreground">LDraw Parts</h2>

      <div className="flex flex-wrap items-center gap-4 mb-4">
        <form onSubmit={handleSearch} className="flex gap-2">
          <Input
            type="text"
            placeholder="Search parts..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="w-[250px]"
          />
          <Button type="submit" variant="outline">Search</Button>
        </form>
      </div>

      {error && <p className="text-destructive">{error.message}</p>}

      {isLoading ? (
        <p className="text-muted-foreground">Loading parts...</p>
      ) : !data || data.data.length === 0 ? (
        <p className="text-muted-foreground italic">No parts found.</p>
      ) : (
        <DataTable
          columns={columns}
          data={data.data}
          sorting={sorting}
          onSortingChange={handleSortingChange}
          page={data.pagination.page}
          totalPages={data.pagination.totalPages}
          total={data.pagination.total}
          onPageChange={setPage}
        />
      )}
    </div>
  );
};
