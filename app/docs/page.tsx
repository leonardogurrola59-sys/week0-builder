import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Docs — Week 0 Builder Setup",
  description: "Project purpose, tech stack, architecture, and goals for Week 0 Builder Setup.",
};

const techStack = [
  { name: "Next.js", desc: "App Router for file-system routing and server components." },
  { name: "TypeScript", desc: "End-to-end type safety across the entire codebase." },
  { name: "Tailwind CSS", desc: "Utility-first styling with zero runtime overhead." },
  { name: "Node.js", desc: "JavaScript runtime for local tooling and scripts." },
];

const goals = [
  "Establish a reproducible local dev environment from scratch.",
  "Understand the project structure before writing any features.",
  "Document decisions early so future weeks have a clear baseline.",
  "Keep the setup minimal — no premature abstractions.",
];

const futureWeeks = [
  { week: "Week 1", title: "Authentication", desc: "Add user sign-up, login, and session management." },
  { week: "Week 2", title: "Data Layer", desc: "Integrate a database and define the core data models." },
  { week: "Week 3", title: "Core Features", desc: "Build the primary user-facing functionality." },
  { week: "Week 4", title: "Polish & Deploy", desc: "Performance, accessibility, and production deployment." },
];

export default function DocsPage() {
  return (
    <main className="mx-auto w-full max-w-2xl px-6 py-20">
      <Link
        href="/"
        className="text-sm text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors"
      >
        ← Back
      </Link>

      <h1 className="mt-6 text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
        Documentation
      </h1>

      {/* Purpose */}
      <section className="mt-10">
        <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
          <strong className="text-zinc-900 dark:text-zinc-100">Week 0 Builder Setup</strong> is the
          foundation sprint — the work that happens before any features ship. The goal is a clean,
          documented, fully working local environment so that every subsequent week starts with
          confidence rather than configuration debt.
        </p>
      </section>

      <Divider />

      {/* Tech Stack */}
      <Section title="Tech Stack">
        <ul className="mt-4 space-y-4">
          {techStack.map(({ name, desc }) => (
            <li key={name} className="flex gap-4">
              <span className="w-28 shrink-0 font-medium text-zinc-900 dark:text-zinc-100">
                {name}
              </span>
              <span className="text-zinc-500 dark:text-zinc-400">{desc}</span>
            </li>
          ))}
        </ul>
      </Section>

      <Divider />

      {/* Architecture */}
      <Section title="Architecture">
        <p className="mt-3 text-zinc-600 dark:text-zinc-400 leading-relaxed">
          The project uses the Next.js App Router. Every route is a folder inside{" "}
          <code className="rounded bg-zinc-100 px-1.5 py-0.5 text-sm font-mono text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200">
            app/
          </code>
          , with a{" "}
          <code className="rounded bg-zinc-100 px-1.5 py-0.5 text-sm font-mono text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200">
            page.tsx
          </code>{" "}
          as the entry point. Layouts wrap shared chrome. Components default to React Server
          Components — client boundaries are added only where interactivity requires it.
        </p>
        <pre className="mt-4 overflow-x-auto rounded-lg bg-zinc-100 p-4 text-sm font-mono text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
{`app/
├── layout.tsx       ← root layout + metadata
├── page.tsx         ← homepage (/)
└── docs/
    └── page.tsx     ← this page (/docs)`}
        </pre>
      </Section>

      <Divider />

      {/* Goals */}
      <Section title="Goals">
        <ul className="mt-4 space-y-2">
          {goals.map((goal) => (
            <li key={goal} className="flex gap-3 text-zinc-600 dark:text-zinc-400">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-zinc-400 dark:bg-zinc-500" />
              {goal}
            </li>
          ))}
        </ul>
      </Section>

      <Divider />

      {/* Future Weekly Pages */}
      <Section title="Future Weekly Pages">
        <ul className="mt-4 space-y-4">
          {futureWeeks.map(({ week, title, desc }) => (
            <li
              key={week}
              className="rounded-lg border border-zinc-200 px-4 py-3 dark:border-zinc-700"
            >
              <div className="flex items-baseline gap-2">
                <span className="text-xs font-medium uppercase tracking-wide text-zinc-400 dark:text-zinc-500">
                  {week}
                </span>
                <span className="font-medium text-zinc-900 dark:text-zinc-100">{title}</span>
              </div>
              <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">{desc}</p>
            </li>
          ))}
        </ul>
      </Section>
    </main>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">{title}</h2>
      {children}
    </section>
  );
}

function Divider() {
  return <hr className="my-10 border-zinc-200 dark:border-zinc-800" />;
}
