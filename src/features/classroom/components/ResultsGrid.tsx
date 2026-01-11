/**
 * ResultsGrid Component
 * Displays student quiz results in a grid format
 * Rows: Students, Columns: Quizzes, Cells: Scores
 */

import type { FC } from 'react';
import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2 } from 'lucide-react';
import { useClassroomResults, transformToGridData } from '../hooks/useClassroomResults';

interface ResultsGridProps {
  classroomId: string;
  classroomName?: string;
}

const getScoreColor = (score: number): string => {
  if (score >= 90) return 'bg-green-100 text-green-800 border-green-200';
  if (score >= 75) return 'bg-blue-100 text-blue-800 border-blue-200';
  if (score >= 60) return 'bg-yellow-100 text-yellow-800 border-yellow-200';
  return 'bg-red-100 text-red-800 border-red-200';
};

export const ResultsGrid: FC<ResultsGridProps> = ({ classroomId, classroomName }) => {
  const { data: results, isLoading } = useClassroomResults(classroomId);

  const gridData = useMemo(() => {
    if (!results) return null;
    return transformToGridData(results);
  }, [results]);

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  if (!gridData || gridData.students.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Results Grid</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <p>No results yet.</p>
            <p className="text-sm">Results will appear here once students complete quizzes.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">
          Results Grid {classroomName && `- ${classroomName}`}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="text-left p-2 border-b font-medium text-muted-foreground">
                  Student
                </th>
                {gridData.quizzes.map((quiz) => (
                  <th
                    key={quiz.id}
                    className="text-center p-2 border-b font-medium text-muted-foreground min-w-[100px]"
                  >
                    <span className="truncate block max-w-[120px]" title={quiz.title}>
                      {quiz.title}
                    </span>
                  </th>
                ))}
                <th className="text-center p-2 border-b font-medium text-muted-foreground">
                  Average
                </th>
              </tr>
            </thead>
            <tbody>
              {gridData.students.map((student) => {
                const studentResults = gridData.results[student.id] || {};
                const scores = Object.values(studentResults);
                const average =
                  scores.length > 0
                    ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
                    : null;

                return (
                  <tr key={student.id} className="hover:bg-muted/50">
                    <td className="p-2 border-b font-medium">{student.name}</td>
                    {gridData.quizzes.map((quiz) => {
                      const score = studentResults[quiz.id];
                      return (
                        <td key={quiz.id} className="text-center p-2 border-b">
                          {score !== undefined ? (
                            <Badge
                              variant="outline"
                              className={`${getScoreColor(score)} font-mono`}
                            >
                              {score}%
                            </Badge>
                          ) : (
                            <span className="text-muted-foreground text-sm">—</span>
                          )}
                        </td>
                      );
                    })}
                    <td className="text-center p-2 border-b">
                      {average !== null ? (
                        <Badge variant="secondary" className="font-mono">
                          {average}%
                        </Badge>
                      ) : (
                        <span className="text-muted-foreground text-sm">—</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};
