import { Request, Response } from 'express';
import axios from 'axios';
import { prisma } from '../config/db';
import { seedPokemons } from '../scripts/seed';
import { translateEnToPtBr } from '../utils/googleTranslate';
import { fetchEvolutionChainForPokemon } from '../utils/evolutionFetcher';
import { getExclusiveInfoForPokemon } from '../utils/versionExclusives';
import { getRegionalDexPokemonIds } from '../utils/regionalDexes';

const GEN_RANGES: Record<number, { min: number; max: number }> = {
  1: { min: 1, max: 151 },
  2: { min: 152, max: 251 },
  3: { min: 252, max: 386 },
  4: { min: 387, max: 493 },
  5: { min: 494, max: 649 },
  6: { min: 650, max: 721 },
  7: { min: 722, max: 809 },
  8: { min: 810, max: 905 },
  9: { min: 906, max: 1025 },
};

const GAME_VERSIONS: Record<string, { id: string; name: string; gen: number; minId: number; maxId: number }> = {
  'red-blue': { id: 'red-blue', name: 'Red / Blue / Yellow', gen: 1, minId: 1, maxId: 151 },
  'gold-silver': { id: 'gold-silver', name: 'Gold / Silver / Crystal', gen: 2, minId: 1, maxId: 251 },
  'ruby-sapphire': { id: 'ruby-sapphire', name: 'Ruby / Sapphire / Emerald', gen: 3, minId: 1, maxId: 386 },
  'firered-leafgreen': { id: 'firered-leafgreen', name: 'FireRed / LeafGreen', gen: 3, minId: 1, maxId: 151 },
  'diamond-pearl': { id: 'diamond-pearl', name: 'Diamond / Pearl / Platinum', gen: 4, minId: 1, maxId: 493 },
  'heartgold-soulsilver': { id: 'heartgold-soulsilver', name: 'HeartGold / SoulSilver', gen: 4, minId: 1, maxId: 493 },
  'black-white': { id: 'black-white', name: 'Black / White / Black 2 / White 2', gen: 5, minId: 1, maxId: 649 },
  'x-y': { id: 'x-y', name: 'X / Y', gen: 6, minId: 1, maxId: 721 },
  'sun-moon': { id: 'sun-moon', name: 'Sun / Moon / Ultra Sun / Ultra Moon', gen: 7, minId: 1, maxId: 809 },
  'sword-shield': { id: 'sword-shield', name: 'Sword / Shield', gen: 8, minId: 1, maxId: 898 },
  'scarlet-violet': { id: 'scarlet-violet', name: 'Scarlet / Violet', gen: 9, minId: 1, maxId: 1025 },
};

const INDIVIDUAL_GAMES = [
  { id: 'geral', name: 'Geral (Todos os Pokémon)', gen: 0 },
  { id: 'red', name: 'Pokémon Red', gen: 1 },
  { id: 'blue', name: 'Pokémon Blue', gen: 1 },
  { id: 'yellow', name: 'Pokémon Yellow', gen: 1 },
  { id: 'gold', name: 'Pokémon Gold', gen: 2 },
  { id: 'silver', name: 'Pokémon Silver', gen: 2 },
  { id: 'crystal', name: 'Pokémon Crystal', gen: 2 },
  { id: 'ruby', name: 'Pokémon Ruby', gen: 3 },
  { id: 'sapphire', name: 'Pokémon Sapphire', gen: 3 },
  { id: 'emerald', name: 'Pokémon Emerald', gen: 3 },
  { id: 'firered', name: 'Pokémon FireRed', gen: 3 },
  { id: 'leafgreen', name: 'Pokémon LeafGreen', gen: 3 },
  { id: 'diamond', name: 'Pokémon Diamond', gen: 4 },
  { id: 'pearl', name: 'Pokémon Pearl', gen: 4 },
  { id: 'platinum', name: 'Pokémon Platinum', gen: 4 },
  { id: 'heartgold', name: 'Pokémon HeartGold', gen: 4 },
  { id: 'soulsilver', name: 'Pokémon SoulSilver', gen: 4 },
  { id: 'black', name: 'Pokémon Black', gen: 5 },
  { id: 'white', name: 'Pokémon White', gen: 5 },
  { id: 'black2', name: 'Pokémon Black 2', gen: 5 },
  { id: 'white2', name: 'Pokémon White 2', gen: 5 },
  { id: 'x', name: 'Pokémon X', gen: 6 },
  { id: 'y', name: 'Pokémon Y', gen: 6 },
  { id: 'sun', name: 'Pokémon Sun', gen: 7 },
  { id: 'moon', name: 'Pokémon Moon', gen: 7 },
  { id: 'ultrasun', name: 'Pokémon Ultra Sun', gen: 7 },
  { id: 'ultramoon', name: 'Pokémon Ultra Moon', gen: 7 },
  { id: 'sword', name: 'Pokémon Sword', gen: 8 },
  { id: 'shield', name: 'Pokémon Shield', gen: 8 },
  { id: 'scarlet', name: 'Pokémon Scarlet', gen: 9 },
  { id: 'violet', name: 'Pokémon Violet', gen: 9 },
];

