/**
 * Comprehensive Regional Dex Mappings for each game version.
 * Defines which Pokémon IDs belong to the regional Pokédex of each game.
 */

// Kanto Regional Dex (#1 to #151)
const KANTO_DEX_IDS: number[] = Array.from({ length: 151 }, (_, i) => i + 1);

// Johto Regional Dex (#1 to #251)
const JOHTO_DEX_IDS: number[] = Array.from({ length: 251 }, (_, i) => i + 1);

// Hoenn Regional Dex (R/S/E: Gen 3 #252-#386 + select Gen 1/2 entries)
const HOENN_DEX_GEN12: number[] = [
  25, 26, 41, 42, 54, 55, 63, 64, 65, 66, 67, 68, 72, 73, 74, 75, 76, 81, 82, 84, 85,
  88, 89, 100, 101, 109, 110, 111, 112, 116, 117, 118, 119, 120, 121, 127, 129, 130, 134,
  135, 136, 170, 171, 172, 174, 177, 178, 183, 184, 202, 203, 214, 218, 219, 222, 227, 230, 231, 232
];
const HOENN_DEX_IDS: number[] = [
  ...HOENN_DEX_GEN12,
  ...Array.from({ length: 386 - 252 + 1 }, (_, i) => 252 + i)
].sort((a, b) => a - b);

// Sinnoh Regional Dex (D/P/Pt: Gen 4 #387-#493 + select Gen 1-3 entries)
const SINNOH_DEX_GEN123: number[] = [
  25, 26, 35, 36, 41, 42, 54, 55, 63, 64, 65, 66, 67, 68, 74, 75, 76, 92, 93, 94, 95,
  114, 118, 119, 129, 130, 133, 134, 135, 136, 137, 163, 164, 172, 173, 175, 176, 183, 184,
  185, 190, 193, 194, 195, 196, 197, 198, 200, 201, 202, 206, 207, 211, 213, 214, 215, 220,
  221, 223, 224, 226, 228, 229, 233, 276, 277, 278, 279, 280, 281, 282, 287, 288, 289, 299,
  304, 305, 306, 307, 308, 315, 320, 321, 325, 326, 333, 334, 339, 340, 349, 350, 353, 354, 355, 356, 358, 359, 361, 362
];
const SINNOH_DEX_IDS: number[] = [
  ...SINNOH_DEX_GEN123,
  ...Array.from({ length: 493 - 387 + 1 }, (_, i) => 387 + i)
].sort((a, b) => a - b);

// Unova Regional Dex (B/W & B2/W2: Gen 5 #494-#649 + select Gen 1-4 entries)
const UNOVA_DEX_CLASSIC: number[] = Array.from({ length: 649 - 494 + 1 }, (_, i) => 494 + i);
const UNOVA_DEX_B2W2_GEN14: number[] = [
  19, 20, 25, 26, 35, 36, 37, 38, 41, 42, 54, 55, 58, 59, 64, 65, 81, 82, 86, 87, 88, 89,
  113, 120, 121, 123, 127, 129, 130, 131, 133, 134, 135, 136, 172, 179, 180, 181, 183, 184, 196, 197, 214, 215,
  220, 221, 225, 227, 233, 242, 278, 279, 280, 281, 282, 299, 304, 305, 306, 320, 321, 322, 323, 328, 329, 330,
  333, 334, 335, 336, 359, 363, 364, 365, 371, 372, 373, 374, 375, 376, 406, 407, 427, 428, 447, 448, 462, 470, 471, 472, 473, 474
];
const UNOVA_DEX_IDS: number[] = [
  ...UNOVA_DEX_CLASSIC,
  ...UNOVA_DEX_B2W2_GEN14
].sort((a, b) => a - b);

// Kalos Regional Dex (X/Y: Gen 6 #650-#721 + select Gen 1-5 entries)
const KALOS_DEX_OTHER: number[] = [
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 25, 26, 35, 36, 41, 42, 60, 61, 62, 63, 64, 65, 66, 67, 68,
  92, 93, 94, 129, 130, 133, 134, 135, 136, 143, 147, 148, 149, 150, 172, 183, 184, 196, 197, 214, 215, 246, 247, 248,
  280, 281, 282, 304, 305, 306, 371, 372, 373, 443, 444, 445, 470, 471, 475, 543, 544, 545, 570, 571, 610, 611, 612
];
const KALOS_DEX_IDS: number[] = [
  ...Array.from({ length: 721 - 650 + 1 }, (_, i) => 650 + i),
  ...KALOS_DEX_OTHER
].sort((a, b) => a - b);

// Alola Regional Dex (Sun/Moon: Gen 7 #722-#809 + select Gen 1-6 entries)
const ALOLA_DEX_OTHER: number[] = [
  19, 20, 25, 26, 27, 28, 37, 38, 41, 42, 50, 51, 52, 53, 63, 64, 65, 66, 67, 68, 74, 75, 76, 88, 89, 92, 93, 94, 102, 103, 105,
  129, 130, 133, 134, 135, 136, 142, 172, 183, 184, 196, 197, 215, 246, 247, 248, 280, 281, 282, 371, 372, 373, 443, 444, 445, 470, 471, 704, 705, 706
];
const ALOLA_DEX_IDS: number[] = [
  ...Array.from({ length: 809 - 722 + 1 }, (_, i) => 722 + i),
  ...ALOLA_DEX_OTHER
].sort((a, b) => a - b);

