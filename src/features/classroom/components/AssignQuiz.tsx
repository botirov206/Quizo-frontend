import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { useQuizList } from '@/features/quiz';
import { useAssignQuiz } from '../api';

export function AssignQuiz({ classroomId }: { classroomId: string }) {
  const quizzes = useQuizList({ mine: true, limit: 20 });
  const assign = useAssignQuiz(classroomId);
  const [quizId, setQuizId] = useState('');

  const send = () => {
    if (!quizId) return;
    assign.mutate(quizId, {
      onSuccess: () => {
        toast.success('Quiz assigned');
        setQuizId('');
      },
    });
  };

  const items = quizzes.data?.items ?? [];
  if (items.length === 0) return null;

  return (
    <div className="space-y-2 rounded-xl border p-3">
      <p className="text-sm font-semibold">Assign a quiz</p>
      <select
        className="h-10 w-full rounded-md border bg-background px-2 text-sm"
        value={quizId}
        onChange={(event) => setQuizId(event.target.value)}
      >
        <option value="">Choose a quiz</option>
        {items.map((quiz) => (
          <option key={quiz.id} value={quiz.id}>{quiz.title}</option>
        ))}
      </select>
      <Button type="button" size="sm" className="w-full" disabled={!quizId || assign.isPending} onClick={send}>
        {assign.isPending ? 'Assigning…' : 'Assign'}
      </Button>
    </div>
  );
}
