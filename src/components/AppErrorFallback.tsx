import { Button } from '@/components/ui/button';

export function AppErrorFallback() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 px-6 text-center">
      <h1 className="text-2xl font-semibold tracking-tight">Something went wrong</h1>
      <p className="max-w-sm text-sm text-muted-foreground">
        An unexpected error stopped this page. Reload to try again.
      </p>
      <Button type="button" onClick={() => window.location.reload()}>
        Reload
      </Button>
    </main>
  );
}
