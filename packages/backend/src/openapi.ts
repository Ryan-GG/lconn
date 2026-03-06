import {
  OpenAPIRegistry,
  OpenApiGeneratorV31,
} from '@asteasolutions/zod-to-openapi';
import { ldrawPartSchema, ldrawPartSummarySchema, listPartsQuerySchema } from './schemas/ldraw';
import { errorResponseSchema, paginatedResponseSchema, successResponseSchema } from './schemas/common';

const registry = new OpenAPIRegistry();

// Register component schemas
registry.register('LdrawPart', ldrawPartSchema);
registry.register('LdrawPartSummary', ldrawPartSummarySchema);
registry.register('ErrorResponse', errorResponseSchema);

// GET /api/ldraw/parts
registry.registerPath({
  method: 'get',
  path: '/api/ldraw/parts',
  summary: 'List LDraw parts',
  description: 'Returns a paginated list of LDraw parts (without content).',
  request: {
    query: listPartsQuerySchema,
  },
  responses: {
    200: {
      description: 'Paginated list of parts',
      content: {
        'application/json': {
          schema: paginatedResponseSchema(ldrawPartSummarySchema),
        },
      },
    },
    400: {
      description: 'Invalid query parameters',
      content: {
        'application/json': { schema: errorResponseSchema },
      },
    },
  },
});

// GET /api/ldraw/parts/{filename}
registry.registerPath({
  method: 'get',
  path: '/api/ldraw/parts/{filename}',
  summary: 'Get a single LDraw part',
  description: 'Returns a single LDraw part by filename, including content.',
  request: {
    params: ldrawPartSchema.pick({ filename: true }),
  },
  responses: {
    200: {
      description: 'The requested part',
      content: {
        'application/json': {
          schema: successResponseSchema(ldrawPartSchema),
        },
      },
    },
    404: {
      description: 'Part not found',
      content: {
        'application/json': { schema: errorResponseSchema },
      },
    },
  },
});

export function generateOpenAPIDocument() {
  const generator = new OpenApiGeneratorV31(registry.definitions);
  return generator.generateDocument({
    openapi: '3.1.0',
    info: {
      title: 'LCONN API',
      version: '1.0.0',
      description: 'API for the LCONN platform',
    },
  });
}