const formatPokemon = (p: any, movesObj?: any, selectedGame?: string) => {
  const defaultSprite = p.spriteUrl || `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${p.id}.png`;
  const shinySprite = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/${p.id}.png`;
  const artwork = p.artworkUrl || `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${p.id}.png`;

  const exclusiveInfo = selectedGame ? getExclusiveInfoForPokemon(p.name, selectedGame) : null;

  return {
    id: p.id,
    name: p.name,
    descriptionEn: p.descriptionEn || '',
    descriptionPt: p.descriptionPt || '',
    height: p.height,
    weight: p.weight,
    base_experience: Math.round(
      (p.hp + p.attack + p.defense + p.specialAttack + p.specialDefense + p.speed) / 3
    ),
    spriteUrl: defaultSprite,
    shinySpriteUrl: shinySprite,
    artworkUrl: artwork,
    exclusiveInfo,
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
      type: {
        name: t.type.name,
        url: ''
      },
    })),
    abilities: p.abilities.map((a: any, idx: number) => ({
      slot: idx + 1,
      is_hidden: a.isHidden,
      ability: {
        name: a.ability.name,
        description: a.ability.descriptionPt || a.ability.descriptionEn || a.ability.description || 'No description available.',
        descriptionEn: a.ability.descriptionEn || a.ability.description || 'No description available.',
        descriptionPt: a.ability.descriptionPt || 'Sem descrição disponível.',
        url: ''
      },
    })),
    moves: movesObj || { levelUp: [], tm: [], egg: [], tutor: [] },
  };
};

async function ensureAbilityDetails(ability: any) {
  if (ability && ability.descriptionEn && ability.descriptionPt) {
    return ability;
  }
  try {
    const res = await axios.get(`https://pokeapi.co/api/v2/ability/${ability.name}`);
    const mData = res.data;

    const ftEn = mData.effect_entries?.find((e: any) => e.language.name === 'en');
    const ftTextEn = mData.flavor_text_entries?.find((e: any) => e.language.name === 'en');
    const descriptionEn = [
      ftTextEn?.flavor_text?.replace(/[\f\n\r]/g, ' '),
      (ftEn?.effect || ftEn?.short_effect)?.replace(/[\f\n\r]/g, ' ')
    ].filter(Boolean).join(' ') || 'No description available.';

    const descriptionPt = await translateEnToPtBr(descriptionEn);

    const updated = await prisma.ability.update({
      where: { id: ability.id },
      data: { description: descriptionEn, descriptionEn, descriptionPt },
    });

    return updated;
  } catch {
    return ability;
  }
}

async function ensureMoveDetails(move: any) {
  if (move && move.type && move.category && move.descriptionEn && move.descriptionPt) {
    return move;
  }
  try {
    const res = await axios.get(`https://pokeapi.co/api/v2/move/${move.name}`);
    const mData = res.data;
    const typeName = mData.type?.name || 'normal';
    const category = mData.damage_class?.name || 'status';
    const power = mData.power || null;
    const pp = mData.pp || null;
    const accuracy = mData.accuracy || null;

    const flavorEntry = mData.flavor_text_entries?.find((e: any) => e.language.name === 'en');
    const flavorText = flavorEntry ? flavorEntry.flavor_text.replace(/[\f\n\r]/g, ' ') : '';

    const effectEntry = mData.effect_entries?.find((e: any) => e.language.name === 'en');
    let effectText = effectEntry ? (effectEntry.effect || effectEntry.short_effect || '') : '';
    if (mData.effect_chance && effectText.includes('$effect_chance')) {
      effectText = effectText.replace(/\$effect_chance/g, mData.effect_chance.toString());
    }
    effectText = effectText.replace(/[\f\n\r]/g, ' ');

    let descriptionEn = [flavorText, effectText].filter(Boolean).join(' ');
    if (!descriptionEn.trim()) descriptionEn = 'No detailed description available.';

    const descriptionPt = await translateEnToPtBr(descriptionEn);

    const updated = await prisma.move.update({
      where: { id: move.id },
      data: {
        type: typeName,
        category,
        power,
        pp,
        accuracy,
        description: descriptionEn,
        descriptionEn,
        descriptionPt,
      },
    });

    return updated;
  } catch {
    return move;
  }
}

