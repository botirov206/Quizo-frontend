import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { PlayAnswer, PlayResult, PlaySessionStart, PlayerQuestion } from '@/api/types';
import { getErrorCode, getErrorMessage } from '@/lib/api-error';
import {
  fetchPlayResult,
  fetchPlaySession,
  finishPlaySession,
  startPlaySession,
  submitAnswer,
} from '../api';
import { nextDeadlineMs, playHref, recallStart, remainingQuestions } from '../session';

type Status = 'loading' | 'question' | 'feedback' | 'result' | 'error';

export function usePlaySession(sessionId: string, quizId?: string) {
  const navigate = useNavigate();
  const [status, setStatus] = useState<Status>('loading');
  const [session, setSession] = useState<PlaySessionStart | null>(null);
  const [remaining, setRemaining] = useState<PlayerQuestion[]>([]);
  const [deadlineMs, setDeadlineMs] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<PlayAnswer | null>(null);
  const [result, setResult] = useState<PlayResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [now, setNow] = useState(() => Date.now());
  const [pendingOption, setPendingOption] = useState<string | null>(null);
  const lock = useRef(false);
  const advanced = useRef(false);

  const fail = (err: unknown) => {
    setError(getErrorMessage(err));
    setStatus('error');
  };

  const showResult = useCallback(async () => {
    setResult(await fetchPlayResult(sessionId));
    setStatus('result');
  }, [sessionId]);

  const applySession = useCallback((next: PlaySessionStart) => {
    setSession(next);
    setRemaining(remainingQuestions(next));
    setDeadlineMs(Date.parse(next.questionDeadline));
    setFeedback(null);
    setPendingOption(null);
    advanced.current = false;
    setStatus('question');
  }, []);

  useEffect(() => {
    let active = true;
    setStatus('loading');
    fetchPlaySession(sessionId)
      .then((data) => {
        if (active) applySession(data);
      })
      .catch(async (err: unknown) => {
        if (!active) return;
        if (getErrorCode(err) === 'SESSION_NOT_ACTIVE') {
          try {
            await showResult();
          } catch (resultError) {
            fail(resultError);
          }
          return;
        }
        fail(err);
      });
    return () => {
      active = false;
    };
  }, [sessionId, applySession, showResult]);

  useEffect(() => {
    if (status !== 'question' && status !== 'feedback') return undefined;
    const id = window.setInterval(() => setNow(Date.now()), 200);
    return () => window.clearInterval(id);
  }, [status]);

  const send = useCallback(async (selectedOption: string | null) => {
    const question = remaining[0];
    if (!question || lock.current || status !== 'question') return;
    lock.current = true;
    setBusy(true);
    setPendingOption(selectedOption);
    try {
      const answer = await submitAnswer(sessionId, { questionId: question.id, selectedOption });
      setFeedback(answer);
      setSession((current) => (
        current ? { ...current, totalScore: answer.totalScore, currentIndex: answer.currentIndex } : current
      ));
      advanced.current = false;
      setStatus('feedback');
    } catch (err) {
      const code = getErrorCode(err);
      if (code === 'OUT_OF_ORDER' || code === 'ALREADY_ANSWERED') {
        try {
          applySession(await fetchPlaySession(sessionId));
        } catch (refreshError) {
          fail(refreshError);
        }
      } else if (code === 'SESSION_NOT_ACTIVE') {
        try {
          await showResult();
        } catch (resultError) {
          fail(resultError);
        }
      } else {
        fail(err);
      }
    } finally {
      lock.current = false;
      setBusy(false);
    }
  }, [remaining, status, sessionId, applySession, showResult]);

  useEffect(() => {
    if (status !== 'question' || deadlineMs == null || busy) return;
    if (now < deadlineMs) return;
    void send(null);
  }, [status, deadlineMs, now, busy, send]);

  useEffect(() => {
    if (status !== 'feedback' || !feedback || advanced.current) return;
    const starts = feedback.nextQuestionStartsAt;
    if (starts && now < Date.parse(starts)) return;
    advanced.current = true;
    if (feedback.finished || !starts) {
      void showResult().catch(fail);
      return;
    }
    setRemaining((list) => list.slice(1));
    setDeadlineMs(nextDeadlineMs(starts, session?.timePerQuestion ?? 30));
    setFeedback(null);
    setPendingOption(null);
    setStatus('question');
  }, [status, feedback, now, session?.timePerQuestion, showResult]);

  const endEarly = useCallback(async () => {
    if (lock.current) return;
    lock.current = true;
    try {
      await finishPlaySession(sessionId);
      await showResult();
    } catch (err) {
      if (getErrorCode(err) === 'SESSION_NOT_ACTIVE') {
        try {
          await showResult();
        } catch (resultError) {
          fail(resultError);
        }
      } else {
        fail(err);
      }
    } finally {
      lock.current = false;
    }
  }, [sessionId, showResult]);

  const playAgain = useCallback(async () => {
    const body = recallStart(sessionId);
    if (!body) {
      navigate('/join');
      return;
    }
    const next = await startPlaySession(body);
    navigate(playHref(next.id, quizId));
  }, [sessionId, quizId, navigate]);

  const total = session?.totalQuestions ?? result?.totalQuestions ?? 0;

  return {
    status,
    question: remaining[0] ?? null,
    questionNumber: total > 0 ? total - remaining.length + 1 : 1,
    total,
    secondsLeft: deadlineMs == null ? 0 : Math.max(0, Math.ceil((deadlineMs - now) / 1000)),
    feedback,
    result,
    error,
    busy,
    pendingOption,
    totalScore: feedback?.totalScore ?? session?.totalScore ?? result?.totalScore ?? 0,
    choose: (option: string) => { void send(option); },
    endEarly,
    playAgain,
  };
}
