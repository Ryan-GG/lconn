import { z } from 'zod';
import { createSelectSchema } from 'drizzle-zod';
import { ldrawParts, ldrawPartTypeEnum } from '../db/schema';
import { paginationQuerySchema } from './common';
import type { LdrawPart, LdrawPartSummary } from '@lconn/shared';

const ldrawPartSelectSchema = createSelectSchema(ldrawParts);

export const ldrawPartSchema = ldrawPartSelectSchema.openapi('LdrawPart');

export const ldrawPartSummarySchema = ldrawPartSelectSchema
  .pick({
    filename: true,
    description: true,
    partType: true,
    createdAt: true,
    updatedAt: true,
  })
  .openapi('LdrawPartSummary');

const partTypeValues = ldrawPartTypeEnum.enumValues;

export const listPartsQuerySchema = paginationQuerySchema.extend({
  partType: z.enum(partTypeValues).optional(),
  search: z.string().optional(),
  sortBy: z.enum(['filename', 'description', 'partType']).default('filename'),
}).openapi('ListPartsQuery');

// Compile-time type compatibility checks
type AssertAssignable<_T extends U, U> = true;
type _CheckPart = AssertAssignable<z.infer<typeof ldrawPartSchema>, LdrawPart>;
type _CheckSummary = AssertAssignable<z.infer<typeof ldrawPartSummarySchema>, LdrawPartSummary>;
