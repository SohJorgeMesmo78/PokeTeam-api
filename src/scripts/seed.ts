import axios from 'axios';
import dotenv from 'dotenv';
import { prisma } from '../config/db';
import { translateEnToPtBr } from '../utils/googleTranslate';

dotenv.config();

interface PokeApiStat {
  base_stat: number;
  stat: { name: string };
}

interface PokeApiType {
  type: { name: string };
}

interface PokeApiAbility {
  is_hidden: boolean;
  ability: { name: string };
}

interface PokeApiMoveItem {
  move: { name: string };
  version_group_details: Array<{
    level_learned_at: number;
    move_learn_method: { name: string };
  }>;
}

interface PokeApiPokemonDetail {
  id: number;
  name: string;
  height: number;
  weight: number;
  sprites: {
    front_default: string | null;
    other?: {
      'official-artwork'?: {
        front_default?: string | null;
      };
    };
  };
  stats: PokeApiStat[];
  types: PokeApiType[];
  abilities: PokeApiAbility[];
  moves: PokeApiMoveItem[];
}

interface PokeApiItem {
  name: string;
  url: string;
}

const typeCache = new Map<string, number>();
const abilityCache = new Map<string, number>();
const moveCache = new Map<string, number>();

async function getOrCreateType(name: string): Promise<number> {
  if (typeCache.has(name)) {
    return typeCache.get(name)!;
  }
  let record = await prisma.type.findUnique({ where: { name } });
  if (!record) {
    try {
      record = await prisma.type.create({ data: { name } });
    } catch {
      record = await prisma.type.findUniqueOrThrow({ where: { name } });
    }
  }
  typeCache.set(name, record.id);
  return record.id;
}

async function getOrCreateAbility(name: string): Promise<number> {
  if (abilityCache.has(name)) {
    return abilityCache.get(name)!;
  }
  let record = await prisma.ability.findUnique({ where: { name } });
  if (!record || !record.descriptionPt) {
    let descriptionEn: string | null = null;
    let descriptionPt: string | null = null;
    try {
      const res = await axios.get(`https://pokeapi.co/api/v2/ability/${name}`);
      const mData = res.data;
      const ftEn = mData.effect_entries?.find((e: any) => e.language.name === 'en');
      const ftTextEn = mData.flavor_text_entries?.find((e: any) => e.language.name === 'en');
      descriptionEn = [
        ftTextEn?.flavor_text?.replace(/[\f\n\r]/g, ' '),
        (ftEn?.effect || ftEn?.short_effect)?.replace(/[\f\n\r]/g, ' ')
      ].filter(Boolean).join(' ') || 'No description available.';

      descriptionPt = await translateEnToPtBr(descriptionEn);
    } catch {
      // fallback
    }

    try {
      record = await prisma.ability.upsert({
        where: { name },
        update: { description: descriptionEn, descriptionEn, descriptionPt },
        create: { name, description: descriptionEn, descriptionEn, descriptionPt },
      });
    } catch {
      record = await prisma.ability.findUniqueOrThrow({ where: { name } });
    }
  }
  abilityCache.set(name, record.id);
  return record.id;
}

async function getOrCreateMove(name: string): Promise<number> {
  if (moveCache.has(name)) {
    return moveCache.get(name)!;
  }

  let record = await prisma.move.findUnique({ where: { name } });
  if (!record || !record.type || !record.descriptionPt) {
    let typeName: string | null = null;
    let category: string | null = null;
    let power: number | null = null;
    let pp: number | null = null;
    let accuracy: number | null = null;
    let descriptionEn: string | null = null;
    let descriptionPt: string | null = null;

    try {
      const res = await axios.get(`https://pokeapi.co/api/v2/move/${name}`);
      const mData = res.data;
      typeName = mData.type?.name || null;
      category = mData.damage_class?.name || null;
      power = mData.power || null;
      pp = mData.pp || null;
      accuracy = mData.accuracy || null;

      const flavorEntry = mData.flavor_text_entries?.find((e: any) => e.language.name === 'en');
      const flavorText = flavorEntry ? flavorEntry.flavor_text.replace(/[\f\n\r]/g, ' ') : '';

      const effectEntry = mData.effect_entries?.find((e: any) => e.language.name === 'en');
      let effectText = effectEntry ? (effectEntry.effect || effectEntry.short_effect || '') : '';
      if (mData.effect_chance && effectText.includes('$effect_chance')) {
        effectText = effectText.replace(/\$effect_chance/g, mData.effect_chance.toString());
      }
      effectText = effectText.replace(/[\f\n\r]/g, ' ');

      descriptionEn = [flavorText, effectText].filter(Boolean).join(' ');
      if (!descriptionEn.trim()) descriptionEn = 'No detailed description available.';

      descriptionPt = await translateEnToPtBr(descriptionEn);
    } catch {
      // fallback
    }

    try {
      record = await prisma.move.upsert({
        where: { name },
        update: { type: typeName, category, power, pp, accuracy, description: descriptionEn, descriptionEn, descriptionPt },
        create: { name, type: typeName, category, power, pp, accuracy, description: descriptionEn, descriptionEn, descriptionPt },
      });
    } catch {
      record = await prisma.move.findUniqueOrThrow({ where: { name } });
    }
  }

  moveCache.set(name, record.id);
  return record.id;
}

