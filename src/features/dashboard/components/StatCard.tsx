import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, TrendingUp, Flame, Clock } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: 'completed' | 'average' | 'streak' | 'time';
  trend?: {
    value: string;
    direction: 'up' | 'down' | 'stable';
  };
  className?: string;
}

const iconMap: Record<string, LucideIcon> = {
  completed: CheckCircle2,
  average: TrendingUp,
  streak: Flame,
  time: Clock,
};

const iconColorMap: Record<string, string> = {
  completed: 'text-green-600 bg-green-100',
  average: 'text-blue-600 bg-blue-100',
  streak: 'text-orange-600 bg-orange-100',
  time: 'text-purple-600 bg-purple-100',
};

export const StatCard = ({ title, value, icon, trend, className }: StatCardProps) => {
  const Icon = iconMap[icon];
  const iconColor = iconColorMap[icon];

  return (
    <Card className={cn('', className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <div className={cn('p-2 rounded-lg', iconColor)}>
          <Icon className="h-4 w-4" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {trend && (
          <p className="text-xs text-muted-foreground mt-1">
            <span
              className={cn(
                'font-medium',
                trend.direction === 'up' && 'text-green-600',
                trend.direction === 'down' && 'text-red-600',
                trend.direction === 'stable' && 'text-gray-600'
              )}
            >
              {trend.direction === 'up' && '↑ '}
              {trend.direction === 'down' && '↓ '}
              {trend.value}
            </span>
          </p>
        )}
      </CardContent>
    </Card>
  );
};
