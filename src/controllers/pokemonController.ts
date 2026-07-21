import { Request, Response } from 'express';
import { prisma } from '../config/db';
import { seedPokemons } from '../scripts/seed';

const formatPokemon = (p: any) => {
  const defaultSprite = p.spriteUrl || `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${p.id}.png`;
  const shinySprite = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/${p.id}.png`;
  const artwork = p.artworkUrl || `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${p.id}.png`;

  return {
    id: p.id,
    name: p.name,
    height: p.height,
    weight: p.weight,
    base_experience: Math.round(
      (p.hp + p.attack + p.defense + p.specialAttack + p.specialDefense + p.speed) / 3
    ),
    spriteUrl: defaultSprite,
    shinySpriteUrl: shinySprite,
    artworkUrl: artwork,
    sprites: {
      front_default: defaultSprite,
      front_shiny: shinySprite,
      back_default: null,
      other: {
        'official-artwork': {
          front_default: artwork,
          front_shiny: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/shiny/${p.id}.png`,
        },
      },
    },
    stats: [
      { base_stat: p.hp, effort: 0, stat: { name: 'hp', url: '' } },
      { base_stat: p.attack, effort: 0, stat: { name: 'attack', url: '' } },
      { base_stat: p.defense, effort: 0, stat: { name: 'defense', url: '' } },
      { base_stat: p.specialAttack, effort: 0, stat: { name: 'special-attack', url: '' } },
      { base_stat: p.specialDefense, effort: 0, stat: { name: 'special-defense', url: '' } },
      { base_stat: p.speed, effort: 0, stat: { name: 'speed', url: '' } },
    ],
    types: p.types.map((t: any, idx: number) => ({
      slot: idx + 1,
      type: { name: t.type.name, url: '' },
    })),
    abilities: p.abilities.map((a: any, idx: number) => ({
      slot: idx + 1,
      is_hidden: a.isHidden,
      ability: { name: a.ability.name, url: '' },
    })),
  };
};

export const getPokemons = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 24;
    const offset = req.query.offset ? parseInt(req.query.offset as string) : (page - 1) * limit;
    const search = (req.query.search as string)?.toLowerCase().trim();
    const type = (req.query.type as string)?.toLowerCase().trim();

    const where: any = {};

    if (search) {
      where.name = { contains: search, mode: 'insensitive' };
    }

    if (type) {
      where.types = {
        some: {
          type: {
            name: { equals: type, mode: 'insensitive' },
          },
        },
      };
    }

    const [total, pokemons] = await Promise.all([
      prisma.pokemon.count({ where }),
      prisma.pokemon.findMany({
        where,
        skip: offset,
        take: limit,
        orderBy: { id: 'asc' },
        include: {
          types: {
            include: {
              type: true,
            },
          },
          abilities: {
            include: {
              ability: true,
            },
          },
        },
      }),
    ]);

    const data = pokemons.map(formatPokemon);

    res.json({
      data,
      total,
      offset,
      limit,
      totalPages: Math.ceil(total / limit),
      hasMore: offset + limit < total,
    });
  } catch (error) {
    console.error('Erro ao buscar pokémons:', error);
    res.status(500).json({ error: 'Erro interno ao buscar pokémons' });
  }
};

export const getPokemonById = async (req: Request, res: Response) => {
  try {
    const { idOrName } = req.params;
    const isId = !isNaN(Number(idOrName));

    const pokemon = await prisma.pokemon.findFirst({
      where: isId
        ? { id: Number(idOrName) }
        : { name: { equals: idOrName.toLowerCase(), mode: 'insensitive' } },
      include: {
        types: {
          include: {
            type: true,
          },
        },
        abilities: {
          include: {
            ability: true,
          },
        },
      },
    });

    if (!pokemon) {
      return res.status(404).json({ error: 'Pokémon não encontrado' });
    }

    res.json(formatPokemon(pokemon));
  } catch (error) {
    console.error('Erro ao buscar detalhe do pokémon:', error);
    res.status(500).json({ error: 'Erro interno ao buscar detalhe do pokémon' });
  }
};

export const getTypes = async (req: Request, res: Response) => {
  try {
    const types = await prisma.type.findMany({
      orderBy: { name: 'asc' },
    });
    res.json(types.map((t) => t.name));
  } catch (error) {
    console.error('Erro ao buscar tipos:', error);
    res.status(500).json({ error: 'Erro interno ao buscar tipos' });
  }
};

export const syncPokemonsApi = async (req: Request, res: Response) => {
  try {
    const limit = parseInt(req.body?.limit as string) || 151;
    seedPokemons(limit).catch((err) => console.error('Erro no sync em background:', err));
    res.json({ message: `Sincronização iniciada para os primeiros ${limit} Pokémon.` });
  } catch (error) {
    console.error('Erro ao iniciar sync:', error);
    res.status(500).json({ error: 'Falha ao iniciar sincronização' });
  }
};
