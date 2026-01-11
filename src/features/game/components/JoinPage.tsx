import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Play, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

/**
 * JoinPage Component
 * Allows students to join a quiz session using a unique code
 * Clean, centered UI with minimal distractions
 */
export const JoinPage = () => {
  const navigate = useNavigate();
  const [quizCode, setQuizCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleJoin = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    const trimmedCode = quizCode.trim().toUpperCase();
    
    if (!trimmedCode) {
      setError('Please enter a quiz code');
      return;
    }

    if (trimmedCode.length < 4) {
      setError('Quiz code must be at least 4 characters');
      return;
    }

    setError('');
    setLoading(true);

    try {
      // TODO: Validate code with backend API
      // const quiz = await validateQuizCode(trimmedCode);
      
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      // For now, navigate to the quiz play page
      // In production, this would validate the code first
      navigate(`/quiz/${trimmedCode}/play`);
    } catch {
      setError('Invalid quiz code. Please check and try again.');
    } finally {
      setLoading(false);
    }
  }, [quizCode, navigate]);

  const handleCodeChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    // Only allow alphanumeric characters, auto-uppercase
    const value = e.target.value.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
    setQuizCode(value);
    if (error) setError('');
  }, [error]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="w-full max-w-md space-y-4 px-4">
        {/* Back to Dashboard Link */}
        <Link 
          to="/dashboard" 
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Dashboard
        </Link>

        <Card>
          <CardHeader className="text-center space-y-2">
            <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-2">
              <Play className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="text-2xl">Join a Quiz</CardTitle>
            <CardDescription>
              Enter the quiz code provided by your teacher to join the session
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleJoin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="quizCode">Quiz Code</Label>
                <Input
                  id="quizCode"
                  type="text"
                  placeholder="Enter code (e.g., ABC123)"
                  value={quizCode}
                  onChange={handleCodeChange}
                  maxLength={10}
                  className="text-center text-2xl font-mono tracking-widest uppercase h-14"
                  autoComplete="off"
                  autoFocus
                />
                {error && (
                  <p className="text-sm text-destructive text-center">{error}</p>
                )}
              </div>

              <Button 
                type="submit" 
                className="w-full h-12 text-lg"
                disabled={loading || !quizCode.trim()}
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-background mr-2" />
                    Joining...
                  </>
                ) : (
                  <>
                    <Play className="h-5 w-5 mr-2" />
                    Join Quiz
                  </>
                )}
              </Button>
            </form>

            <p className="text-center text-sm text-muted-foreground mt-6">
              Don't have a code?{' '}
              <Link to="/explore" className="text-primary hover:underline">
                Explore public quizzes
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
