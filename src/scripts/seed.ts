import axios from 'axios';
import dotenv from 'dotenv';
import { prisma } from '../config/db';

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
}

interface PokeApiItem {
  name: string;
  url: string;
}

// In-memory caches to reduce DB calls during seeding
const typeCache = new Map<string, number>();
const abilityCache = new Map<string, number>();

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
  if (!record) {
    try {
      record = await prisma.ability.create({ data: { name } });
    } catch {
      record = await prisma.ability.findUniqueOrThrow({ where: { name } });
    }
  }
  abilityCache.set(name, record.id);
  return record.id;
}

export async function seedPokemons(limit = 1025) {
  console.log(`🚀 Iniciando sincronização da PokeAPI (${limit} Pokémon)...`);
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

            // Upsert Pokémon
            await prisma.pokemon.upsert({
              where: { id: data.id },
              update: {
                name: data.name,
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
          } catch (err) {
            console.error(`❌ Erro ao processar ${item.name}:`, err);
          }
        })
      );

      const processed = Math.min(i + BATCH_SIZE, pokemonList.length);
      if (processed % 50 === 0 || processed === pokemonList.length) {
        console.log(`✅ Progresso: ${processed}/${pokemonList.length} Pokémon salvos.`);
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
