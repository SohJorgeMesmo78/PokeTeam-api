import axios from 'axios';
import { prisma } from '../config/db';

const ITEM_NAME_PT: Record<string, string> = {
  'fire-stone': 'Pedra do Fogo',
  'water-stone': 'Pedra da Água',
  'thunder-stone': 'Pedra do Trovão',
  'leaf-stone': 'Pedra da Folha',
  'moon-stone': 'Pedra da Lua',
  'sun-stone': 'Pedra do Sol',
  'shiny-stone': 'Pedra do Brilho',
  'dusk-stone': 'Pedra da Escuridão',
  'dawn-stone': 'Pedra da Alvorada',
  'ice-stone': 'Pedra do Gelo',
  'dragon-scale': 'Escama de Dragão',
  'king-rock': 'Rocha do Rei',
  'kings-rock': 'Rocha do Rei',
  'metal-coat': 'Revestimento de Metal',
  'protector': 'Protetor',
  'electirizer': 'Eletrizador',
  'magmarizer': 'Magmatizador',
  'dubious-disc': 'Disco Duvidoso',
  'reaper-cloth': 'Tecido Terrível',
  'prism-scale': 'Escama Prisma',
  'oval-stone': 'Pedra Oval',
  'razor-claw': 'Garra Afiada',
  'razor-fang': 'Dente Afiado',
  'upgrade': 'Upgrade',
  'deep-sea-tooth': 'Dente das Profundezas',
  'deep-sea-scale': 'Escama das Profundezas',
  'sweet-apple': 'Maçã Doce',
  'tart-apple': 'Maçã Azeda',
  'syrupy-apple': 'Maçã Xaroposa',
  'unremarkable-teacup': 'Xícara Comum',
  'masterpiece-teacup': 'Xícara Obra-Prima',
  'cracked-pot': 'Bule Rachado',
  'chipped-pot': 'Bule Trincado',
};

function formatItemName(name: string, isPt: boolean): string {
  if (!name) return '';
  const clean = name.toLowerCase().trim();
  if (isPt && ITEM_NAME_PT[clean]) {
    return ITEM_NAME_PT[clean];
  }
  return clean.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}

export function formatEvolutionMethod(detailsArr: any[]): { textEn: string; textPt: string } {
  if (!detailsArr || detailsArr.length === 0) {
    return { textEn: 'Base Form', textPt: 'Forma Inicial' };
  }

  const detail = detailsArr[0];
  const partsEn: string[] = [];
  const partsPt: string[] = [];

  const trigger = detail.trigger?.name;

  if (detail.min_level) {
    partsEn.push(`Lvl ${detail.min_level}`);
    partsPt.push(`Nível ${detail.min_level}`);
  }

  if (detail.item) {
    const itemEn = formatItemName(detail.item.name, false);
    const itemPt = formatItemName(detail.item.name, true);
    partsEn.push(itemEn);
    partsPt.push(itemPt);
  }

  if (detail.held_item) {
    const itemEn = formatItemName(detail.held_item.name, false);
    const itemPt = formatItemName(detail.held_item.name, true);
    partsEn.push(`Holding ${itemEn}`);
    partsPt.push(`Segurando ${itemPt}`);
  }

  if (detail.gender === 2) {
    partsEn.push('Male');
    partsPt.push('Se Macho');
  } else if (detail.gender === 1) {
    partsEn.push('Female');
    partsPt.push('Se Fêmea');
  }

  if (detail.min_happiness) {
    partsEn.push('High Friendship');
    partsPt.push('Felicidade Alta');
  }

  if (detail.min_affection) {
    partsEn.push('High Affection');
    partsPt.push('Afeição Alta');
  }

  if (detail.time_of_day === 'day') {
    partsEn.push('Day');
    partsPt.push('Durante o dia');
  } else if (detail.time_of_day === 'night') {
    partsEn.push('Night');
    partsPt.push('Durante a noite');
  }

  if (trigger === 'trade') {
    if (detail.trade_species?.name) {
      const spName = detail.trade_species.name.charAt(0).toUpperCase() + detail.trade_species.name.slice(1);
      partsEn.push(`Trade for ${spName}`);
      partsPt.push(`Troca por ${spName}`);
    } else if (!detail.held_item) {
      partsEn.push('Trade');
      partsPt.push('Troca');
    }
  } else if (trigger === 'shed') {
    partsEn.push('Shed Extra Slot');
    partsPt.push('Muda de Pele');
  } else if (trigger === 'spin') {
    partsEn.push('Spin');
    partsPt.push('Girar');
  } else if (trigger === 'three-critical-hits') {
    partsEn.push('3 Critical Hits');
    partsPt.push('3 Golpes Críticos');
  }

  if (detail.known_move?.name) {
    const moveName = detail.known_move.name.split('-').map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    partsEn.push(`Knows ${moveName}`);
    partsPt.push(`Conhecendo ${moveName}`);
  }

  if (detail.known_move_type?.name) {
    const typeName = detail.known_move_type.name.charAt(0).toUpperCase() + detail.known_move_type.name.slice(1);
    partsEn.push(`${typeName} Move`);
    partsPt.push(`Golpe do Tipo ${typeName}`);
  }

  if (detail.location?.name) {
    partsEn.push(`At ${detail.location.name}`);
    partsPt.push(`Em ${detail.location.name}`);
  }

  if (partsEn.length === 0) {
    if (trigger === 'use-item') {
      partsEn.push('Use Item');
      partsPt.push('Usar Item');
    } else {
      partsEn.push('Special Condition');
      partsPt.push('Condição Especial');
    }
  }

  return {
    textEn: partsEn.join(' + '),
    textPt: partsPt.join(' + ')
  };
}

