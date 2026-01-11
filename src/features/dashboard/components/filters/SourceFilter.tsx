/**
 * SourceFilter Component
 * Filter buttons for quiz sources (All, OpenTDB, Custom)
 * 
 * Single Responsibility: Source filtering UI only
 * 
 * NOTE: Currently disabled/unused - may be used in future
 */

import type { FC } from 'react';
import { Button } from '@/components/ui/button';
import { Globe, BookOpen, Layers } from 'lucide-react';
import type { QuizSource } from '@/adapters';

export interface SourceFilterOption {
  value: QuizSource;
  label: string;
  icon: typeof Globe;
}

export const SOURCE_FILTER_OPTIONS: SourceFilterOption[] = [
  { value: 'all', label: 'All Sources', icon: Layers },
  { value: 'opentdb', label: 'OpenTDB', icon: Globe },
  { value: 'custom', label: 'Custom', icon: BookOpen },
];

interface SourceFilterProps {
  activeSource: QuizSource;
  onSourceChange: (source: QuizSource) => void;
  openTDBCount?: number;
  customCount?: number;
  isLoading?: boolean;
}

export const SourceFilter: FC<SourceFilterProps> = ({
  activeSource,
  onSourceChange,
  openTDBCount = 0,
  customCount = 0,
  isLoading = false,
}) => {
  return (
    <div className="flex flex-wrap gap-2">
      {SOURCE_FILTER_OPTIONS.map((filter) => {
        const Icon = filter.icon;
        const isActive = activeSource === filter.value;

        return (
          <Button
            key={filter.value}
            variant={isActive ? 'default' : 'outline'}
            size="sm"
            onClick={() => onSourceChange(filter.value)}
            className="gap-2"
          >
            <Icon className="h-4 w-4" />
            {filter.label}
            {filter.value === 'opentdb' && !isLoading && (
              <span className="ml-1 px-1.5 py-0.5 text-xs rounded-full bg-primary-foreground/20">
                {openTDBCount}
              </span>
            )}
            {filter.value === 'custom' && !isLoading && (
              <span className="ml-1 px-1.5 py-0.5 text-xs rounded-full bg-primary-foreground/20">
                {customCount}
              </span>
            )}
          </Button>
        );
      })}
    </div>
  );
};
