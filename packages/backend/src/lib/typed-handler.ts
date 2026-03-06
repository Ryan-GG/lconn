import type { RequestHandler, Request, Response, NextFunction } from 'express';
import type { ZodType, z } from 'zod';

export function typedHandler<
  TQuery extends ZodType | undefined = undefined,
  TParams extends ZodType | undefined = undefined,
  TBody extends ZodType | undefined = undefined,
>(
  _schemas: { query?: TQuery; params?: TParams; body?: TBody },
  handler: (
    req: Request<
      TParams extends ZodType ? z.infer<TParams> : Record<string, string>,
      unknown,
      TBody extends ZodType ? z.infer<TBody> : unknown,
      TQuery extends ZodType ? z.infer<TQuery> : Record<string, string>
    >,
    res: Response,
    next: NextFunction,
  ) => Promise<void> | void,
): RequestHandler {
  return async (req, res, next) => {
    try {
      await handler(req as any, res, next);
    } catch (err) {
      next(err);
    }
  };
}
