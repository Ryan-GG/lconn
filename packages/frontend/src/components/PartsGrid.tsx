import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import type { LdrawPartSummary, PaginatedResponse } from '@lconn/shared';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { PartTile } from './parts/PartTile';

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

export function PartsGrid() {
  const [page, setPage] = useState(1);
  const limit = 24;
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [partType, setPartType] = useState('all');

  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
    sortBy: 'filename',
    order: 'asc',
  });
  if (search) params.set('search', search);
  if (partType !== 'all') params.set('partType', partType);

  const { data, isLoading, error } = useQuery({
    queryKey: ['parts', page, limit, search, partType],
    queryFn: () => fetchParts(params),
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearch(searchInput);
    setPage(1);
  };

  const handlePartTypeChange = (value: string) => {
    setPartType(value);
    setPage(1);
  };

  const totalPages = data?.pagination.totalPages ?? 1;
  const total = data?.pagination.total ?? 0;
  const showing = data?.data.length ?? 0;

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

        <Select value={partType} onValueChange={handlePartTypeChange}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Part type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="part">Part</SelectItem>
            <SelectItem value="subpart">Subpart</SelectItem>
            <SelectItem value="primitive">Primitive</SelectItem>
          </SelectContent>
        </Select>

        <span className="text-sm text-muted-foreground">
          Showing {showing} of {total} parts
        </span>
      </div>

      {error && <p className="text-destructive mb-4">{error.message}</p>}

      {isLoading ? (
        <p className="text-muted-foreground">Loading parts...</p>
      ) : !data || data.data.length === 0 ? (
        <p className="text-muted-foreground italic">No parts found.</p>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {data.data.map((part) => (
              <PartTile key={part.filename} part={part} />
            ))}
          </div>

          <div className="flex items-center justify-center gap-4 mt-6">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
            >
              Previous
            </Button>
            <span className="text-sm text-muted-foreground">
              Page {page} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
            >
              Next
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
