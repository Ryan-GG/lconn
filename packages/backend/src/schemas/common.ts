import { z } from 'zod';
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';

extendZodWithOpenApi(z);

export const paginationQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  sortBy: z.string().optional(),
  order: z.enum(['asc', 'desc']).default('asc'),
});

export const paginationMetaSchema = z.object({
  page: z.number(),
  limit: z.number(),
  total: z.number(),
  totalPages: z.number(),
});

export const errorResponseSchema = z.object({
  success: z.literal(false),
  error: z.string(),
}).openapi('ErrorResponse');

export function successResponseSchema<T extends z.ZodTypeAny>(dataSchema: T) {
  return z.object({
    success: z.literal(true),
    data: dataSchema,
  });
}

export function paginatedResponseSchema<T extends z.ZodTypeAny>(itemSchema: T) {
  return successResponseSchema(
    z.object({
      data: z.array(itemSchema),
      pagination: paginationMetaSchema,
    }),
  );
}
