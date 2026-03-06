import { listPartsQuerySchema } from '../schemas/ldraw';
import { typedHandler } from '../lib/typed-handler';
import { sendSuccess, sendPaginated, sendError } from '../lib/response';
import type { LdrawPartRepository } from '../repositories/ldraw-part.repository';

export class LdrawPartController {
  constructor(private repo: LdrawPartRepository) {}

  listParts = typedHandler({ query: listPartsQuerySchema }, async (req, res) => {
    const result = await this.repo.listParts(req.query);
    sendPaginated(res, result);
  });

  getPartByFilename = typedHandler({}, async (req, res) => {
    const filename = (req.params as Record<string, string>)[0]?.replace(/\\/g, '/');
    if (!filename) {
      sendError(res, 'Filename is required', 400);
      return;
    }

    const part = await this.repo.findByFilename(filename);
    if (!part) {
      sendError(res, 'Part not found', 404);
      return;
    }

    sendSuccess(res, part);
  });
}