export interface EvolutionMethodInfo {
  minLevel?: number | null;
  item?: {
    name: string;
    nameEn: string;
    namePt: string;
    spriteUrl: string;
  } | null;
  heldItem?: {
    name: string;
    nameEn: string;
    namePt: string;
    spriteUrl: string;
  } | null;
  gender?: 'male' | 'female' | null;
  happiness?: boolean;
  timeOfDay?: 'day' | 'night' | null;
  trigger?: string | null;
  textEn: string;
  textPt: string;
}

export function extractEvolutionMethodInfo(detailsArr: any[]): EvolutionMethodInfo {
  if (!detailsArr || detailsArr.length === 0) {
    return {
      textEn: 'Base Form',
      textPt: 'Forma Inicial'
    };
  }

  const detail = detailsArr[0];
  const trigger = detail.trigger?.name || null;

  let itemInfo = null;
  if (detail.item?.name) {
    const itemName = detail.item.name;
    itemInfo = {
      name: itemName,
      nameEn: formatItemName(itemName, false),
      namePt: formatItemName(itemName, true),
      spriteUrl: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/${itemName}.png`
    };
  }

  let heldItemInfo = null;
  if (detail.held_item?.name) {
    const itemName = detail.held_item.name;
    heldItemInfo = {
      name: itemName,
      nameEn: formatItemName(itemName, false),
      namePt: formatItemName(itemName, true),
      spriteUrl: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/${itemName}.png`
    };
  }

  let gender: 'male' | 'female' | null = null;
  if (detail.gender === 2) gender = 'male';
  else if (detail.gender === 1) gender = 'female';

  const formatted = formatEvolutionMethod(detailsArr);

  return {
    minLevel: detail.min_level || null,
    item: itemInfo,
    heldItem: heldItemInfo,
    gender,
    happiness: !!(detail.min_happiness || detail.min_affection),
    timeOfDay: detail.time_of_day === 'day' ? 'day' : (detail.time_of_day === 'night' ? 'night' : null),
    trigger,
    textEn: formatted.textEn,
    textPt: formatted.textPt
  };
}

export interface EvolutionNode {
  id: number;
  name: string;
  spriteUrl: string;
  artworkUrl: string;
  types: string[];
  methodEn: string;
  methodPt: string;
  methodDetails?: EvolutionMethodInfo;
  evolvesTo: EvolutionNode[];
}

export async function fetchEvolutionChainForPokemon(pokemonIdOrName: string | number): Promise<EvolutionNode | null> {
  try {
    // 1. Obter species a partir da PokeAPI
    const speciesRes = await axios.get(`https://pokeapi.co/api/v2/pokemon-species/${pokemonIdOrName}`);
    const chainUrl = speciesRes.data?.evolution_chain?.url;
    if (!chainUrl) return null;

    // 2. Obter dados da cadeia de evolução
    const chainRes = await axios.get(chainUrl);
    const chainData = chainRes.data?.chain;
    if (!chainData) return null;

    // Coletar todos os nomes de Pokémon presentes na cadeia para buscar types/sprites do DB local ou formatar
    const allNames: string[] = [];
    function collectNames(node: any) {
      if (node?.species?.name) {
        allNames.push(node.species.name);
      }
      for (const child of node.evolves_to || []) {
        collectNames(child);
      }
    }
    collectNames(chainData);

    // Buscar Pokémon no banco local para ter os dados rápidos de ID, sprites e tipos
    const dbPokemons = await prisma.pokemon.findMany({
      where: {
        name: { in: allNames, mode: 'insensitive' }
      },
      include: {
        types: {
          include: { type: true }
        }
      }
    });

    const pokeMap = new Map<string, any>();
    dbPokemons.forEach(p => pokeMap.set(p.name.toLowerCase(), p));

    // Função recursiva para montar a árvore EvolutionNode
    function buildNode(chainNode: any): EvolutionNode {
      const name = chainNode.species.name;
      const dbPoke = pokeMap.get(name.toLowerCase());

      // ID extraído da URL se não estiver no DB local
      const urlParts = chainNode.species.url.split('/').filter(Boolean);
      const pokeId = dbPoke?.id || parseInt(urlParts[urlParts.length - 1], 10);

      const defaultSprite = dbPoke?.spriteUrl || `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokeId}.png`;
      const artwork = dbPoke?.artworkUrl || `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokeId}.png`;
      const types = dbPoke?.types?.map((t: any) => t.type.name) || ['normal'];

      const method = formatEvolutionMethod(chainNode.evolution_details);
      const methodDetails = extractEvolutionMethodInfo(chainNode.evolution_details);

      const children = (chainNode.evolves_to || []).map((child: any) => buildNode(child));

      return {
        id: pokeId,
        name,
        spriteUrl: defaultSprite,
        artworkUrl: artwork,
        types,
        methodEn: method.textEn,
        methodPt: method.textPt,
        methodDetails,
        evolvesTo: children
      };
    }

    return buildNode(chainData);
  } catch (error) {
    console.error(`Erro ao buscar cadeia evolutiva para ${pokemonIdOrName}:`, error);
    return null;
  }
}
