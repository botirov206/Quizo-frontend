# Day 5: Adapters & API Integration ✅

**Status: COMPLETE** ✅

- [x] Write opentdbAdapter.ts (normalize to StandardQuiz)
- [x] Write backendAdapter.ts (normalize, auth headers)
- [x] Update Dashboard to fetch both sources
- [x] Filter by source, show badge
- [x] Test adapter switching without UI changes

## Implementation Summary

### Files Created:
- `src/adapters/types.ts` - All adapter interfaces and types
- `src/adapters/utils.ts` - Shared utilities (HTML decode, shuffle, etc.)
- `src/adapters/opentdbAdapter.ts` - OpenTDB API normalization
- `src/adapters/backendAdapter.ts` - Custom backend normalization + mocks
- `src/adapters/quizService.ts` - Unified service combining both sources
- `src/adapters/index.ts` - Public API exports
- `src/lib/axios.ts` - Configured axios instance with interceptors

### Key Features:
1. **HTML Entity Decoding** - OpenTDB returns HTML-encoded strings
2. **Fisher-Yates Shuffle** - Options are shuffled for each question
3. **Rate Limit Handling** - OpenTDB has 5-second rate limit
4. **Source Filtering** - Filter by 'all', 'opentdb', or 'custom'
5. **Mock Backend** - Full mock implementation until API is ready
6. **Auth Token Injection** - Axios interceptor adds Bearer token

### Architecture Pattern:
```
[OpenTDB API] ──→ [opentdbAdapter.ts] ──→ [StandardQuiz] ──→ [Game UI]
[Backend API] ──→ [backendAdapter.ts] ──→ [StandardQuiz] ──→ [Game UI]
                                              ↑
                               [quizService.ts] combines both
```

### API Integration Ready:
To switch from mock to real backend, change in `quizService.ts`:
```typescript
const CONFIG = {
  USE_REAL_BACKEND: true, // Change to true
  // ...
};
```

Acceptance Criteria:
- ✅ Unified list from both sources
- ✅ Play works for both source types
- ✅ Filter tabs show correct counts
- ✅ Source badges visible on cards
