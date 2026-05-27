import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="border-b border-zinc-800 bg-black px-6 py-4">
      <div className="mx-auto flex max-w-4xl items-center justify-between">
        <Link
          href="/"
          className="text-sm font-semibold text-white hover:text-zinc-300 transition-colors"
        >
          Week 0 Builder
        </Link>
        <ul className="flex items-center gap-6 text-sm">
          <li>
            <Link
              href="/docs"
              className="text-zinc-400 hover:text-white transition-colors"
            >
              Docs
            </Link>
          </li>
          <li>
            <Link
              href="/core"
              className="text-zinc-400 hover:text-white transition-colors"
            >
              Core Dashboard
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}
