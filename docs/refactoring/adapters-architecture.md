# Adapters Clean Architecture

## Overview

The `src/adapters/` folder was refactored from 2 monolithic files (~677 lines total) into a modular architecture following:

- **Single Responsibility Principle (SRP)**: Each file does one thing
- **Separation of Concerns**: HTTP, transformation, and configuration are isolated
- **Open/Closed Principle**: Easy to add new sources without modifying existing code

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           UI LAYER                                      │
│  (Dashboard, GameEngine, CategoryBrowser)                               │
└───────────────────────────────┬─────────────────────────────────────────┘
                                │ imports
                                ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                        adapters/index.ts                                │
│                        (Public API)                                     │
└───────────────────────────────┬─────────────────────────────────────────┘
                                │
        ┌───────────────────────┼───────────────────────┐
        ▼                       ▼                       ▼
┌───────────────┐     ┌─────────────────┐     ┌─────────────────┐
│ quizService   │     │   services/     │     │   mocks/        │
│ (Unified API) │────▶│  (Composition)  │────▶│ (Development)   │
└───────────────┘     └────────┬────────┘     └─────────────────┘
                               │
              ┌────────────────┼────────────────┐
              ▼                ▼                ▼
       ┌──────────┐    ┌──────────────┐   ┌──────────────┐
       │   api/   │    │ normalizers/ │   │ constants/   │
       │ (HTTP)   │    │ (Transform)  │   │  (Config)    │
       └────┬─────┘    └──────────────┘   └──────────────┘
            │
            ▼
    ┌───────────────┐
    │  External APIs │
    │  (OpenTDB,    │
    │   Backend)    │
    └───────────────┘
```

## Folder Structure

```
src/adapters/
├── constants/
│   └── index.ts              # All configuration in one place
├── api/
│   ├── opentdbApi.ts         # Raw HTTP fetch (no transformation)
│   ├── backendApi.ts         # Raw HTTP fetch (no transformation)
│   └── index.ts              # Re-exports
├── normalizers/
│   ├── opentdbNormalizer.ts  # OpenTDB → StandardQuiz
│   ├── backendNormalizer.ts  # Backend → StandardQuiz
│   └── index.ts              # Re-exports
├── mocks/
│   ├── mockQuizzes.ts        # Sample quiz data
│   └── index.ts              # Re-exports
├── services/
│   ├── opentdbService.ts     # Composed: fetch + normalize
│   ├── backendService.ts     # Composed: fetch + normalize
│   └── index.ts              # Re-exports
├── types.ts                  # All TypeScript interfaces
├── utils.ts                  # Shared utility functions
├── quizService.ts            # Unified multi-source service
└── index.ts                  # Public API
```

## File Responsibilities

### constants/index.ts
- **Purpose**: Centralized configuration
- **Contains**: URLs, endpoints, error messages, defaults
- **Why separate**: Configuration changes don't affect logic

```typescript
export const OPENTDB_CONFIG = {
  BASE_URL: 'https://opentdb.com',
  ENDPOINTS: { ... },
  RATE_LIMIT_DELAY: 5500,
};
```

### api/opentdbApi.ts
- **Purpose**: Raw HTTP requests only
- **Contains**: fetch functions that return raw API responses
- **Why separate**: HTTP logic isolated from transformation

```typescript
export const fetchOpenTDBRaw = async (options): Promise<OpenTDBResponse> => {
  const response = await fetch(url);
  return response.json(); // No transformation!
};
```

### normalizers/opentdbNormalizer.ts
- **Purpose**: Data transformation only
- **Contains**: Functions that convert API format → StandardQuiz
- **Why separate**: Can be unit tested without mocking HTTP

```typescript
export const normalizeOpenTDBQuestion = (question): StandardQuestion => {
  return {
    id: generateQuestionId(),
    text: decodeHtmlEntities(question.question),
    options: shuffleArray([...]),
    // Pure transformation, no side effects
  };
};
```

### services/opentdbService.ts
- **Purpose**: Compose fetch + normalize
- **Contains**: High-level functions used by UI
- **Why separate**: Orchestration logic in one place

```typescript
export const fetchOpenTDBQuiz = async (options): Promise<AdapterResult<StandardQuiz>> => {
  const raw = await fetchOpenTDBRaw(options);  // HTTP
  const quiz = normalizeOpenTDBQuiz(raw);       // Transform
  return { data: quiz, success: true };
};
```

### quizService.ts
- **Purpose**: Unified multi-source API
- **Contains**: Functions that combine OpenTDB + Backend
- **Why separate**: Source orchestration is its own concern

```typescript
export const fetchAllQuizzes = async (): Promise<AdapterResult<StandardQuiz[]>> => {
  const opentdb = await fetchOpenTDBQuiz();
  const backend = await fetchQuizzesAuto();
  return { data: [...opentdb, ...backend] };
};
```

## Benefits

### 1. Testability
```typescript
// Before: Had to mock HTTP to test normalization
// After: Test normalizer directly
const result = normalizeOpenTDBQuestion(mockQuestion);
expect(result.text).toBe('Decoded text');
```

### 2. Maintainability
```
Before: Change API format → hunt through 300-line file
After:  Change API format → only touch normalizer file
```

### 3. Reusability
```typescript
// Normalizers can be used elsewhere
import { normalizeOpenTDBQuestion } from '@/adapters/normalizers';

// API can be used for other purposes
import { fetchOpenTDBCategoriesRaw } from '@/adapters/api';
```

### 4. Readability
- Each file is ~50-100 lines (was 297 and 380)
- Clear file names indicate purpose
- Easy to onboard new developers

### 5. Extensibility
Adding a new source (e.g., Trivia API):
1. Create `api/triviaApi.ts`
2. Create `normalizers/triviaNormalizer.ts`
3. Create `services/triviaService.ts`
4. Add to `quizService.ts` orchestration

No existing files need modification!

## Usage Examples

### For UI Components (Recommended)
```typescript
import { fetchAllQuizzes, fetchOpenTDBCategories } from '@/adapters';

// Unified fetch
const result = await fetchAllQuizzes({ source: 'opentdb' });

// Categories
const categories = await fetchOpenTDBCategories();
```

### For Advanced Use Cases
```typescript
import { 
  fetchOpenTDBRaw,           // Just HTTP
  normalizeOpenTDBQuiz,      // Just transform
} from '@/adapters';

// Custom handling
const raw = await fetchOpenTDBRaw({ amount: 50 });
const quiz = normalizeOpenTDBQuiz(raw.results, options);
```

### For Testing
```typescript
import { MOCK_QUIZZES, getMockQuizById } from '@/adapters';
import { normalizeOpenTDBQuestion } from '@/adapters/normalizers';

// Use mock data
const quiz = getMockQuizById('custom_1');

// Test normalizer in isolation
const result = normalizeOpenTDBQuestion(testData);
```

## Migration from Old Structure

Old imports continue to work (all re-exported from index.ts):

```typescript
// These still work
import { fetchOpenTDBQuiz } from '@/adapters';
import { fetchAllQuizzes } from '@/adapters';
```

New granular imports available:
```typescript
// More specific imports
import { normalizeOpenTDBQuiz } from '@/adapters/normalizers';
import { fetchOpenTDBRaw } from '@/adapters/api';
```

## Conclusion

The refactored adapters layer now follows clean architecture principles:

| Metric | Before | After |
|--------|--------|-------|
| Files | 2 monolithic | 12 focused |
| Largest file | 380 lines | ~100 lines |
| Concerns per file | 3-4 | 1 |
| Testability | Low | High |
| Maintainability | Medium | High |
