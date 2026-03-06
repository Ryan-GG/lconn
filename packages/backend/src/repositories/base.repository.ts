import { count as drizzleCount, type SQL, type Table } from 'drizzle-orm';
import type { InferInsertModel, InferSelectModel } from 'drizzle-orm';
import type { NodePgDatabase } from 'drizzle-orm/node-postgres';
import type { PaginatedResponse } from '@lconn/shared';

export interface FindPaginatedOptions {
  page: number;
  limit: number;
  where?: SQL;
  orderBy?: SQL;
  columns?: Record<string, unknown>;
}

export class BaseRepository<TTable extends Table> {
  constructor(
    protected db: NodePgDatabase<any>,
    protected table: TTable,
  ) {}

  async findAll(where?: SQL): Promise<InferSelectModel<TTable>[]> {
    const query = this.db.select().from(this.table as any);
    return (where ? query.where(where) : query) as unknown as Promise<InferSelectModel<TTable>[]>;
  }

  async findOne(where: SQL): Promise<InferSelectModel<TTable> | undefined> {
    const rows = await this.db.select().from(this.table as any).where(where).limit(1);
    return rows[0] as InferSelectModel<TTable> | undefined;
  }

  async count(where?: SQL): Promise<number> {
    const query = this.db.select({ total: drizzleCount() }).from(this.table as any);
    const [result] = where ? await query.where(where) : await query;
    return result?.total ?? 0;
  }

  async findPaginated<T = InferSelectModel<TTable>>(
    options: FindPaginatedOptions,
  ): Promise<PaginatedResponse<T>> {
    const { page, limit, where, orderBy, columns } = options;
    const offset = (page - 1) * limit;

    let query: any = columns
      ? this.db.select(columns as any).from(this.table as any)
      : this.db.select().from(this.table as any);
    if (where) query = query.where(where);
    if (orderBy) query = query.orderBy(orderBy);
    query = query.limit(limit).offset(offset);

    const [data, total] = await Promise.all([query as Promise<T[]>, this.count(where)]);

    return {
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async create(data: InferInsertModel<TTable>): Promise<InferSelectModel<TTable>> {
    const [row] = await (this.db
      .insert(this.table as any)
      .values(data as any)
      .returning() as unknown as Promise<InferSelectModel<TTable>[]>);
    return row;
  }

  async update(
    where: SQL,
    data: Partial<InferInsertModel<TTable>>,
  ): Promise<InferSelectModel<TTable> | undefined> {
    const [row] = await (this.db
      .update(this.table as any)
      .set(data as any)
      .where(where)
      .returning() as unknown as Promise<InferSelectModel<TTable>[]>);
    return row;
  }

  async delete(where: SQL): Promise<InferSelectModel<TTable> | undefined> {
    const [row] = await (this.db
      .delete(this.table as any)
      .where(where)
      .returning() as unknown as Promise<InferSelectModel<TTable>[]>);
    return row;
  }
}
