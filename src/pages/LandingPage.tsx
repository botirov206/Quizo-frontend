import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export const LandingPage = () => {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6">
      <div className="max-w-2xl text-center space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">EduQuiz</h1>
        <p className="text-gray-600">A feature-first educational gamification platform. Read the PRD and dive in.</p>
        <div className="flex items-center justify-center gap-3">
          <Button asChild>
            <Link to="/login">Get Started</Link>
          </Button>
          <Button variant="secondary" asChild>
            <a href="/eduquiz_final_prd.md" target="_blank" rel="noreferrer">View PRD</a>
          </Button>
        </div>
      </div>
    </div>
  );
};
