import { Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TimerProps {
  timeLeft: number;
  totalTime: number;
}

export const Timer = ({ timeLeft, totalTime }: TimerProps) => {
  const percentage = (timeLeft / totalTime) * 100;
  const isLowTime = percentage < 25;
  const isCritical = percentage < 10;

  return (
    <div className="flex items-center gap-3">
      <Clock 
        className={cn(
          'h-5 w-5',
          isCritical && 'text-red-500 animate-pulse',
          isLowTime && !isCritical && 'text-orange-500'
        )} 
      />
      <div className="flex-1 space-y-1">
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium">Time Remaining</span>
          <span 
            className={cn(
              'font-bold',
              isCritical && 'text-red-500',
              isLowTime && !isCritical && 'text-orange-500'
            )}
          >
            {timeLeft}s
          </span>
        </div>
        <div className="w-full bg-secondary rounded-full h-2 overflow-hidden">
          <div
            className={cn(
              'h-full transition-all duration-1000 ease-linear',
              isCritical && 'bg-red-500',
              isLowTime && !isCritical && 'bg-orange-500',
              !isLowTime && 'bg-primary'
            )}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    </div>
  );
};
