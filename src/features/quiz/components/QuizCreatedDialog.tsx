import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { CheckCircle, Copy } from 'lucide-react';

interface QuizCreatedDialogProps {
  quizKey: string | null;
  onClose: () => void;
}

export const QuizCreatedDialog = ({ quizKey, onClose }: QuizCreatedDialogProps) => {
  const [copied, setCopied] = useState(false);

  const copyKey = () => {
    if (!quizKey) return;
    void navigator.clipboard.writeText(quizKey);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  };

  return (
    <AlertDialog open={quizKey !== null} onOpenChange={(open) => { if (!open) onClose(); }}>
      <AlertDialogContent className="sm:max-w-md">
        <AlertDialogHeader>
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
            <CheckCircle className="h-6 w-6 text-green-600" />
          </div>
          <AlertDialogTitle className="text-center">Quiz Created Successfully!</AlertDialogTitle>
          <AlertDialogDescription className="text-center">
            Your quiz has been created. Share the quiz key with your students so they can join.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="flex items-center justify-center gap-2 my-4">
          <div className="flex-1 rounded-lg bg-muted px-4 py-3 text-center">
            <p className="text-xs text-muted-foreground mb-1">Quiz Key</p>
            <p className="text-2xl font-bold tracking-widest">{quizKey}</p>
          </div>
          <Button type="button" variant="outline" size="icon" onClick={copyKey} className="h-12 w-12">
            <Copy className="h-4 w-4" />
          </Button>
        </div>

        {copied && <p className="text-sm text-green-600 text-center">Copied to clipboard!</p>}

        <AlertDialogFooter className="sm:justify-center">
          <AlertDialogAction className="w-full sm:w-auto">Go to Dashboard</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
