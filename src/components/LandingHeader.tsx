import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';

const links = [
  { label: 'How it works', target: 'how' },
  { label: 'For class', target: 'class' },
];

export function LandingHeader() {
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-50 border-b bg-background/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4">
        <a href="#top" className="flex items-center gap-2 font-display text-xl font-bold">
          <span className="flex gap-1" aria-hidden>
            <i className="h-3 w-3 rounded-sm bg-play-red" />
            <i className="h-3 w-3 rounded-sm bg-play-blue" />
            <i className="h-3 w-3 rounded-sm bg-play-yellow" />
            <i className="h-3 w-3 rounded-sm bg-play-green" />
          </span>
          Kahoot.uz
        </a>
        <nav className="hidden items-center gap-5 md:flex">
          {links.map((link) => (
            <a key={link.target} href={`#${link.target}`} className="text-sm text-muted-foreground hover:text-foreground">
              {link.label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          {user ? (
            <Button asChild><Link to="/dashboard">Open class</Link></Button>
          ) : (
            <>
              <Button asChild variant="ghost"><Link to="/login">Sign in</Link></Button>
              <Button asChild><Link to="/register/teacher">For teachers</Link></Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
