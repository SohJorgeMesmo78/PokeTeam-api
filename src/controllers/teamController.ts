import { Response } from 'express';
import { prisma } from '../config/db';
import { AuthRequest } from '../middlewares/authMiddleware';

export const getUserTeams = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ error: 'Usuário não autenticado.' });
    }

    const teams = await prisma.team.findMany({
      where: { userId },
      include: {
        members: {
          orderBy: { slotPosition: 'asc' }
        }
      },
      orderBy: { updatedAt: 'desc' }
    });

    const formattedTeams = teams.map((team) => ({
      id: team.id,
      name: team.name,
      gameVersion: team.gameVersion,
      createdAt: team.createdAt,
      updatedAt: team.updatedAt,
      members: team.members.map((m) => ({
        id: m.id,
        slotPosition: m.slotPosition,
        pokemonId: m.pokemonId,
        pokemonName: m.pokemonName,
        nickname: m.nickname,
        spriteUrl: m.spriteUrl,
        types: JSON.parse(m.types || '[]'),
        nature: m.nature,
        abilityName: m.abilityName,
        move1: m.move1,
        move2: m.move2,
        move3: m.move3,
        move4: m.move4
      }))
    }));

    res.json(formattedTeams);
  } catch (error) {
    console.error('Erro ao buscar times do usuário:', error);
    res.status(500).json({ error: 'Erro interno ao carregar os times.' });
  }
};

export const getTeamById = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    const teamId = parseInt(String(req.params.id), 10);

    if (!userId || isNaN(teamId)) {
      return res.status(400).json({ error: 'ID de time inválido ou usuário não autenticado.' });
    }

    const team = await prisma.team.findFirst({
      where: { id: teamId, userId },
      include: {
        members: {
          orderBy: { slotPosition: 'asc' }
        }
      }
    });

    if (!team) {
      return res.status(404).json({ error: 'Time não encontrado.' });
    }

    const formatted = {
      id: team.id,
      name: team.name,
      gameVersion: team.gameVersion,
      createdAt: team.createdAt,
      updatedAt: team.updatedAt,
      members: team.members.map((m) => ({
        id: m.id,
        slotPosition: m.slotPosition,
        pokemonId: m.pokemonId,
        pokemonName: m.pokemonName,
        nickname: m.nickname,
        spriteUrl: m.spriteUrl,
        types: JSON.parse(m.types || '[]'),
        nature: m.nature,
        abilityName: m.abilityName,
        move1: m.move1,
        move2: m.move2,
        move3: m.move3,
        move4: m.move4
      }))
    };

    res.json(formatted);
  } catch (error) {
    console.error('Erro ao buscar time:', error);
    res.status(500).json({ error: 'Erro ao carregar detalhes do time.' });
  }
};

export const createTeam = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ error: 'Usuário não autenticado.' });
    }

    const { name, gameVersion, members } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ error: 'Dê um nome para o seu time.' });
    }

    if (!Array.isArray(members) || members.length === 0) {
      return res.status(400).json({ error: 'Adicione pelo menos 1 Pokémon ao time.' });
    }

    if (members.length > 6) {
      return res.status(400).json({ error: 'Um time pode ter no máximo 6 Pokémon.' });
    }

    const newTeam = await prisma.team.create({
      data: {
        name: name.trim(),
        gameVersion: gameVersion ? gameVersion.trim() : null,
        userId,
        members: {
          create: members.map((m: any, idx: number) => ({
            slotPosition: m.slotPosition || idx + 1,
            pokemonId: m.pokemonId,
            pokemonName: m.pokemonName,
            nickname: m.nickname || null,
            spriteUrl: m.spriteUrl || `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${m.pokemonId}.png`,
            types: JSON.stringify(m.types || []),
            nature: m.nature || null,
            abilityName: m.abilityName || null,
            move1: m.move1 || null,
            move2: m.move2 || null,
            move3: m.move3 || null,
            move4: m.move4 || null
          }))
        }
      },
      include: {
        members: {
          orderBy: { slotPosition: 'asc' }
        }
      }
    });

    res.status(201).json(newTeam);
  } catch (error) {
    console.error('Erro ao criar time:', error);
    res.status(500).json({ error: 'Erro ao salvar o time.' });
  }
};

export const updateTeam = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    const teamId = parseInt(String(req.params.id), 10);

    if (!userId || isNaN(teamId)) {
      return res.status(400).json({ error: 'Parâmetros inválidos.' });
    }

    const existingTeam = await prisma.team.findFirst({
      where: { id: teamId, userId }
    });

    if (!existingTeam) {
      return res.status(404).json({ error: 'Time não encontrado ou acesso negado.' });
    }

    const { name, gameVersion, members } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ error: 'O nome do time não pode ficar vazio.' });
    }

    // Delete existing members & recreate updated ones
    await prisma.teamMember.deleteMany({ where: { teamId } });

    const updatedTeam = await prisma.team.update({
      where: { id: teamId },
      data: {
        name: name.trim(),
        gameVersion: gameVersion ? gameVersion.trim() : null,
        members: {
          create: (members || []).map((m: any, idx: number) => ({
            slotPosition: m.slotPosition || idx + 1,
            pokemonId: m.pokemonId,
            pokemonName: m.pokemonName,
            nickname: m.nickname || null,
            spriteUrl: m.spriteUrl || `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${m.pokemonId}.png`,
            types: JSON.stringify(m.types || []),
            nature: m.nature || null,
            abilityName: m.abilityName || null,
            move1: m.move1 || null,
            move2: m.move2 || null,
            move3: m.move3 || null,
            move4: m.move4 || null
          }))
        }
      },
      include: {
        members: {
          orderBy: { slotPosition: 'asc' }
        }
      }
    });

    res.json(updatedTeam);
  } catch (error) {
    console.error('Erro ao atualizar time:', error);
    res.status(500).json({ error: 'Erro ao atualizar o time.' });
  }
};

export const deleteTeam = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    const teamId = parseInt(String(req.params.id), 10);

    if (!userId || isNaN(teamId)) {
      return res.status(400).json({ error: 'Parâmetros inválidos.' });
    }

    const existingTeam = await prisma.team.findFirst({
      where: { id: teamId, userId }
    });

    if (!existingTeam) {
      return res.status(404).json({ error: 'Time não encontrado ou acesso negado.' });
    }

    await prisma.team.delete({
      where: { id: teamId }
    });

    res.json({ message: 'Time excluído com sucesso.' });
  } catch (error) {
    console.error('Erro ao excluir time:', error);
    res.status(500).json({ error: 'Erro ao excluir o time.' });
  }
};
