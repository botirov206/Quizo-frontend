/**
 * Adapter Utilities
 * Helper functions for data normalization and transformation
 */

/**
 * Decodes HTML entities in a string
 * OpenTDB returns HTML-encoded strings that need to be decoded
 * 
 * @example
 * decodeHtmlEntities("Don&apos;t &amp; Won&apos;t") // "Don't & Won't"
 * decodeHtmlEntities("&quot;Hello&quot;") // "\"Hello\""
 */
export const decodeHtmlEntities = (text: string): string => {
  const textArea = document.createElement('textarea');
  textArea.innerHTML = text;
  return textArea.value;
};

/**
 * Decodes HTML entities for server-side or non-DOM environments
 * Uses regex replacement for common HTML entities
 */
export const decodeHtmlEntitiesSSR = (text: string): string => {
  const entities: Record<string, string> = {
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&#039;': "'",
    '&apos;': "'",
    '&nbsp;': ' ',
    '&ldquo;': '"',
    '&rdquo;': '"',
    '&lsquo;': "'",
    '&rsquo;': "'",
    '&hellip;': '…',
    '&mdash;': '—',
    '&ndash;': '–',
    '&pi;': 'π',
    '&eacute;': 'é',
    '&egrave;': 'è',
    '&ouml;': 'ö',
    '&uuml;': 'ü',
  };

  let decoded = text;
  
  // Replace named entities
  for (const [entity, char] of Object.entries(entities)) {
    decoded = decoded.replace(new RegExp(entity, 'g'), char);
  }
  
  // Replace numeric entities (&#039;, &#x27;, etc.)
  decoded = decoded.replace(/&#(\d+);/g, (_, num) => 
    String.fromCharCode(parseInt(num, 10))
  );
  decoded = decoded.replace(/&#x([0-9a-fA-F]+);/g, (_, hex) => 
    String.fromCharCode(parseInt(hex, 16))
  );

  return decoded;
};

/**
 * Shuffles an array using Fisher-Yates algorithm
 * Creates a new array (does not mutate original)
 */
export const shuffleArray = <T>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

/**
 * Generates a unique ID for quiz questions
 * Uses a combination of timestamp and random string
 */
export const generateQuestionId = (prefix = 'q'): string => {
  const timestamp = Date.now().toString(36);
  const randomStr = Math.random().toString(36).substring(2, 8);
  return `${prefix}_${timestamp}_${randomStr}`;
};

/**
 * Generates a unique quiz ID from OpenTDB parameters
 */
export const generateOpenTDBQuizId = (
  category?: number,
  difficulty?: string,
  amount?: number
): string => {
  const timestamp = Date.now().toString(36);
  const parts = ['opentdb', timestamp];
  if (category) parts.push(`cat${category}`);
  if (difficulty) parts.push(difficulty);
  if (amount) parts.push(`n${amount}`);
  return parts.join('_');
};

/**
 * Safely parses JSON with error handling
 */
export const safeJsonParse = <T>(json: string, fallback: T): T => {
  try {
    return JSON.parse(json) as T;
  } catch {
    return fallback;
  }
};

/**
 * Maps OpenTDB difficulty to our standard format
 */
export const mapDifficulty = (
  difficulty: string
): 'easy' | 'medium' | 'hard' => {
  const normalized = difficulty.toLowerCase();
  if (normalized === 'easy' || normalized === 'medium' || normalized === 'hard') {
    return normalized;
  }
  return 'medium'; // default
};

/**
 * Maps question type from OpenTDB format to our format
 */
export const mapQuestionType = (type: string): 'multiple' | 'boolean' => {
  return type === 'boolean' ? 'boolean' : 'multiple';
};

/**
 * Creates a category name from OpenTDB category string
 * Strips "Entertainment: " or "Science: " prefixes for cleaner display
 */
export const cleanCategoryName = (category: string): string => {
  return category
    .replace(/^Entertainment:\s*/i, '')
    .replace(/^Science:\s*/i, '');
};
