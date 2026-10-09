import type {
  Leaderboard,
  PlayAnswer,
  PlayResult,
  PlaySessionStart,
  PlayStartRequest,
  QuizPreview,
} from '@/api/types';
import { apiClient } from '@/lib/axios';
import { rememberStart } from './session';

export async function startPlaySession(body: PlayStartRequest): Promise<PlaySessionStart> {
  const { data } = await apiClient.post<PlaySessionStart>('/play-sessions', body);
  rememberStart(data.id, body);
  return data;
}

export async function startCustomPlay(quizKey: string): Promise<{ sessionId: string; quizId?: string }> {
  let quizId: string | undefined;
  try {
    const preview = await apiClient.get<QuizPreview>(`/quizzes/by-key/${quizKey}`);
    quizId = preview.data.id;
  } catch {
    quizId = undefined;
  }
  const session = await startPlaySession({ source: 'CUSTOM', quizKey });
  return { sessionId: session.id, quizId };
}

export async function fetchPlaySession(sessionId: string): Promise<PlaySessionStart> {
  const { data } = await apiClient.get<PlaySessionStart>(`/play-sessions/${sessionId}`);
  return data;
}

export async function submitAnswer(
  sessionId: string,
  body: { questionId: string; selectedOption: string | null },
): Promise<PlayAnswer> {
  const { data } = await apiClient.post<PlayAnswer>(`/play-sessions/${sessionId}/answers`, body);
  return data;
}

export async function finishPlaySession(sessionId: string): Promise<void> {
  await apiClient.post(`/play-sessions/${sessionId}/finish`);
}

export async function fetchPlayResult(sessionId: string): Promise<PlayResult> {
  const { data } = await apiClient.get<PlayResult>(`/play-sessions/${sessionId}/result`);
  return data;
}

export async function fetchLeaderboard(quizId: string): Promise<Leaderboard> {
  const { data } = await apiClient.get<Leaderboard>(`/leaderboards/quizzes/${quizId}`);
  return data;
}
