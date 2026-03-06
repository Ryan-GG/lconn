import { and, eq, ilike, or, asc, desc, sql, inArray } from 'drizzle-orm';
import type { NodePgDatabase } from 'drizzle-orm/node-postgres';
import type { z } from 'zod';
import { ldrawParts, ldrawPartGeometries, ldrawSubfileRefs } from '../db/schema';
import type { listPartsQuerySchema } from '../schemas/ldraw';
import { BaseRepository } from './base.repository';
import type { LdrawPartSummary, LdrawPartGeometry, PaginatedResponse } from '@lconn/shared';

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

  async findGeometryTree(filename: string): Promise<LdrawPartGeometry[]> {
    // Recursive CTE to collect all transitive child filenames
    const allFilenames = await this.db.execute<{ filename: string }>(sql`
      WITH RECURSIVE refs AS (
        SELECT ${filename}::varchar AS filename
        UNION
        SELECT sr.child_filename AS filename
        FROM ldraw_subfile_refs sr
        INNER JOIN refs r ON sr.parent_filename = r.filename
      )
      SELECT filename FROM refs
    `);

    const filenames = allFilenames.rows.map((r) => r.filename);
    if (filenames.length === 0) return [];

    const geometries = await this.db
      .select()
      .from(ldrawPartGeometries)
      .where(inArray(ldrawPartGeometries.filename, filenames));

    return geometries as LdrawPartGeometry[];
  }
}
