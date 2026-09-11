// High-performance Intelligent Search & Ranking Engine
// Strictly searches actual products provided from the catalog database.
// Never generates or hallucinates products.

import { Product } from '../types';
import { 
  SearchConfig, 
  DEFAULT_SEARCH_CONFIG, 
  ELECTRONICS_SYNONYMS 
} from './searchConfig';

export interface SearchHit {
  product: Product;
  score: number;
  matchedFields: string[];
  snippet?: string;
}

export interface SearchResult {
  query: string;
  normalizedQuery: string;
  total: number;
  results: SearchHit[];
  didYouMean?: string | null;
  matchingCategories: string[];
  matchingBrands: string[];
}

export interface SearchOptions {
  category?: string;
  inStockOnly?: boolean;
  minPrice?: number;
  maxPrice?: number;
  limit?: number;
  config?: Partial<SearchConfig>;
}

/**
 * Normalizes text for technical electronics search.
 * Handles case, spacing, and standardizes electrical unit forms:
 * - 32-bit / 32 bit / 32BIT
 * - 5V / 5 volt / 5 volts / 5 v
 * - 8 ohm / 8Ω / 8-ohm / 8 Ohms
 */
export function normalizeSearchText(text: string): string {
  if (!text) return '';
  let clean = text
    .toLowerCase()
    .trim()
    .replace(/[“”"']/g, ''); // remove quotes

  // Standardize Ohm symbol and text
  clean = clean.replace(/([0-9.]+)\s*([ωΩ]|ohms?)/gi, '$1 ohm');
  clean = clean.replace(/([0-9.]+)-ohm/gi, '$1 ohm');
  clean = clean.replace(/([0-9.]+)ohm\b/gi, '$1 ohm');

  // Standardize Voltage
  clean = clean.replace(/([0-9.]+)\s*volts?\b/gi, '$1v');
  clean = clean.replace(/([0-9.]+)-volt\b/gi, '$1v');
  clean = clean.replace(/([0-9.]+)\s+v\b/gi, '$1v');
  clean = clean.replace(/([0-9.]+)vdc\b/gi, '$1v');

  // Standardize Bit-depth: 32 bit, 32-bit, 32bit -> 32-bit
  clean = clean.replace(/\b(8|16|32|64)\s*bit\b/gi, '$1-bit');
  clean = clean.replace(/\b(8|16|32|64)bit\b/gi, '$1-bit');

  // Standardize general punctuation while keeping hyphens for technical terms (e.g., 32-bit, esp32-s3)
  clean = clean.replace(/[^\w\s-]/g, ' ').replace(/\s+/g, ' ').trim();

  return clean;
}

/**
 * Tokenize a search query into meaningful words/units
 */
export function tokenizeQuery(query: string): string[] {
  const norm = normalizeSearchText(query);
  if (!norm) return [];
  return norm.split(/\s+/).filter((t) => t.length > 0);
}

/**
 * Calculates Damerau-Levenshtein distance between two strings
 * Handles insertions, deletions, substitutions, and adjacent transpositions (e.g. ardunio <-> arduino)
 */
export function damerauLevenshtein(a: string, b: string): number {
  if (a === b) return 0;
  if (!a.length) return b.length;
  if (!b.length) return a.length;

  const lenA = a.length;
  const lenB = b.length;
  const d: number[][] = Array.from({ length: lenA + 1 }, () => 
    new Array(lenB + 1).fill(0)
  );

  for (let i = 0; i <= lenA; i++) d[i][0] = i;
  for (let j = 0; j <= lenB; j++) d[0][j] = j;

  for (let i = 1; i <= lenA; i++) {
    for (let j = 1; j <= lenB; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      d[i][j] = Math.min(
        d[i - 1][j] + 1, // deletion
        d[i][j - 1] + 1, // insertion
        d[i - 1][j - 1] + cost // substitution
      );

      // Transposition check
      if (
        i > 1 && 
        j > 1 && 
        a[i - 1] === b[j - 2] && 
        a[i - 2] === b[j - 1]
      ) {
        d[i][j] = Math.min(d[i][j], d[i - 2][j - 2] + 1);
      }
    }
  }

  return d[lenA][lenB];
}

/**
 * Extract an active vocabulary from the actual catalog
 * for high-precision fuzzy matching suggestions (e.g. ardunio -> arduino).
 */
export function extractCatalogDictionary(products: Product[]): string[] {
  const vocab = new Set<string>();
  for (const p of products) {
    // Add product name words
    const nameWords = tokenizeQuery(p.name);
    for (const w of nameWords) {
      if (w.length >= 3) vocab.add(w);
    }
    // Add brand
    if (p.brand) {
      const brandWords = tokenizeQuery(p.brand);
      for (const w of brandWords) {
        if (w.length >= 3) vocab.add(w);
      }
    }
    // Add tags
    if (p.tags) {
      for (const t of p.tags) {
        const tagWords = tokenizeQuery(t);
        for (const w of tagWords) {
          if (w.length >= 3) vocab.add(w);
        }
      }
    }
    // Add categories
    if (p.category) {
      const catWords = tokenizeQuery(p.category);
      for (const w of catWords) {
        if (w.length >= 3) vocab.add(w);
      }
    }
  }

  // Canonical electronics vocabulary fallback from the active catalog items
  const canonicalKeywords = [
    'arduino', 'uno', 'nano', 'mega', 'raspberry', 'pico', 'esp32',
    'stm32', 'stm32f4', 'relay', 'speaker', 'resistor', 'capacitor',
    'temperature', 'sensor', 'microcontroller', 'mcu', 'oled', 'lcd',
    'bluetooth', 'wifi', 'battery', 'chassis', 'servo', 'motor'
  ];
  for (const k of canonicalKeywords) vocab.add(k);

  return Array.from(vocab);
}

/**
 * Finds the closest matching canonical term if user made a spelling mistake
 */
export function getSpellingSuggestion(query: string, dictionary: string[]): string | null {
  const norm = normalizeSearchText(query);
  if (!norm || norm.length < 4) return null;

  const words = norm.split(' ');
  let wasCorrected = false;
  const correctedWords: string[] = [];

  for (const word of words) {
    if (word.length < 4) {
      correctedWords.push(word);
      continue;
    }

    // If word is already in vocabulary exactly, keep it
    if (dictionary.includes(word)) {
      correctedWords.push(word);
      continue;
    }

    let bestMatch = word;
    let minDistance = 999;

    for (const dictWord of dictionary) {
      if (Math.abs(dictWord.length - word.length) > 2) continue;
      const dist = damerauLevenshtein(word, dictWord);
      // Allow distance 1 for length 4-5, distance 2 for length 6+
      const maxAllowed = word.length >= 6 ? 2 : 1;
      if (dist <= maxAllowed && dist < minDistance) {
        minDistance = dist;
        bestMatch = dictWord;
      }
    }

    if (bestMatch !== word && minDistance <= 2) {
      correctedWords.push(bestMatch);
      wasCorrected = true;
    } else {
      correctedWords.push(word);
    }
  }

  if (wasCorrected) {
    return correctedWords.join(' ');
  }
  return null;
}

/**
 * Expands query tokens using the electronics synonyms map
 */
export function expandTokensWithSynonyms(tokens: string[], fullQueryNorm: string): string[] {
  const expanded = new Set<string>(tokens);

  // Check full query phrase in synonyms (e.g. "5v relay", "8 ohm", "temperature sensor", "32-bit")
  if (ELECTRONICS_SYNONYMS[fullQueryNorm]) {
    for (const syn of ELECTRONICS_SYNONYMS[fullQueryNorm]) {
      tokenizeQuery(syn).forEach((t) => expanded.add(t));
    }
  }

  // Check individual tokens
  for (const token of tokens) {
    if (ELECTRONICS_SYNONYMS[token]) {
      for (const syn of ELECTRONICS_SYNONYMS[token]) {
        tokenizeQuery(syn).forEach((t) => expanded.add(t));
      }
    }
  }

  return Array.from(expanded);
}

/**
 * Calculates a relevance score for a given product against a query.
 * Returns score and list of matched fields.
 */
export function scoreProduct(
  product: Product,
  rawQuery: string,
  normalizedQuery: string,
  tokens: string[],
  expandedTokens: string[],
  config: SearchConfig
): { score: number; matchedFields: string[]; snippet?: string } {
  let score = 0;
  const matchedFields: string[] = [];
  let snippet: string | undefined;

  const nameNorm = normalizeSearchText(product.name);
  const skuNorm = normalizeSearchText(product.sku);
  const brandNorm = normalizeSearchText(product.brand || '');
  const catNorm = normalizeSearchText(product.category || '');
  const subcatNorm = normalizeSearchText(product.subcategory || '');
  const descNorm = normalizeSearchText(product.description || '');
  const shortDescNorm = normalizeSearchText(product.shortDescription || '');
  const tagsNorm = (product.tags || []).map((t) => normalizeSearchText(t));

  // Specifications flattened string and map
  const specTokens: string[] = [];
  if (product.specifications && Array.isArray(product.specifications)) {
    for (const spec of product.specifications) {
      specTokens.push(normalizeSearchText(`${spec.name} ${spec.value}`));
    }
  }
  const allSpecsText = specTokens.join(' ');

  // 1. Exact Name Match
  if (nameNorm === normalizedQuery) {
    score += config.weights.exactNameMatch;
    matchedFields.push('name_exact');
  } else if (nameNorm.startsWith(normalizedQuery)) {
    score += config.weights.nameStartsWith;
    matchedFields.push('name_prefix');
  } else if (nameNorm.includes(normalizedQuery)) {
    score += config.weights.nameWordMatch;
    matchedFields.push('name_contains');
  }

  // 2. Exact SKU Match
  if (skuNorm === normalizedQuery) {
    score += config.weights.exactSkuMatch;
    matchedFields.push('sku_exact');
  } else if (skuNorm.startsWith(normalizedQuery)) {
    score += config.weights.skuStartsWith;
    matchedFields.push('sku_prefix');
  } else if (skuNorm.includes(normalizedQuery)) {
    score += config.weights.skuStartsWith * 0.7;
    matchedFields.push('sku_contains');
  }

  // 3. Token-by-token matching across Name
  let nameMatchesAll = true;
  for (const token of tokens) {
    if (nameNorm.includes(token)) {
      score += 20;
    } else {
      nameMatchesAll = false;
    }
  }
  if (nameMatchesAll && tokens.length > 1) {
    score += 25; // Bonus for multi-word full name coverage
    if (!matchedFields.includes('name_contains')) matchedFields.push('name_contains');
  }

  // 4. Brand Match
  if (brandNorm && (brandNorm === normalizedQuery || brandNorm.startsWith(normalizedQuery))) {
    score += config.weights.brandMatch;
    matchedFields.push('brand');
  } else if (brandNorm && brandNorm.includes(normalizedQuery)) {
    score += config.weights.brandMatch * 0.7;
    matchedFields.push('brand');
  } else {
    // Check if any token matches brand
    for (const token of tokens) {
      if (brandNorm.includes(token)) {
        score += 15;
        if (!matchedFields.includes('brand')) matchedFields.push('brand');
      }
    }
  }

  // 5. Category & Subcategory Match
  if (catNorm.includes(normalizedQuery) || subcatNorm.includes(normalizedQuery)) {
    score += config.weights.categoryMatch;
    matchedFields.push('category');
  } else {
    for (const token of tokens) {
      if (catNorm.includes(token) || subcatNorm.includes(token)) {
        score += 10;
        if (!matchedFields.includes('category')) matchedFields.push('category');
      }
    }
  }

  // 6. Tags Match
  for (const tag of tagsNorm) {
    if (tag === normalizedQuery) {
      score += config.weights.tagMatch * 1.5;
      if (!matchedFields.includes('tag')) matchedFields.push('tag');
    } else if (tag.includes(normalizedQuery)) {
      score += config.weights.tagMatch;
      if (!matchedFields.includes('tag')) matchedFields.push('tag');
    } else {
      for (const token of tokens) {
        if (tag.includes(token)) {
          score += 8;
          if (!matchedFields.includes('tag')) matchedFields.push('tag');
        }
      }
    }
  }

  // 7. Technical Specifications Match (crucial for "32-bit", "5V", "8 ohm", "I2C", "Cortex-M4", etc.)
  if (allSpecsText.includes(normalizedQuery)) {
    score += config.weights.specMatch;
    matchedFields.push('specifications');
    // Find matched specification snippet
    const matchedSpec = product.specifications?.find((s) =>
      normalizeSearchText(`${s.name} ${s.value}`).includes(normalizedQuery)
    );
    if (matchedSpec) {
      snippet = `${matchedSpec.name}: ${matchedSpec.value}`;
    }
  } else {
    // Check tokens in specs
    let specHits = 0;
    for (const token of tokens) {
      if (allSpecsText.includes(token)) {
        score += 12;
        specHits++;
      }
    }
    if (specHits > 0 && !matchedFields.includes('specifications')) {
      matchedFields.push('specifications');
    }
  }

  // 8. Description & Short Description Match
  if (descNorm.includes(normalizedQuery) || shortDescNorm.includes(normalizedQuery)) {
    score += config.weights.descriptionMatch;
    if (!matchedFields.includes('description')) matchedFields.push('description');
  } else {
    for (const token of tokens) {
      if (descNorm.includes(token) || shortDescNorm.includes(token)) {
        score += 5;
        if (!matchedFields.includes('description')) matchedFields.push('description');
      }
    }
  }

  // 9. Synonyms & Technical Unit Expansion Match
  if (expandedTokens.length > tokens.length) {
    for (const synToken of expandedTokens) {
      if (tokens.includes(synToken)) continue;
      if (nameNorm.includes(synToken)) {
        score += 18;
        if (!matchedFields.includes('synonym_name')) matchedFields.push('synonym_name');
      }
      if (allSpecsText.includes(synToken)) {
        score += 15;
        if (!matchedFields.includes('synonym_spec')) matchedFields.push('synonym_spec');
      }
      if (tagsNorm.some((t) => t.includes(synToken))) {
        score += 12;
        if (!matchedFields.includes('synonym_tag')) matchedFields.push('synonym_tag');
      }
    }
  }

  // 10. Availability Adjustment
  if (score > 0) {
    if (product.inStock && product.stockCount > 0) {
      score += config.inStockBoost;
    } else {
      score += config.outOfStockPenalty;
    }
  }

  return {
    score: Math.max(0, score),
    matchedFields,
    snippet,
  };
}

/**
 * Intelligent Multi-field Product Search
 * Searches strictly the provided products array from the active database/catalog.
 * Does not hallucinate or mock products.
 */
export function searchProducts(
  products: Product[],
  rawQuery: string,
  options: SearchOptions = {}
): SearchResult {
  const config = { ...DEFAULT_SEARCH_CONFIG, ...(options.config || {}) };
  const rawClean = rawQuery.trim();

  // If empty query, return empty or all products if requested
  if (!rawClean) {
    return {
      query: '',
      normalizedQuery: '',
      total: 0,
      results: [],
      didYouMean: null,
      matchingCategories: [],
      matchingBrands: [],
    };
  }

  const normalizedQuery = normalizeSearchText(rawClean);
  const tokens = tokenizeQuery(rawClean);
  const expandedTokens = expandTokensWithSynonyms(tokens, normalizedQuery);

  const hits: SearchHit[] = [];
  const matchingCategoriesSet = new Set<string>();
  const matchingBrandsSet = new Set<string>();

  for (const product of products) {
    // Optional category filter
    if (options.category && options.category !== 'all' && options.category !== 'All') {
      if (product.category.toLowerCase() !== options.category.toLowerCase()) {
        continue;
      }
    }

    // Optional in-stock filter
    if (options.inStockOnly && (!product.inStock || product.stockCount <= 0)) {
      continue;
    }

    // Optional price bounds
    if (options.minPrice !== undefined && product.price < options.minPrice) continue;
    if (options.maxPrice !== undefined && product.price > options.maxPrice) continue;

    const { score, matchedFields, snippet } = scoreProduct(
      product,
      rawClean,
      normalizedQuery,
      tokens,
      expandedTokens,
      config
    );

    if (score > 0) {
      hits.push({
        product,
        score,
        matchedFields,
        snippet,
      });

      if (product.category) matchingCategoriesSet.add(product.category);
      if (product.brand) matchingBrandsSet.add(product.brand);
    }
  }

  // Check if fuzzy spelling correction should be considered
  let didYouMean: string | null = null;
  const dictionary = extractCatalogDictionary(products);

  // If 0 results or very low results, check if spelling suggestion exists
  if (hits.length < 2) {
    const suggestion = getSpellingSuggestion(rawClean, dictionary);
    if (suggestion && normalizeSearchText(suggestion) !== normalizedQuery) {
      didYouMean = suggestion;

      // If we had 0 exact results, also search the suggested term so customer gets useful results!
      if (hits.length === 0) {
        const suggestionNorm = normalizeSearchText(suggestion);
        const suggestionTokens = tokenizeQuery(suggestion);
        const suggestionExpanded = expandTokensWithSynonyms(suggestionTokens, suggestionNorm);

        for (const product of products) {
          const { score, matchedFields, snippet } = scoreProduct(
            product,
            suggestion,
            suggestionNorm,
            suggestionTokens,
            suggestionExpanded,
            config
          );

          if (score > 0) {
            hits.push({
              product,
              score: Math.max(1, score * 0.8), // slight penalty for fuzzy correction
              matchedFields: [...matchedFields, 'fuzzy_spelling'],
              snippet,
            });
            if (product.category) matchingCategoriesSet.add(product.category);
            if (product.brand) matchingBrandsSet.add(product.brand);
          }
        }
      }
    }
  }

  // Sort descending by calculated relevance score
  hits.sort((a, b) => b.score - a.score);

  // Apply limit if specified
  const limit = options.limit || config.autocompleteLimit;
  const finalResults = options.limit !== undefined || limit ? hits.slice(0, limit) : hits;

  return {
    query: rawClean,
    normalizedQuery,
    total: hits.length,
    results: finalResults,
    didYouMean,
    matchingCategories: Array.from(matchingCategoriesSet),
    matchingBrands: Array.from(matchingBrandsSet),
  };
}
