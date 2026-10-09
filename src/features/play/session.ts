import type { PlaySessionStart, PlayStartRequest, PlayerQuestion } from '@/api/types';

const START_KEY = 'play-start:';

export function remainingQuestions(session: PlaySessionStart): PlayerQuestion[] {
  if (session.questions.length === session.totalQuestions) {
    return session.questions.slice(session.currentIndex);
  }
  return session.questions;
}

export function nextDeadlineMs(startsAt: string, timePerQuestion: number): number {
  return Date.parse(startsAt) + (timePerQuestion + 2) * 1000;
}

export function playHref(sessionId: string, quizId?: string): string {
  if (!quizId) return `/play/${sessionId}`;
  return `/play/${sessionId}?quizId=${encodeURIComponent(quizId)}`;
}

export function rememberStart(sessionId: string, body: PlayStartRequest): void {
  sessionStorage.setItem(START_KEY + sessionId, JSON.stringify(body));
}

export function recallStart(sessionId: string): PlayStartRequest | null {
  const raw = sessionStorage.getItem(START_KEY + sessionId);
  if (!raw) return null;
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!isStartRequest(parsed)) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function toApiDifficulty(value: string): 'EASY' | 'MEDIUM' | 'HARD' {
  const upper = value.toUpperCase();
  if (upper === 'EASY' || upper === 'MEDIUM' || upper === 'HARD') return upper;
  return 'MEDIUM';
}

function isStartRequest(value: unknown): value is PlayStartRequest {
  if (typeof value !== 'object' || value === null) return false;
  const record = value as Record<string, unknown>;
  if (record.source === 'CUSTOM' && typeof record.quizKey === 'string') return true;
  if (record.source === 'CUSTOM' && typeof record.assignmentId === 'string') return true;
  return record.source === 'OPENTDB' && typeof record.categoryId === 'string';
}
