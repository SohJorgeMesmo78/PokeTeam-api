import { Router } from 'express';
import { authenticateToken } from '../middlewares/authMiddleware';
import {
  getUserSavedPokemons,
  getSavedPokemonById,
  createSavedPokemon,
  updateSavedPokemon,
  deleteSavedPokemon
} from '../controllers/savedPokemonController';

const router = Router();

router.use(authenticateToken);

router.get('/', getUserSavedPokemons);
router.get('/:id', getSavedPokemonById);
router.post('/', createSavedPokemon);
router.put('/:id', updateSavedPokemon);
router.delete('/:id', deleteSavedPokemon);

export default router;
