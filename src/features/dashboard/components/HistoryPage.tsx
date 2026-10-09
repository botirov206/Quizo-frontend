import type { FC } from 'react';
import { DashboardLayout } from './DashboardLayout';
import { useHistory } from '../hooks/useAccountStats';

export const HistoryPage: FC = () => {
  const history = useHistory();
  const items = history.data ?? [];

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-2xl space-y-4">
        <h1 className="text-3xl font-bold">History</h1>
        {history.isLoading && <p className="text-muted-foreground">Loading…</p>}
        {!history.isLoading && items.length === 0 && (
          <p className="text-muted-foreground">Finished quizzes will show up here.</p>
        )}
        <ul className="space-y-2">
          {items.map((item) => (
            <li key={item.id} className="flex items-center justify-between rounded-xl bg-card px-4 py-3">
              <div>
                <p className="font-semibold">{item.quizTitle}</p>
                <p className="text-sm text-muted-foreground">{item.correctCount}/{item.totalQuestions} correct</p>
              </div>
              <p className="text-lg font-bold">{item.percentage}%</p>
            </li>
          ))}
        </ul>
      </div>
    </DashboardLayout>
  );
};
