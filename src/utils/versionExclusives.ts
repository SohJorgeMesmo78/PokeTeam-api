export interface ExclusiveInfo {
  isExclusive: boolean;
  gameTag: string;
  color: 'red' | 'blue' | 'gold' | 'silver' | 'ruby' | 'sapphire' | 'green' | 'violet' | 'scarlet' | 'purple';
}

const EXCLUSIVES_DATABASE: Record<string, Record<string, ExclusiveInfo>> = {
  'red-blue': {
    'ekans': { isExclusive: true, gameTag: 'Exclusivo RED', color: 'red' },
    'arbok': { isExclusive: true, gameTag: 'Exclusivo RED', color: 'red' },
    'oddish': { isExclusive: true, gameTag: 'Exclusivo RED', color: 'red' },
    'gloom': { isExclusive: true, gameTag: 'Exclusivo RED', color: 'red' },
    'vileplume': { isExclusive: true, gameTag: 'Exclusivo RED', color: 'red' },
    'mankey': { isExclusive: true, gameTag: 'Exclusivo RED', color: 'red' },
    'primeape': { isExclusive: true, gameTag: 'Exclusivo RED', color: 'red' },
    'growlithe': { isExclusive: true, gameTag: 'Exclusivo RED', color: 'red' },
    'arcanine': { isExclusive: true, gameTag: 'Exclusivo RED', color: 'red' },
    'scyther': { isExclusive: true, gameTag: 'Exclusivo RED', color: 'red' },
    'electabuzz': { isExclusive: true, gameTag: 'Exclusivo RED', color: 'red' },

    'sandshrew': { isExclusive: true, gameTag: 'Exclusivo BLUE', color: 'blue' },
    'sandslash': { isExclusive: true, gameTag: 'Exclusivo BLUE', color: 'blue' },
    'vulpix': { isExclusive: true, gameTag: 'Exclusivo BLUE', color: 'blue' },
    'ninetales': { isExclusive: true, gameTag: 'Exclusivo BLUE', color: 'blue' },
    'meowth': { isExclusive: true, gameTag: 'Exclusivo BLUE', color: 'blue' },
    'persian': { isExclusive: true, gameTag: 'Exclusivo BLUE', color: 'blue' },
    'bellsprout': { isExclusive: true, gameTag: 'Exclusivo BLUE', color: 'blue' },
    'weepinbell': { isExclusive: true, gameTag: 'Exclusivo BLUE', color: 'blue' },
    'victreebel': { isExclusive: true, gameTag: 'Exclusivo BLUE', color: 'blue' },
    'pinsir': { isExclusive: true, gameTag: 'Exclusivo BLUE', color: 'blue' },
    'magmar': { isExclusive: true, gameTag: 'Exclusivo BLUE', color: 'blue' },
  },

  'gold-silver': {
    'spinarak': { isExclusive: true, gameTag: 'Exclusivo GOLD', color: 'gold' },
    'ariados': { isExclusive: true, gameTag: 'Exclusivo GOLD', color: 'gold' },
    'gligar': { isExclusive: true, gameTag: 'Exclusivo GOLD', color: 'gold' },
    'mantine': { isExclusive: true, gameTag: 'Exclusivo GOLD', color: 'gold' },
    'teddiursa': { isExclusive: true, gameTag: 'Exclusivo GOLD', color: 'gold' },
    'ursaring': { isExclusive: true, gameTag: 'Exclusivo GOLD', color: 'gold' },
    'donphan': { isExclusive: true, gameTag: 'Exclusivo GOLD', color: 'gold' },
    'ho-oh': { isExclusive: true, gameTag: 'Exclusivo GOLD', color: 'gold' },

    'ledyba': { isExclusive: true, gameTag: 'Exclusivo SILVER', color: 'silver' },
    'ledian': { isExclusive: true, gameTag: 'Exclusivo SILVER', color: 'silver' },
    'delibird': { isExclusive: true, gameTag: 'Exclusivo SILVER', color: 'silver' },
    'skarmory': { isExclusive: true, gameTag: 'Exclusivo SILVER', color: 'silver' },
    'phanpy': { isExclusive: true, gameTag: 'Exclusivo SILVER', color: 'silver' },
    'houndour': { isExclusive: true, gameTag: 'Exclusivo SILVER', color: 'silver' },
    'houndoom': { isExclusive: true, gameTag: 'Exclusivo SILVER', color: 'silver' },
    'lugia': { isExclusive: true, gameTag: 'Exclusivo SILVER', color: 'silver' },
  },

  'ruby-sapphire': {
    'seedot': { isExclusive: true, gameTag: 'Exclusivo RUBY', color: 'red' },
    'nuzleaf': { isExclusive: true, gameTag: 'Exclusivo RUBY', color: 'red' },
    'shiftry': { isExclusive: true, gameTag: 'Exclusivo RUBY', color: 'red' },
    'mawile': { isExclusive: true, gameTag: 'Exclusivo RUBY', color: 'red' },
    'zangoose': { isExclusive: true, gameTag: 'Exclusivo RUBY', color: 'red' },
    'solrock': { isExclusive: true, gameTag: 'Exclusivo RUBY', color: 'red' },
    'groudon': { isExclusive: true, gameTag: 'Exclusivo RUBY', color: 'red' },

    'lotad': { isExclusive: true, gameTag: 'Exclusivo SAPPHIRE', color: 'blue' },
    'lombre': { isExclusive: true, gameTag: 'Exclusivo SAPPHIRE', color: 'blue' },
    'ludicolo': { isExclusive: true, gameTag: 'Exclusivo SAPPHIRE', color: 'blue' },
    'sableye': { isExclusive: true, gameTag: 'Exclusivo SAPPHIRE', color: 'blue' },
    'seviper': { isExclusive: true, gameTag: 'Exclusivo SAPPHIRE', color: 'blue' },
    'lunatone': { isExclusive: true, gameTag: 'Exclusivo SAPPHIRE', color: 'blue' },
    'kyogre': { isExclusive: true, gameTag: 'Exclusivo SAPPHIRE', color: 'blue' },
  },

  'firered-leafgreen': {
    'ekans': { isExclusive: true, gameTag: 'Exclusivo FIRERED', color: 'red' },
    'arbok': { isExclusive: true, gameTag: 'Exclusivo FIRERED', color: 'red' },
    'oddish': { isExclusive: true, gameTag: 'Exclusivo FIRERED', color: 'red' },
    'gloom': { isExclusive: true, gameTag: 'Exclusivo FIRERED', color: 'red' },
    'vileplume': { isExclusive: true, gameTag: 'Exclusivo FIRERED', color: 'red' },
    'psyduck': { isExclusive: true, gameTag: 'Exclusivo FIRERED', color: 'red' },
    'golduck': { isExclusive: true, gameTag: 'Exclusivo FIRERED', color: 'red' },
    'growlithe': { isExclusive: true, gameTag: 'Exclusivo FIRERED', color: 'red' },
    'arcanine': { isExclusive: true, gameTag: 'Exclusivo FIRERED', color: 'red' },
    'shellder': { isExclusive: true, gameTag: 'Exclusivo FIRERED', color: 'red' },
    'cloyster': { isExclusive: true, gameTag: 'Exclusivo FIRERED', color: 'red' },
    'electabuzz': { isExclusive: true, gameTag: 'Exclusivo FIRERED', color: 'red' },
    'scyther': { isExclusive: true, gameTag: 'Exclusivo FIRERED', color: 'red' },

    'sandshrew': { isExclusive: true, gameTag: 'Exclusivo LEAFGREEN', color: 'green' },
    'sandslash': { isExclusive: true, gameTag: 'Exclusivo LEAFGREEN', color: 'green' },
    'vulpix': { isExclusive: true, gameTag: 'Exclusivo LEAFGREEN', color: 'green' },
    'ninetales': { isExclusive: true, gameTag: 'Exclusivo LEAFGREEN', color: 'green' },
    'bellsprout': { isExclusive: true, gameTag: 'Exclusivo LEAFGREEN', color: 'green' },
    'weepinbell': { isExclusive: true, gameTag: 'Exclusivo LEAFGREEN', color: 'green' },
    'victreebel': { isExclusive: true, gameTag: 'Exclusivo LEAFGREEN', color: 'green' },
    'slowpoke': { isExclusive: true, gameTag: 'Exclusivo LEAFGREEN', color: 'green' },
    'slowbro': { isExclusive: true, gameTag: 'Exclusivo LEAFGREEN', color: 'green' },
    'staryu': { isExclusive: true, gameTag: 'Exclusivo LEAFGREEN', color: 'green' },
    'starmie': { isExclusive: true, gameTag: 'Exclusivo LEAFGREEN', color: 'green' },
    'magmar': { isExclusive: true, gameTag: 'Exclusivo LEAFGREEN', color: 'green' },
    'pinsir': { isExclusive: true, gameTag: 'Exclusivo LEAFGREEN', color: 'green' },
  },

  'diamond-pearl': {
    'cranidos': { isExclusive: true, gameTag: 'Exclusivo DIAMOND', color: 'blue' },
    'rampardos': { isExclusive: true, gameTag: 'Exclusivo DIAMOND', color: 'blue' },
    'stunky': { isExclusive: true, gameTag: 'Exclusivo DIAMOND', color: 'blue' },
    'skuntank': { isExclusive: true, gameTag: 'Exclusivo DIAMOND', color: 'blue' },
    'dialga': { isExclusive: true, gameTag: 'Exclusivo DIAMOND', color: 'blue' },

    'shieldon': { isExclusive: true, gameTag: 'Exclusivo PEARL', color: 'purple' },
    'bastiodon': { isExclusive: true, gameTag: 'Exclusivo PEARL', color: 'purple' },
    'glameow': { isExclusive: true, gameTag: 'Exclusivo PEARL', color: 'purple' },
    'purugly': { isExclusive: true, gameTag: 'Exclusivo PEARL', color: 'purple' },
    'palkia': { isExclusive: true, gameTag: 'Exclusivo PEARL', color: 'purple' },
  },

  'black-white': {
    'cottonee': { isExclusive: true, gameTag: 'Exclusivo BLACK', color: 'purple' },
    'whimsicott': { isExclusive: true, gameTag: 'Exclusivo BLACK', color: 'purple' },
    'gothita': { isExclusive: true, gameTag: 'Exclusivo BLACK', color: 'purple' },
    'gothorita': { isExclusive: true, gameTag: 'Exclusivo BLACK', color: 'purple' },
    'gothitelle': { isExclusive: true, gameTag: 'Exclusivo BLACK', color: 'purple' },
    'reshiram': { isExclusive: true, gameTag: 'Exclusivo BLACK', color: 'purple' },

    'petilil': { isExclusive: true, gameTag: 'Exclusivo WHITE', color: 'green' },
    'lilligant': { isExclusive: true, gameTag: 'Exclusivo WHITE', color: 'green' },
    'solosis': { isExclusive: true, gameTag: 'Exclusivo WHITE', color: 'green' },
    'duosion': { isExclusive: true, gameTag: 'Exclusivo WHITE', color: 'green' },
    'reuniclus': { isExclusive: true, gameTag: 'Exclusivo WHITE', color: 'green' },
    'zekrom': { isExclusive: true, gameTag: 'Exclusivo WHITE', color: 'green' },
  },

  'x-y': {
    'swirlix': { isExclusive: true, gameTag: 'Exclusivo X', color: 'blue' },
    'slurpuff': { isExclusive: true, gameTag: 'Exclusivo X', color: 'blue' },
    'clauncher': { isExclusive: true, gameTag: 'Exclusivo X', color: 'blue' },
    'clawitzer': { isExclusive: true, gameTag: 'Exclusivo X', color: 'blue' },
    'xerneas': { isExclusive: true, gameTag: 'Exclusivo X', color: 'blue' },

    'spritzee': { isExclusive: true, gameTag: 'Exclusivo Y', color: 'red' },
    'aromatisse': { isExclusive: true, gameTag: 'Exclusivo Y', color: 'red' },
    'skrelp': { isExclusive: true, gameTag: 'Exclusivo Y', color: 'red' },
    'dragalge': { isExclusive: true, gameTag: 'Exclusivo Y', color: 'red' },
    'yveltal': { isExclusive: true, gameTag: 'Exclusivo Y', color: 'red' },
  },

  'sun-moon': {
    'passimian': { isExclusive: true, gameTag: 'Exclusivo SUN', color: 'red' },
    'turtonator': { isExclusive: true, gameTag: 'Exclusivo SUN', color: 'red' },
    'solgaleo': { isExclusive: true, gameTag: 'Exclusivo SUN', color: 'red' },

    'oranguru': { isExclusive: true, gameTag: 'Exclusivo MOON', color: 'purple' },
    'drampa': { isExclusive: true, gameTag: 'Exclusivo MOON', color: 'purple' },
    'lunala': { isExclusive: true, gameTag: 'Exclusivo MOON', color: 'purple' },
  },

  'sword-shield': {
    'sirfetchd': { isExclusive: true, gameTag: 'Exclusivo SWORD', color: 'blue' },
    'stonjourner': { isExclusive: true, gameTag: 'Exclusivo SWORD', color: 'blue' },
    'zacian': { isExclusive: true, gameTag: 'Exclusivo SWORD', color: 'blue' },

    'eiscue': { isExclusive: true, gameTag: 'Exclusivo SHIELD', color: 'red' },
    'zamazenta': { isExclusive: true, gameTag: 'Exclusivo SHIELD', color: 'red' },
  },

  'scarlet-violet': {
    'armarouge': { isExclusive: true, gameTag: 'Exclusivo SCARLET', color: 'scarlet' },
    'great-tusk': { isExclusive: true, gameTag: 'Exclusivo SCARLET', color: 'scarlet' },
    'koraidon': { isExclusive: true, gameTag: 'Exclusivo SCARLET', color: 'scarlet' },

    'ceruledge': { isExclusive: true, gameTag: 'Exclusivo VIOLET', color: 'violet' },
    'iron-treads': { isExclusive: true, gameTag: 'Exclusivo VIOLET', color: 'violet' },
    'miraidon': { isExclusive: true, gameTag: 'Exclusivo VIOLET', color: 'violet' },
  }
};

