# Day 5: Adapters & API Integration ✅

**Status: COMPLETE** ✅

- [x] OpenTDB adapter path (normalize to StandardQuiz)
- [x] Backend adapter path (normalize, auth headers)
- [x] Dashboard fetches custom quizzes via adapters
- [x] Source filter exists (`SourceFilter`); Explore is the OpenTDB UI
- [x] Adapter switching without UI changes (`BACKEND_CONFIG.USE_REAL_API`)

## Implementation Summary

### Files (current layout)

The original two-file adapters (`opentdbAdapter.ts`, `backendAdapter.ts`) were split:

- `src/adapters/types.ts` — OpenTDB and backend interfaces
- `src/adapters/utils.ts` — HTML decode, shuffle, ids
- `src/adapters/api/` — raw HTTP (`opentdbApi.ts`, `backendApi.ts`)
- `src/adapters/normalizers/` — API → `StandardQuiz`
- `src/adapters/services/` — fetch + normalize
- `src/adapters/quizService.ts` — unified multi-source orchestration
- `src/adapters/constants/index.ts` — URLs, endpoints, `BACKEND_CONFIG.USE_REAL_API`
- `src/adapters/index.ts` — public API
- `src/lib/axios.ts` — axios instance with interceptors

### Key Features

1. **HTML Entity Decoding** — OpenTDB returns HTML-encoded strings
2. **Fisher-Yates Shuffle** — options shuffled per question
3. **Rate Limit Handling** — OpenTDB 5.5s delay, retry on 429
4. **Source Filtering** — `fetchAllQuizzes({ source: 'all' | 'opentdb' | 'custom' })`
5. **Real backend** — `BACKEND_CONFIG.USE_REAL_API` is `true` in `constants/index.ts`
6. **Auth Token Injection** — axios interceptor adds Bearer token

### Architecture

```
[OpenTDB API] ──→ [api + normalizer + service] ──→ [StandardQuiz] ──→ [Explore UI]
[Backend API] ──→ [api + normalizer + service] ──→ [StandardQuiz] ──→ [Dashboard / Game]
                                              ↑
                               [quizService.ts] combines both
```

### Switching mock vs real backend

In `src/adapters/constants/index.ts`:

```typescript
export const BACKEND_CONFIG = {
  // ...
  USE_REAL_API: true, // false uses mocks/mockQuizzes.ts
} as const;
```

Acceptance Criteria:
- ✅ Unified list from both sources (quizService)
- ✅ Play works for OpenTDB (`/play/opentdb`) and custom (`/quiz/:id/play`)
- ⚠️ Dashboard quiz grid is custom-only; OpenTDB browsing is `/explore`
- ⚠️ Source badges exist on `QuizCard`; source filter tabs are commented out
