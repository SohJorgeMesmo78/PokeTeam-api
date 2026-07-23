import { Response } from 'express';
import { prisma } from '../config/db';
import { AuthRequest } from '../middlewares/authMiddleware';

export const getUserSavedPokemons = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ error: 'Usuário não autenticado.' });
    }

    const pokemons = await prisma.savedPokemon.findMany({
      where: { userId },
      orderBy: { updatedAt: 'desc' }
    });

    const formatted = pokemons.map((p) => ({
      id: p.id,
      pokemonId: p.pokemonId,
      pokemonName: p.pokemonName,
      nickname: p.nickname,
      spriteUrl: p.spriteUrl,
      types: JSON.parse(p.types || '[]'),
      nature: p.nature,
      abilityName: p.abilityName,
      move1: p.move1,
      move2: p.move2,
      move3: p.move3,
      move4: p.move4,
      createdAt: p.createdAt,
      updatedAt: p.updatedAt
    }));

    res.json(formatted);
  } catch (error) {
    console.error('Erro ao buscar Pokémon salvos:', error);
    res.status(500).json({ error: 'Erro interno ao carregar os Pokémon salvos.' });
  }
};

export const getSavedPokemonById = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    const id = parseInt(String(req.params.id), 10);

    if (!userId || isNaN(id)) {
      return res.status(400).json({ error: 'ID inválido ou usuário não autenticado.' });
    }

    const p = await prisma.savedPokemon.findFirst({
      where: { id, userId }
    });

    if (!p) {
      return res.status(404).json({ error: 'Pokémon salvo não encontrado.' });
    }

    res.json({
      id: p.id,
      pokemonId: p.pokemonId,
      pokemonName: p.pokemonName,
      nickname: p.nickname,
      spriteUrl: p.spriteUrl,
      types: JSON.parse(p.types || '[]'),
      nature: p.nature,
      abilityName: p.abilityName,
      move1: p.move1,
      move2: p.move2,
      move3: p.move3,
      move4: p.move4,
      createdAt: p.createdAt,
      updatedAt: p.updatedAt
    });
  } catch (error) {
    console.error('Erro ao buscar Pokémon salvo:', error);
    res.status(500).json({ error: 'Erro interno ao carregar o Pokémon salvo.' });
  }
};

export const createSavedPokemon = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ error: 'Usuário não autenticado.' });
    }

    const {
      pokemonId,
      pokemonName,
      nickname,
      spriteUrl,
      types,
      nature,
      abilityName,
      move1,
      move2,
      move3,
      move4
    } = req.body;

    if (!pokemonId || !pokemonName) {
      return res.status(400).json({ error: 'pokemonId e pokemonName são obrigatórios.' });
    }

    const created = await prisma.savedPokemon.create({
      data: {
        userId,
        pokemonId: Number(pokemonId),
        pokemonName: String(pokemonName),
        nickname: nickname ? String(nickname) : String(pokemonName),
        spriteUrl: spriteUrl || `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonId}.png`,
        types: JSON.stringify(Array.isArray(types) ? types : []),
        nature: nature ? String(nature) : 'Hardy',
        abilityName: abilityName ? String(abilityName) : null,
        move1: move1 ? String(move1) : null,
        move2: move2 ? String(move2) : null,
        move3: move3 ? String(move3) : null,
        move4: move4 ? String(move4) : null
      }
    });

    res.status(201).json({
      id: created.id,
      pokemonId: created.pokemonId,
      pokemonName: created.pokemonName,
      nickname: created.nickname,
      spriteUrl: created.spriteUrl,
      types: JSON.parse(created.types || '[]'),
      nature: created.nature,
      abilityName: created.abilityName,
      move1: created.move1,
      move2: created.move2,
      move3: created.move3,
      move4: created.move4,
      createdAt: created.createdAt,
      updatedAt: created.updatedAt
    });
  } catch (error) {
    console.error('Erro ao salvar Pokémon:', error);
    res.status(500).json({ error: 'Erro interno ao salvar o Pokémon.' });
  }
};

export const updateSavedPokemon = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    const id = parseInt(String(req.params.id), 10);

    if (!userId || isNaN(id)) {
      return res.status(400).json({ error: 'ID inválido ou usuário não autenticado.' });
    }

    const existing = await prisma.savedPokemon.findFirst({
      where: { id, userId }
    });

    if (!existing) {
      return res.status(404).json({ error: 'Pokémon salvo não encontrado.' });
    }

    const {
      nickname,
      spriteUrl,
      types,
      nature,
      abilityName,
      move1,
      move2,
      move3,
      move4
    } = req.body;

    const updated = await prisma.savedPokemon.update({
      where: { id },
      data: {
        nickname: nickname !== undefined ? String(nickname) : existing.nickname,
        spriteUrl: spriteUrl !== undefined ? String(spriteUrl) : existing.spriteUrl,
        types: types !== undefined ? JSON.stringify(Array.isArray(types) ? types : []) : existing.types,
        nature: nature !== undefined ? String(nature) : existing.nature,
        abilityName: abilityName !== undefined ? String(abilityName) : existing.abilityName,
        move1: move1 !== undefined ? (move1 ? String(move1) : null) : existing.move1,
        move2: move2 !== undefined ? (move2 ? String(move2) : null) : existing.move2,
        move3: move3 !== undefined ? (move3 ? String(move3) : null) : existing.move3,
        move4: move4 !== undefined ? (move4 ? String(move4) : null) : existing.move4
      }
    });

    res.json({
      id: updated.id,
      pokemonId: updated.pokemonId,
      pokemonName: updated.pokemonName,
      nickname: updated.nickname,
      spriteUrl: updated.spriteUrl,
      types: JSON.parse(updated.types || '[]'),
      nature: updated.nature,
      abilityName: updated.abilityName,
      move1: updated.move1,
      move2: updated.move2,
      move3: updated.move3,
      move4: updated.move4,
      createdAt: updated.createdAt,
      updatedAt: updated.updatedAt
    });
  } catch (error) {
    console.error('Erro ao atualizar Pokémon salvo:', error);
    res.status(500).json({ error: 'Erro interno ao atualizar o Pokémon salvo.' });
  }
};

export const deleteSavedPokemon = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    const id = parseInt(String(req.params.id), 10);

    if (!userId || isNaN(id)) {
      return res.status(400).json({ error: 'ID inválido ou usuário não autenticado.' });
    }

    const existing = await prisma.savedPokemon.findFirst({
      where: { id, userId }
    });

    if (!existing) {
      return res.status(404).json({ error: 'Pokémon salvo não encontrado.' });
    }

    await prisma.savedPokemon.delete({ where: { id } });
    res.json({ message: 'Pokémon excluído com sucesso.' });
  } catch (error) {
    console.error('Erro ao excluir Pokémon salvo:', error);
    res.status(500).json({ error: 'Erro interno ao excluir o Pokémon.' });
  }
};
