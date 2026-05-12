import { Router } from 'express';
import { CandidateController } from '../controllers/candidate.controller';
// import { authMiddleware } from '../middleware/auth';
// import { limiter } from '../middleware/rateLimiter'; // Temporairement désactivé

const router = Router();
const controller = new CandidateController();

// router.use(authMiddleware);
// router.use(limiter); // Désactivé pour le test

router.post('/candidates', controller.create.bind(controller));
router.get('/candidates/:id', controller.getById.bind(controller));
router.put('/candidates/:id', controller.update.bind(controller));
router.delete('/candidates/:id', controller.delete.bind(controller));
router.post('/candidates/:id/validate', controller.validate.bind(controller));
router.get('/candidates', controller.list.bind(controller));

export default router;