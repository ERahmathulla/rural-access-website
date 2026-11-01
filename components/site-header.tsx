"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRef, useState } from "react";

const NAV_ITEMS = [
  { href: "/", label: "Home" },
  { href: "/get-involved", label: "Events & Get Involved" },
] as const;

export function SiteHeader() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);

  function closeOnEscape(event: React.KeyboardEvent) {
    if (event.key === "Escape" && menuOpen) {
      setMenuOpen(false);
      menuButton.current?.focus();
    }
  }

  return (
    <header
      onKeyDown={closeOnEscape}
      className="sticky top-0 z-40 border-b border-amber/40 bg-cream"
    >
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-x-3 px-5 py-2 md:gap-x-6">
        <Link
          href="/"
          onClick={() => setMenuOpen(false)}
          className="flex items-center gap-2 no-underline md:gap-3"
        >
          <Image
            src="/rural-access-logo.png"
            alt="Rural ACCESS logo"
            width={56}
            height={56}
            className="logo-blend size-12 md:size-14"
          />
          <span className="font-heading text-xl font-semibold sm:text-2xl">
            Rural ACCESS
          </span>
        </Link>

        <button
          ref={menuButton}
          type="button"
          aria-expanded={menuOpen}
          aria-controls="main-menu"
          onClick={() => setMenuOpen((open) => !open)}
          className="btn btn-secondary min-h-11 px-4 md:hidden"
        >
          Menu
        </button>

        <nav
          id="main-menu"
          aria-label="Main"
          className={`${menuOpen ? "block" : "hidden"} w-full md:block md:w-auto`}
        >
          <ul className="flex flex-col pt-2 pb-3 md:flex-row md:gap-8 md:py-0">
            {NAV_ITEMS.map(({ href, label }) => (
              <li key={href}>
                <Link
                  href={href}
                  aria-current={pathname === href ? "page" : undefined}
                  onClick={() => setMenuOpen(false)}
                  className="block py-3 font-bold no-underline hover:underline aria-[current=page]:underline aria-[current=page]:decoration-gold aria-[current=page]:decoration-4 md:py-2"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
