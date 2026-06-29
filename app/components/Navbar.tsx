"use client";

import Link from "next/link";
import { useState } from "react";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/core", label: "Core Agent" },
  { href: "/research", label: "Benchmarking" },
  { href: "/product", label: "Product Matrix" },
  { href: "/pricing", label: "Pricing Simulator" },
  { href: "/marketing", label: "Marketing Engine" },
  { href: "/chat", label: "Chat Assistant" },
  { href: "/dashboard", label: "Data Hub" },
  { href: "/docs", label: "Technical Docs" },
  { href: "/demo", label: "Final Demo" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="relative border-b border-zinc-800 bg-black px-6 py-4">
      <div className="mx-auto flex max-w-6xl items-center justify-between">
        <Link
          href="/"
          className="text-sm font-semibold text-white hover:text-zinc-300 transition-colors"
        >
          Week 0 Builder
        </Link>

        {/* Desktop nav */}
        <ul className="hidden flex-wrap items-center gap-x-5 gap-y-2 text-sm lg:flex">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <Link href={link.href} className="text-zinc-400 hover:text-white transition-colors">
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Mobile menu toggle */}
        <button
          onClick={() => setIsOpen((prev) => !prev)}
          aria-expanded={isOpen}
          aria-label="Toggle navigation menu"
          className="inline-flex items-center justify-center rounded-md border border-zinc-700 px-3 py-1.5 text-sm text-zinc-300 transition-colors hover:border-zinc-500 hover:text-white lg:hidden"
        >
          {isOpen ? "✕ Close" : "☰ Menu"}
        </button>
      </div>

      {/* Mobile dropdown */}
      {isOpen && (
        <div className="mx-auto mt-3 grid max-w-6xl grid-cols-2 gap-2 rounded-lg border border-zinc-800 bg-zinc-950 p-3 sm:grid-cols-3 lg:hidden">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className="rounded-md px-3 py-2 text-sm text-zinc-300 transition-colors hover:bg-zinc-900 hover:text-white"
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
