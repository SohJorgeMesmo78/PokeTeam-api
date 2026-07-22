import axios from 'axios';

const translateCache = new Map<string, string>();

/**
 * Traduz textos em Inglês para Português do Brasil (PT-BR) usando o serviço do Google Tradutor
 */
export async function translateEnToPtBr(textEn: string): Promise<string> {
  if (!textEn || !textEn.trim()) return '';
  const trimmed = textEn.trim();
  if (translateCache.has(trimmed)) {
    return translateCache.get(trimmed)!;
  }

  try {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=pt-BR&dt=t&q=${encodeURIComponent(trimmed)}`;
    const res = await axios.get(url, { timeout: 5000 });

    if (res.data && res.data[0] && Array.isArray(res.data[0])) {
      const translated = res.data[0].map((x: any) => x[0]).join('');
      if (translated && translated.trim()) {
        const clean = translated.trim();
        translateCache.set(trimmed, clean);
        return clean;
      }
    }
  } catch (err) {
    console.warn(`[Google Translate Warning] Não foi possível traduzir o texto: ${trimmed.slice(0, 30)}...`);
  }

  return trimmed;
}
