import { LandingHeader } from '@/components/LandingHeader';
import { JoinKeyForm } from '@/features/play';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const steps = [
  { title: 'Write the questions', body: 'A teacher builds a quiz and gets a 6-character key.' },
  { title: 'Put the key on the board', body: 'Students type it. No accounts to hand out in the room.' },
  { title: 'Play, then see who missed what', body: 'The timer and the score come from the server. The review shows the answer.' },
];

export function LandingPage() {
  return (
    <div id="top" className="min-h-screen">
      <LandingHeader />
      <main className="mx-auto max-w-5xl px-4">
        <section className="grid items-center gap-10 py-16 md:grid-cols-2 md:py-24">
          <div className="space-y-5">
            <p className="text-sm font-semibold uppercase tracking-wide text-primary">For the next lesson</p>
            <h1 className="text-5xl font-bold leading-tight md:text-6xl">The class starts when someone types the key.</h1>
            <p className="max-w-md text-lg text-muted-foreground">
              Kahoot.uz is a quiz you can run from a projector. Teachers write it. Students join in one step.
            </p>
            <div className="flex gap-3">
              <Button asChild><Link to="/register/teacher">Create a quiz</Link></Button>
              <Button asChild variant="outline"><Link to="/register">I’m a student</Link></Button>
            </div>
          </div>
          <div className="rounded-3xl bg-card p-6 shadow-sm">
            <p className="mb-1 text-sm font-semibold">Have a key?</p>
            <p className="mb-4 text-sm text-muted-foreground">Six characters from your teacher.</p>
            <JoinKeyForm requireAuth buttonLabel="Join the quiz" />
            <div className="mt-5 grid grid-cols-4 gap-2" aria-hidden>
              <div className="h-10 rounded-lg bg-play-red" />
              <div className="h-10 rounded-lg bg-play-blue" />
              <div className="h-10 rounded-lg bg-play-yellow" />
              <div className="h-10 rounded-lg bg-play-green" />
            </div>
          </div>
        </section>

        <section id="how" className="grid gap-4 py-10 md:grid-cols-3">
          {steps.map((step, index) => (
            <article key={step.title} className="rounded-2xl bg-card p-5">
              <p className="text-sm font-semibold text-primary">0{index + 1}</p>
              <h2 className="mt-2 text-xl font-bold">{step.title}</h2>
              <p className="mt-2 text-muted-foreground">{step.body}</p>
            </article>
          ))}
        </section>

        <section id="class" className="grid gap-4 py-10 md:grid-cols-2">
          <article className="rounded-3xl bg-foreground p-6 text-background">
            <h2 className="text-2xl font-bold">Teachers</h2>
            <p className="mt-2 text-background/80">Make a quiz, copy the key, and see who struggled after class.</p>
            <Button asChild className="mt-5" variant="secondary"><Link to="/register/teacher">Start as a teacher</Link></Button>
          </article>
          <article className="rounded-3xl border p-6">
            <h2 className="text-2xl font-bold">Students</h2>
            <p className="mt-2 text-muted-foreground">Join with a key, or pick a category and practice on your own.</p>
            <Button asChild className="mt-5" variant="outline"><Link to="/register">Start as a student</Link></Button>
          </article>
        </section>
      </main>
    </div>
  );
}
