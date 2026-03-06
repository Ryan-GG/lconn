import { Router } from 'express';
import { db } from '../config/database';
import { LdrawPartRepository } from '../repositories/ldraw-part.repository';
import { LdrawPartController } from '../controllers/ldraw-part.controller';

const router = Router();
const repo = new LdrawPartRepository(db);
const controller = new LdrawPartController(repo);

router.get('/parts', controller.listParts);
router.get('/parts/*', controller.getPartByFilename);

export default router;
