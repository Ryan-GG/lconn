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

// ─── Geometry schemas ───

export const vertexSchema = z.object({
  x: z.number(),
  y: z.number(),
  z: z.number(),
}).openapi('Vertex');

export const transformMatrixSchema = z.object({
  x: z.number(), y: z.number(), z: z.number(),
  a: z.number(), b: z.number(), c: z.number(),
  d: z.number(), e: z.number(), f: z.number(),
  g: z.number(), h: z.number(), i: z.number(),
}).openapi('TransformMatrix');

export const ldrawSubfileRefSchema = z.object({
  colorCode: z.number(),
  filename: z.string(),
  transform: transformMatrixSchema,
}).openapi('LdrawSubfileRef');

export const ldrawLineSegmentSchema = z.object({
  colorCode: z.number(),
  v1: vertexSchema,
  v2: vertexSchema,
}).openapi('LdrawLineSegment');

export const ldrawTriangleSchema = z.object({
  colorCode: z.number(),
  v1: vertexSchema,
  v2: vertexSchema,
  v3: vertexSchema,
}).openapi('LdrawTriangle');

export const ldrawQuadSchema = z.object({
  colorCode: z.number(),
  v1: vertexSchema,
  v2: vertexSchema,
  v3: vertexSchema,
  v4: vertexSchema,
}).openapi('LdrawQuad');

export const ldrawPartGeometrySchema = z.object({
  filename: z.string(),
  subfileRefs: z.array(ldrawSubfileRefSchema),
  lines: z.array(ldrawLineSegmentSchema),
  triangles: z.array(ldrawTriangleSchema),
  quads: z.array(ldrawQuadSchema),
}).openapi('LdrawPartGeometry');

// Compile-time type compatibility checks
type AssertAssignable<_T extends U, U> = true;
type _CheckPart = AssertAssignable<z.infer<typeof ldrawPartSchema>, LdrawPart>;
type _CheckSummary = AssertAssignable<z.infer<typeof ldrawPartSummarySchema>, LdrawPartSummary>;
