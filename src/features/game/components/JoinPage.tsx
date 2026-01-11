import { useState, useCallback, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Play, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { joinQuiz } from '@/adapters';

/**
 * JoinPage Component
 * Allows students to join a quiz session using a unique quiz_key
 * 
 * Flow:
 * 1. Student enters quiz_key (e.g., "V8QLAP") or receives it via URL (?code=V8QLAP)
 * 2. POST /quiz/join with { quizKey: "V8QLAP" }
 * 3. Backend returns full quiz with questions
 * 4. Navigate to game with quiz data in state
 */
export const JoinPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [quizCode, setQuizCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Join quiz with a given code
  const joinWithCode = useCallback(async (code: string) => {
    const trimmedCode = code.trim().toUpperCase();
    
    if (!trimmedCode || trimmedCode.length < 4) {
      setError('Quiz code must be at least 4 characters');
      return;
    }

    setError('');
    setLoading(true);

    try {
      // Call the backend API to join quiz with quiz_key
      const result = await joinQuiz(trimmedCode);
      
      if (!result.success || !result.data) {
        throw new Error(result.error || 'Invalid quiz code');
      }

      // Navigate to play page with the quiz data
      navigate(`/quiz/${result.data.id}/play`, {
        state: { quiz: result.data, quizKey: trimmedCode }
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Invalid quiz code. Please check and try again.';
      setError(message);
      setLoading(false);
    }
  }, [navigate]);

  // Auto-join if code is provided via URL query parameter
  useEffect(() => {
    const codeFromUrl = searchParams.get('code');
    if (codeFromUrl) {
      const sanitizedCode = codeFromUrl.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
      setQuizCode(sanitizedCode);
      // Auto-join if code is valid length
      if (sanitizedCode.length >= 4) {
        joinWithCode(sanitizedCode);
      }
    }
  }, [searchParams, joinWithCode]);

  const handleJoin = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    joinWithCode(quizCode);
  }, [quizCode, joinWithCode]);

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