export async function seedPokemons(limit = 1025) {
  console.log(`🚀 Iniciando sincronização da PokeAPI (${limit} Pokémon + Golpes + Google Tradutor PT-BR)...`);
  try {
    const listResponse = await axios.get<{ results: PokeApiItem[] }>(
      `https://pokeapi.co/api/v2/pokemon?limit=${limit}`
    );
    const pokemonList = listResponse.data.results;

    console.log(`📦 Encontrados ${pokemonList.length} Pokémon na PokeAPI. Salvando no PostgreSQL...`);

    const BATCH_SIZE = 5;
    for (let i = 0; i < pokemonList.length; i += BATCH_SIZE) {
      const chunk = pokemonList.slice(i, i + BATCH_SIZE);

      await Promise.all(
        chunk.map(async (item) => {
          try {
            const detailRes = await axios.get<PokeApiPokemonDetail>(item.url);
            const data = detailRes.data;

            const statsMap: Record<string, number> = {};
            data.stats.forEach((s) => {
              statsMap[s.stat.name] = s.base_stat;
            });

            const artwork =
              data.sprites.other?.['official-artwork']?.front_default ||
              data.sprites.front_default ||
              '';
            const sprite = data.sprites.front_default || artwork || '';

            // Pokémon Species Bio
            let descriptionEn: string | null = null;
            let descriptionPt: string | null = null;
            try {
              const speciesRes = await axios.get(`https://pokeapi.co/api/v2/pokemon-species/${data.id}`);
              const ftEn = speciesRes.data.flavor_text_entries?.find((e: any) => e.language.name === 'en');
              if (ftEn) {
                descriptionEn = ftEn.flavor_text.replace(/[\f\n\r]/g, ' ');
                descriptionPt = await translateEnToPtBr(descriptionEn);
              }
            } catch {}

            // Upsert Pokémon
            await prisma.pokemon.upsert({
              where: { id: data.id },
              update: {
                name: data.name,
                descriptionEn,
                descriptionPt,
                height: data.height,
                weight: data.weight,
                spriteUrl: sprite,
                artworkUrl: artwork,
                hp: statsMap['hp'] || 0,
                attack: statsMap['attack'] || 0,
                defense: statsMap['defense'] || 0,
                specialAttack: statsMap['special-attack'] || 0,
                specialDefense: statsMap['special-defense'] || 0,
                speed: statsMap['speed'] || 0,
              },
              create: {
                id: data.id,
                name: data.name,
                descriptionEn,
                descriptionPt,
                height: data.height,
                weight: data.weight,
                spriteUrl: sprite,
                artworkUrl: artwork,
                hp: statsMap['hp'] || 0,
                attack: statsMap['attack'] || 0,
                defense: statsMap['defense'] || 0,
                specialAttack: statsMap['special-attack'] || 0,
                specialDefense: statsMap['special-defense'] || 0,
                speed: statsMap['speed'] || 0,
              },
            });

            // Handle Types
            await prisma.pokemonType.deleteMany({ where: { pokemonId: data.id } });
            for (const t of data.types) {
              const typeId = await getOrCreateType(t.type.name);
              await prisma.pokemonType.create({
                data: {
                  pokemonId: data.id,
                  typeId,
                },
              });
            }

            // Handle Abilities
            await prisma.pokemonAbility.deleteMany({ where: { pokemonId: data.id } });
            for (const a of data.abilities) {
              const abilityId = await getOrCreateAbility(a.ability.name);
              await prisma.pokemonAbility.create({
                data: {
                  pokemonId: data.id,
                  abilityId,
                  isHidden: a.is_hidden,
                },
              });
            }

            // Handle Moves
            await prisma.pokemonMove.deleteMany({ where: { pokemonId: data.id } });
            for (const mItem of data.moves || []) {
              const moveId = await getOrCreateMove(mItem.move.name);
              const seenKeys = new Set<string>();

              for (const detail of mItem.version_group_details || []) {
                const method = detail.move_learn_method.name;
                const level = detail.level_learned_at || 0;
                const key = `${method}-${level}`;

                if (!seenKeys.has(key)) {
                  seenKeys.add(key);
                  try {
                    await prisma.pokemonMove.create({
                      data: {
                        pokemonId: data.id,
                        moveId,
                        learnMethod: method,
                        level,
                      },
                    });
                  } catch {
                    // Ignore duplicate key if any
                  }
                }
              }
            }
          } catch (err) {
            console.error(`❌ Erro ao processar ${item.name}:`, err);
          }
        })
      );

      const processed = Math.min(i + BATCH_SIZE, pokemonList.length);
      if (processed % 25 === 0 || processed === pokemonList.length) {
        console.log(`✅ Progresso: ${processed}/${pokemonList.length} Pokémon e golpes traduzidos salvos.`);
      }
    }

    console.log('🎉 Sincronização concluída com sucesso!');
  } catch (error) {
    console.error('❌ Falha na sincronização da PokeAPI:', error);
    throw error;
  }
}

if (require.main === module) {
  const limitArg = process.argv[2] ? parseInt(process.argv[2], 10) : 1025;
  seedPokemons(limitArg)
    .then(() => {
      prisma.$disconnect();
      process.exit(0);
    })
    .catch((err) => {
      console.error(err);
      prisma.$disconnect();
      process.exit(1);
    });
}
