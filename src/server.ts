import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pokemonRoutes from './routes/pokemonRoutes';
import authRoutes from './routes/authRoutes';
import teamRoutes from './routes/teamRoutes';
import savedPokemonRoutes from './routes/savedPokemonRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
  origin: ['http://localhost:4200', 'https://poke-team-portal.vercel.app', 'https://poketeam.seteoito.dev'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));
app.use(express.json());

app.get('/', (req, res) => {
  res.send({ message: 'PokeTeam API rodando perfeitamente!' });
});

app.use('/api/auth', authRoutes);
app.use('/api/teams', teamRoutes);
app.use('/api/saved-pokemons', savedPokemonRoutes);
app.use('/api', pokemonRoutes);

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});