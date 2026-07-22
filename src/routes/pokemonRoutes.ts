import { Router } from 'express';
import { getPokemons, getPokemonById, getTypes, getGames, syncPokemonsApi } from '../controllers/pokemonController';

const router = Router();

router.get('/pokemons', getPokemons);
router.get('/pokemons/:idOrName', getPokemonById);
router.get('/types', getTypes);
router.get('/games', getGames);
router.post('/pokemons/sync', syncPokemonsApi);

export default router;