export function getExclusiveInfoForPokemon(pokemonName: string, gameId: string): ExclusiveInfo | null {
  if (!gameId || !EXCLUSIVES_DATABASE[gameId]) return null;
  const cleanName = pokemonName.toLowerCase().trim();
  return EXCLUSIVES_DATABASE[gameId][cleanName] || null;
}

export function isPokemonAllowedForGame(pokemonName: string, gameId: string): boolean {
  if (!gameId || gameId === 'geral') return true;

  const cleanName = pokemonName.toLowerCase().trim();

  const pairingKey = gameId.includes('firered') || gameId.includes('leafgreen') ? 'firered-leafgreen' :
                     gameId.includes('red') || gameId.includes('blue') ? 'red-blue' :
                     gameId.includes('gold') || gameId.includes('silver') ? 'gold-silver' :
                     gameId.includes('ruby') || gameId.includes('sapphire') ? 'ruby-sapphire' :
                     gameId.includes('diamond') || gameId.includes('pearl') ? 'diamond-pearl' :
                     gameId.includes('black') || gameId.includes('white') ? 'black-white' :
                     gameId.includes('x') || gameId.includes('y') ? 'x-y' :
                     gameId.includes('sun') || gameId.includes('moon') ? 'sun-moon' :
                     gameId.includes('sword') || gameId.includes('shield') ? 'sword-shield' :
                     gameId.includes('scarlet') || gameId.includes('violet') ? 'scarlet-violet' : gameId;

  const group = EXCLUSIVES_DATABASE[pairingKey];
  if (!group) return true;

  const exc = group[cleanName];
  if (!exc) return true;

  const tagLower = exc.gameTag.toLowerCase();
  const gIdLower = gameId.toLowerCase();

  // If the user picked a specific single game version (e.g. 'firered' or 'leafgreen')
  if (gIdLower === 'firered' && (tagLower.includes('leafgreen') || tagLower.includes('blue'))) return false;
  if (gIdLower === 'leafgreen' && (tagLower.includes('firered') || tagLower.includes('red'))) return false;
  if (gIdLower === 'red' && (tagLower.includes('blue') || tagLower.includes('leafgreen'))) return false;
  if (gIdLower === 'blue' && (tagLower.includes('red') || tagLower.includes('firered'))) return false;
  if (gIdLower === 'gold' && tagLower.includes('silver')) return false;
  if (gIdLower === 'silver' && tagLower.includes('gold')) return false;
  if (gIdLower === 'ruby' && tagLower.includes('sapphire')) return false;
  if (gIdLower === 'sapphire' && tagLower.includes('ruby')) return false;
  if (gIdLower === 'diamond' && tagLower.includes('pearl')) return false;
  if (gIdLower === 'pearl' && tagLower.includes('diamond')) return false;
  if (gIdLower === 'black' && tagLower.includes('white')) return false;
  if (gIdLower === 'white' && tagLower.includes('black')) return false;
  if (gIdLower === 'x' && tagLower.includes('y')) return false;
  if (gIdLower === 'y' && tagLower.includes('x')) return false;
  if (gIdLower === 'sun' && tagLower.includes('moon')) return false;
  if (gIdLower === 'moon' && tagLower.includes('sun')) return false;
  if (gIdLower === 'sword' && tagLower.includes('shield')) return false;
  if (gIdLower === 'shield' && tagLower.includes('sword')) return false;
  if (gIdLower === 'scarlet' && tagLower.includes('violet')) return false;
  if (gIdLower === 'violet' && tagLower.includes('scarlet')) return false;

  return true;
}
