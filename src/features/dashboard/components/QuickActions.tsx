import { useCallback, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { BookOpen, ClipboardList } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const QuickActions = () => {
  const navigate = useNavigate();
  const [testCode, setTestCode] = useState('');

  const handleBrowseQuizzes = useCallback(() => {
    navigate('/quizzes');
  }, [navigate]);

  const handleJoinTest = useCallback(() => {
    if (testCode.trim().length === 6) {
      // TODO: Implement join test logic
      console.log('Joining test with code:', testCode);
      alert(`Joining test: ${testCode}`);
      setTestCode('');
    }
  }, [testCode]);

  const handleCodeChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 6);
    setTestCode(value);
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Browse Quizzes */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Ready to learn?</h4>
          <Button
            onClick={handleBrowseQuizzes}
            className="w-full"
            size="lg"
          >
            <BookOpen className="h-4 w-4 mr-2" />
            Browse All Quizzes
          </Button>
        </div>

        {/* Divider */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">or</span>
          </div>
        </div>

        {/* Join Test */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Join a test</h4>
          <div className="flex gap-2">
            <Input
              placeholder="Enter 6-digit code"
              value={testCode}
              onChange={handleCodeChange}
              maxLength={6}
              className="flex-1 font-mono text-center text-lg tracking-wider"
            />
            <Button
              onClick={handleJoinTest}
              disabled={testCode.length !== 6}
              size="lg"
            >
              <ClipboardList className="h-4 w-4 mr-2" />
              Join
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Enter the code shared by your teacher
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