async function fetchAndSaveMovesForPokemon(pokemonId: number) {
  let dbMoves = await prisma.pokemonMove.findMany({
    where: { pokemonId },
    include: { move: true },
  });

  if (dbMoves.length === 0) {
    try {
      const res = await axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`);
      const movesData = res.data.moves || [];

      for (const mItem of movesData) {
        const moveName = mItem.move.name;
        const moveRecord = await prisma.move.upsert({
          where: { name: moveName },
          update: {},
          create: { name: moveName },
        });

        const seenKeys = new Set<string>();
        for (const detail of mItem.version_group_details || []) {
          const method = detail.move_learn_method.name;
          const level = detail.level_learned_at || 0;
          const key = `${method}-${level}`;

          if (!seenKeys.has(key)) {
            seenKeys.add(key);
            await prisma.pokemonMove.upsert({
              where: {
                pokemonId_moveId_learnMethod_level: {
                  pokemonId,
                  moveId: moveRecord.id,
                  learnMethod: method,
                  level,
                },
              },
              update: {},
              create: {
                pokemonId,
                moveId: moveRecord.id,
                learnMethod: method,
                level,
              },
            }).catch(() => {});
          }
        }
      }

      dbMoves = await prisma.pokemonMove.findMany({
        where: { pokemonId },
        include: { move: true },
      });
    } catch (err) {
      console.error(`Erro ao buscar golpes do pokémon ${pokemonId}:`, err);
    }
  }

  const uniqueMoves = new Map<number, any>();
  dbMoves.forEach((item) => uniqueMoves.set(item.move.id, item.move));

  for (const [id, moveObj] of uniqueMoves.entries()) {
    if (!moveObj.type || !moveObj.category || !moveObj.descriptionEn || !moveObj.descriptionPt) {
      const updated = await ensureMoveDetails(moveObj);
      uniqueMoves.set(id, updated);
    }
  }

  const formatMoveObj = (item: any) => {
    const moveObj = uniqueMoves.get(item.move.id) || item.move;
    const typeName = moveObj.type || 'normal';
    const catName = moveObj.category || 'status';

    return {
      id: moveObj.id,
      name: moveObj.name,
      type: typeName,
      category: catName,
      power: moveObj.power ?? null,
      pp: moveObj.pp ?? null,
      accuracy: moveObj.accuracy ?? null,
      description: moveObj.descriptionPt || moveObj.descriptionEn || moveObj.description || 'No description available.',
      descriptionEn: moveObj.descriptionEn || moveObj.description || 'No description available.',
      descriptionPt: moveObj.descriptionPt || 'Sem descrição disponível.',
    };
  };

  const levelUpMap = new Map<string, { level: number; moveData: any }>();
  const tmMap = new Map<string, any>();
  const eggMap = new Map<string, any>();
  const tutorMap = new Map<string, any>();

  for (const item of dbMoves) {
    const name = item.move.name;
    const mData = formatMoveObj(item);

    if (item.learnMethod === 'level-up') {
      if (!levelUpMap.has(name) || item.level < levelUpMap.get(name)!.level) {
        levelUpMap.set(name, { level: item.level, moveData: mData });
      }
    } else if (item.learnMethod === 'machine') {
      tmMap.set(name, mData);
    } else if (item.learnMethod === 'egg') {
      eggMap.set(name, mData);
    } else if (item.learnMethod === 'tutor') {
      tutorMap.set(name, mData);
    }
  }

  const levelUp = Array.from(levelUpMap.values())
    .map(({ level, moveData }) => ({ level, ...moveData }))
    .sort((a, b) => a.level - b.level || a.name.localeCompare(b.name));

  const tm = Array.from(tmMap.values()).sort((a, b) => a.name.localeCompare(b.name));
  const egg = Array.from(eggMap.values()).sort((a, b) => a.name.localeCompare(b.name));
  const tutor = Array.from(tutorMap.values()).sort((a, b) => a.name.localeCompare(b.name));

  return { levelUp, tm, egg, tutor };
}

export const getPokemons = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 24;
    const offset = req.query.offset ? parseInt(req.query.offset as string) : (page - 1) * limit;
    const search = (req.query.search as string)?.toLowerCase().trim();

    const typeRaw = (req.query.type || req.query.types) as string;
    const selectedTypes = typeRaw
      ? typeRaw.split(',').map((t) => t.trim().toLowerCase()).filter(Boolean)
      : [];

    const genRaw = (req.query.gen || req.query.gens) as string;
    const selectedGens = genRaw
      ? genRaw.split(',').map((g) => parseInt(g.trim(), 10)).filter((g) => !isNaN(g) && GEN_RANGES[g])
      : [];

    const selectedGame = (req.query.game as string)?.trim().toLowerCase();

    const andConditions: any[] = [];

    const isFullyEvolvedOnly = req.query.fullyEvolved === 'true';
    if (isFullyEvolvedOnly) {
      const NOT_FINAL_IDS = [
        1, 2, 4, 5, 7, 8, 10, 11, 13, 14, 16, 17, 19, 21, 23, 25, 27, 29, 30, 32, 33, 35, 37, 39, 41, 43, 44, 46, 48, 50, 52, 54, 56, 58, 60, 61, 63, 64, 66, 67, 69, 70, 72, 74, 75, 77, 79, 81, 84, 86, 88, 90, 92, 93, 96, 98, 100, 102, 104, 108, 109, 111, 113, 116, 118, 120, 122, 129, 133, 138, 140, 147, 148,
        152, 153, 155, 156, 158, 159, 161, 163, 165, 167, 170, 172, 173, 174, 175, 177, 179, 180, 183, 187, 188, 190, 191, 193, 194, 198, 200, 204, 207, 209, 215, 216, 218, 220, 223, 228, 231, 236, 238, 239, 240, 246, 247,
        252, 253, 255, 256, 258, 259, 261, 263, 265, 266, 268, 270, 271, 273, 274, 276, 278, 280, 281, 283, 285, 287, 288, 290, 293, 294, 296, 299, 300, 304, 305, 307, 316, 318, 320, 322, 325, 328, 329, 331, 333, 339, 341, 343, 345, 347, 349, 353, 355, 360, 361, 363, 364, 366, 367, 371, 372, 374, 375,
        387, 388, 390, 391, 393, 394, 396, 397, 399, 401, 403, 404, 406, 408, 410, 412, 415, 418, 420, 422, 425, 427, 431, 434, 436, 438, 439, 440, 443, 444, 446, 449, 451, 453, 456, 458, 459
      ];
      andConditions.push({
        id: { notIn: NOT_FINAL_IDS }
      });
    }

    if (search) {
      andConditions.push({ name: { contains: search, mode: 'insensitive' } });
    }

    if (selectedGame) {
      const regionalIds = getRegionalDexPokemonIds(selectedGame);
      if (regionalIds && regionalIds.length > 0) {
        andConditions.push({
          id: {
            in: regionalIds,
          },
        });
      }
    }

    if (selectedTypes.length > 0) {
      selectedTypes.forEach((typeName) => {
        andConditions.push({
          types: {
            some: {
              type: {
                name: { equals: typeName, mode: 'insensitive' },
              },
            },
          },
        });
      });
    }

    if (selectedGens.length > 0) {
      const genOrConditions = selectedGens.map((g) => ({
        id: {
          gte: GEN_RANGES[g].min,
          lte: GEN_RANGES[g].max,
        },
      }));
      andConditions.push({ OR: genOrConditions });
    }

    const where = andConditions.length > 0 ? { AND: andConditions } : {};

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

    const data = pokemons.map((p) => formatPokemon(p, undefined, selectedGame));

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

    for (const a of pokemon.abilities) {
      if (!a.ability.descriptionEn || !a.ability.descriptionPt) {
        a.ability = await ensureAbilityDetails(a.ability);
      }
    }

    const movesObj = await fetchAndSaveMovesForPokemon(pokemon.id);
    const evolutionChain = await fetchEvolutionChainForPokemon(pokemon.id);

    const formatted = formatPokemon(pokemon, movesObj) as any;
    formatted.evolutionChain = evolutionChain;

    res.json(formatted);
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

export const getGames = async (req: Request, res: Response) => {
  res.json(INDIVIDUAL_GAMES);
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
