import type { Control, FieldErrors, UseFormRegister } from 'react-hook-form';
import { Controller } from 'react-hook-form';
import type { CategoryItem } from '@/api/types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DIFFICULTY_OPTIONS } from '../constants';
import type { QuizFormValues } from '../types';

const selectClass =
  'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background';

interface QuizDetailsFieldsProps {
  register: UseFormRegister<QuizFormValues>;
  control: Control<QuizFormValues>;
  errors: FieldErrors<QuizFormValues>;
  categories: CategoryItem[];
  categoriesLoading: boolean;
  categoriesError?: string;
}

function FieldMessage({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="text-sm text-destructive mt-1">{message}</p>;
}

export const QuizDetailsFields = ({
  register,
  control,
  errors,
  categories,
  categoriesLoading,
  categoriesError,
}: QuizDetailsFieldsProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Quiz Details</CardTitle>
        <CardDescription>Basic information about your quiz</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="title">Title</Label>
          <Input id="title" {...register('title')} placeholder="e.g., JavaScript Fundamentals" />
          <FieldMessage message={errors.title?.message} />
        </div>

        <div>
          <Label htmlFor="description">Description</Label>
          <Input
            id="description"
            {...register('description')}
            placeholder="Brief description of the quiz content"
          />
          <FieldMessage message={errors.description?.message} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="categoryId">Category</Label>
            <select
              id="categoryId"
              className={selectClass}
              disabled={categoriesLoading || categories.length === 0}
              {...register('categoryId')}
            >
              <option value="">{categoriesLoading ? 'Loading categories...' : 'Select a category'}</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            <FieldMessage message={errors.categoryId?.message ?? categoriesError} />
          </div>

          <div>
            <Label htmlFor="difficulty">Difficulty</Label>
            <select id="difficulty" className={selectClass} {...register('difficulty')}>
              {DIFFICULTY_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <FieldMessage message={errors.difficulty?.message} />
          </div>

          <div>
            <Label htmlFor="timePerQuestion">Seconds per question</Label>
            <Input
              id="timePerQuestion"
              type="number"
              min={5}
              max={120}
              step={1}
              {...register('timePerQuestion', { valueAsNumber: true })}
            />
            <FieldMessage message={errors.timePerQuestion?.message} />
          </div>
        </div>

        <Controller
          name="isPublished"
          control={control}
          render={({ field }) => (
            <div className="flex items-center gap-3">
              <Switch id="isPublished" checked={field.value} onCheckedChange={field.onChange} />
              <Label htmlFor="isPublished">Published</Label>
            </div>
          )}
        />
      </CardContent>
    </Card>
  );
};
