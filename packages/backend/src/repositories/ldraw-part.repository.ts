import { and, eq, ilike, or, asc, desc } from 'drizzle-orm';
import type { NodePgDatabase } from 'drizzle-orm/node-postgres';
import type { z } from 'zod';
import { ldrawParts } from '../db/schema';
import type { listPartsQuerySchema } from '../schemas/ldraw';
import { BaseRepository } from './base.repository';
import type { LdrawPartSummary, PaginatedResponse } from '@lconn/shared';

type ListPartsParams = z.infer<typeof listPartsQuerySchema>;

const summaryColumns = {
  filename: ldrawParts.filename,
  description: ldrawParts.description,
  partType: ldrawParts.partType,
  createdAt: ldrawParts.createdAt,
  updatedAt: ldrawParts.updatedAt,
};

export class LdrawPartRepository extends BaseRepository<typeof ldrawParts> {
  constructor(db: NodePgDatabase<any>) {
    super(db, ldrawParts);
  }

  async listParts(params: ListPartsParams): Promise<PaginatedResponse<LdrawPartSummary>> {
    const { page, limit, partType, search, sortBy, order } = params;

    const where = and(
      partType ? eq(ldrawParts.partType, partType) : undefined,
      search
        ? or(
            ilike(ldrawParts.filename, `%${search}%`),
            ilike(ldrawParts.description, `%${search}%`),
          )
        : undefined,
    );

    const sortColumn =
      sortBy === 'description'
        ? ldrawParts.description
        : sortBy === 'partType'
          ? ldrawParts.partType
          : ldrawParts.filename;
    const orderBy = (order === 'desc' ? desc : asc)(sortColumn);

    return this.findPaginated<LdrawPartSummary>({
      page,
      limit,
      where,
      orderBy,
      columns: summaryColumns,
    });
  }

  async findByFilename(filename: string) {
    return this.findOne(eq(ldrawParts.filename, filename));
  }
}
