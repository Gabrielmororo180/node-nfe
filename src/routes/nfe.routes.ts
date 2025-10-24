
import { Router } from 'express';
import { nfeController } from '../controllers/nfe.controller';

const router = Router();

router.post('/emitir', nfeController.emitirNFe);
router.post('/cancelar', nfeController.CancelarNFe);

export default router;