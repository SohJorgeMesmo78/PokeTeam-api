import { Router } from 'express';
import { authenticateToken } from '../middlewares/authMiddleware';
import {
  getUserTeams,
  getTeamById,
  createTeam,
  updateTeam,
  deleteTeam
} from '../controllers/teamController';

const router = Router();

// Apply auth middleware to all team endpoints
router.use(authenticateToken as any);

router.get('/', getUserTeams as any);
router.get('/:id', getTeamById as any);
router.post('/', createTeam as any);
router.put('/:id', updateTeam as any);
router.delete('/:id', deleteTeam as any);

export default router;
