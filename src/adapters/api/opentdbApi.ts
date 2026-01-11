/**
 * OpenTDB API
 * Handles all HTTP requests to OpenTDB
 * 
 * Single Responsibility: HTTP requests only, no data transformation
 */

import type { OpenTDBResponse, OpenTDBCategoriesResponse, QuizFetchOptions } from '../types';
import { OPENTDB_CONFIG, DEFAULT_FETCH_OPTIONS, HTTP_ERROR_MESSAGES } from '../constants';

// Track last request time to prevent rate limiting
let lastRequestTime = 0;

/**
 * Wait for rate limit cooldown if needed
 */
const waitForRateLimit = async (): Promise<void> => {
  const now = Date.now();
  const timeSinceLastRequest = now - lastRequestTime;
  const minDelay = OPENTDB_CONFIG.RATE_LIMIT_DELAY;

  if (timeSinceLastRequest < minDelay) {
    const waitTime = minDelay - timeSinceLastRequest;
    console.log(`[OpenTDB] Waiting ${waitTime}ms for rate limit...`);
    await new Promise(resolve => setTimeout(resolve, waitTime));
  }
};

/**
 * Builds the API URL with query parameters
 */
export const buildOpenTDBUrl = (options: QuizFetchOptions): string => {
  const params = new URLSearchParams();
  const baseUrl = `${OPENTDB_CONFIG.BASE_URL}${OPENTDB_CONFIG.ENDPOINTS.QUESTIONS}`;

  params.append('amount', String(options.amount || DEFAULT_FETCH_OPTIONS.amount));

  if (options.category && options.category > 0) {
    params.append('category', String(options.category));
  }

  if (options.difficulty) {
    params.append('difficulty', options.difficulty);
  }

  if (options.type) {
    params.append('type', options.type);
  }

  return `${baseUrl}?${params.toString()}`;
};

/**
 * Fetches raw questions from OpenTDB API with retry logic
 * Returns the raw API response without transformation
 */
export const fetchOpenTDBRaw = async (
  options: QuizFetchOptions = {},
  retryCount: number = 0
): Promise<OpenTDBResponse> => {
  const mergedOptions = { ...DEFAULT_FETCH_OPTIONS, ...options };
  const url = buildOpenTDBUrl(mergedOptions);

  // Wait for rate limit before making request
  await waitForRateLimit();

  try {
    lastRequestTime = Date.now();
    const response = await fetch(url);

    // Handle rate limit (429) with retry
    if (response.status === 429) {
      if (retryCount < OPENTDB_CONFIG.MAX_RETRIES) {
        console.log(`[OpenTDB] Rate limited (429). Retry ${retryCount + 1}/${OPENTDB_CONFIG.MAX_RETRIES} after ${OPENTDB_CONFIG.RETRY_DELAY}ms`);
        await new Promise(resolve => setTimeout(resolve, OPENTDB_CONFIG.RETRY_DELAY));
        return fetchOpenTDBRaw(options, retryCount + 1);
      }
      throw new Error(HTTP_ERROR_MESSAGES[429]);
    }

    if (!response.ok) {
      const errorMessage = HTTP_ERROR_MESSAGES[response.status] 
        || `HTTP error: ${response.status} ${response.statusText}`;
      throw new Error(errorMessage);
    }

    return response.json();
  } catch (error) {
    // If it's already our formatted error, rethrow
    if (error instanceof Error && error.message.includes('OpenTDB')) {
      throw error;
    }
    // Network error
    throw new Error('Network error. Please check your connection and try again.');
  }
};

/**
 * Fetches categories from OpenTDB API
 * Returns the raw API response
 */
export const fetchOpenTDBCategoriesRaw = async (): Promise<OpenTDBCategoriesResponse> => {
  const url = `${OPENTDB_CONFIG.BASE_URL}${OPENTDB_CONFIG.ENDPOINTS.CATEGORIES}`;

  // Wait for rate limit
  await waitForRateLimit();

  try {
    lastRequestTime = Date.now();
    const response = await fetch(url);

    if (response.status === 429) {
      throw new Error(HTTP_ERROR_MESSAGES[429]);
    }

    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }

    return response.json();
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Failed to fetch categories');
  }
};

/**
 * Request a new session token from OpenTDB
 */
export const requestOpenTDBToken = async (): Promise<string> => {
  const url = `${OPENTDB_CONFIG.BASE_URL}${OPENTDB_CONFIG.ENDPOINTS.TOKEN}?command=request`;

  await waitForRateLimit();
  lastRequestTime = Date.now();

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Failed to request token: ${response.status}`);
  }

  const data = await response.json();
  return data.token;
};

/**
 * Reset a session token
 */
export const resetOpenTDBToken = async (token: string): Promise<void> => {
  const url = `${OPENTDB_CONFIG.BASE_URL}${OPENTDB_CONFIG.ENDPOINTS.TOKEN}?command=reset&token=${token}`;

  await waitForRateLimit();
  lastRequestTime = Date.now();

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Failed to reset token: ${response.status}`);
  }
};

/**
 * Reset the rate limit tracker (useful for testing)
 */
export const resetRateLimitTracker = (): void => {
  lastRequestTime = 0;
};
