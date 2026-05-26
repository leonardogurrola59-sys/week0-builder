import Link from "next/link";

export default function Home() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center px-6 py-24 text-center">
      <h1 className="text-4xl font-semibold tracking-tight text-zinc-900 sm:text-5xl dark:text-zinc-50">
        Week 0 Builder Setup
      </h1>
      <p className="mt-4 max-w-md text-lg leading-relaxed text-zinc-500 dark:text-zinc-400">
        Everything you need to go from zero to a working development environment.
        Get your tools, configs, and workflow ready before day one.
      </p>
      <Link
        href="/docs"
        className="mt-8 inline-flex items-center rounded-lg bg-zinc-900 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-zinc-700 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
      >
        View Docs
      </Link>
    </main>
  );
}