// Galar Regional Dex (Sword/Shield: Gen 8 #810-#898 + select Gen 1-7 entries)
const GALAR_DEX_OTHER: number[] = [
  1, 2, 3, 4, 5, 6, 7, 8, 9, 25, 26, 35, 36, 37, 38, 41, 42, 52, 53, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 83, 92, 93, 94,
  111, 112, 118, 119, 129, 130, 131, 132, 133, 134, 135, 136, 143, 172, 183, 184, 196, 197, 214, 215, 222, 227, 246, 247, 248,
  280, 281, 282, 304, 305, 306, 320, 321, 328, 329, 330, 371, 372, 373, 443, 444, 445, 470, 471, 475, 543, 544, 545, 570, 571,
  610, 611, 612, 633, 634, 635, 704, 705, 706, 747, 748, 778, 782, 783, 784
];
const GALAR_DEX_IDS: number[] = [
  ...Array.from({ length: 898 - 810 + 1 }, (_, i) => 810 + i),
  ...GALAR_DEX_OTHER
].sort((a, b) => a - b);

// Paldea Regional Dex (Scarlet/Violet: Gen 9 #906-#1025 + select Gen 1-8 entries)
const PALDEA_DEX_OTHER: number[] = [
  25, 26, 35, 36, 37, 38, 41, 42, 54, 55, 58, 59, 74, 75, 76, 92, 93, 94, 95, 123, 129, 130, 133, 134, 135, 136, 143, 147, 148, 149,
  172, 183, 184, 194, 195, 196, 197, 198, 200, 207, 214, 215, 220, 221, 246, 247, 248, 280, 281, 282, 285, 286, 322, 323, 324,
  333, 334, 335, 336, 353, 354, 371, 372, 373, 396, 397, 398, 403, 404, 405, 417, 425, 426, 434, 435, 443, 444, 445, 447, 448,
  459, 460, 470, 471, 475, 479, 570, 571, 610, 611, 612, 633, 634, 635, 661, 662, 663, 664, 665, 666, 704, 705, 706, 747, 748,
  778, 819, 820, 821, 822, 823, 833, 834, 840, 841, 848, 849, 885, 886, 887
];
const PALDEA_DEX_IDS: number[] = [
  ...Array.from({ length: 1025 - 906 + 1 }, (_, i) => 906 + i),
  ...PALDEA_DEX_OTHER
].sort((a, b) => a - b);

const REGIONAL_DEX_MAP: Record<string, number[]> = {
  'geral': [],
  'red': KANTO_DEX_IDS,
  'blue': KANTO_DEX_IDS,
  'yellow': KANTO_DEX_IDS,
  'red-blue': KANTO_DEX_IDS,

  'gold': JOHTO_DEX_IDS,
  'silver': JOHTO_DEX_IDS,
  'crystal': JOHTO_DEX_IDS,
  'gold-silver': JOHTO_DEX_IDS,

  'ruby': HOENN_DEX_IDS,
  'sapphire': HOENN_DEX_IDS,
  'emerald': HOENN_DEX_IDS,
  'ruby-sapphire': HOENN_DEX_IDS,

  'firered': KANTO_DEX_IDS,
  'leafgreen': KANTO_DEX_IDS,
  'firered-leafgreen': KANTO_DEX_IDS,

  'diamond': SINNOH_DEX_IDS,
  'pearl': SINNOH_DEX_IDS,
  'platinum': SINNOH_DEX_IDS,
  'diamond-pearl': SINNOH_DEX_IDS,

  'heartgold': JOHTO_DEX_IDS,
  'soulsilver': JOHTO_DEX_IDS,
  'heartgold-soulsilver': JOHTO_DEX_IDS,

  'black': UNOVA_DEX_IDS,
  'white': UNOVA_DEX_IDS,
  'black2': UNOVA_DEX_IDS,
  'white2': UNOVA_DEX_IDS,
  'black-white': UNOVA_DEX_IDS,

  'x': KALOS_DEX_IDS,
  'y': KALOS_DEX_IDS,
  'x-y': KALOS_DEX_IDS,

  'sun': ALOLA_DEX_IDS,
  'moon': ALOLA_DEX_IDS,
  'ultrasun': ALOLA_DEX_IDS,
  'ultramoon': ALOLA_DEX_IDS,
  'sun-moon': ALOLA_DEX_IDS,

  'sword': GALAR_DEX_IDS,
  'shield': GALAR_DEX_IDS,
  'sword-shield': GALAR_DEX_IDS,

  'scarlet': PALDEA_DEX_IDS,
  'violet': PALDEA_DEX_IDS,
  'scarlet-violet': PALDEA_DEX_IDS,
};

export function getRegionalDexPokemonIds(gameId: string): number[] | null {
  if (!gameId || gameId === 'geral' || !REGIONAL_DEX_MAP[gameId]) return null;
  return REGIONAL_DEX_MAP[gameId];
}
