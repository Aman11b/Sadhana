"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useState } from "react";

export default function MobileNavigation() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* hamburger / close button */}
      <button
        type="button"
        aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
        aria-expanded={isOpen}
        onClick={() => setIsOpen((open) => !open)}
        className={`nav:hidden relative z-[110] rounded-full transition-colors duration-200 p-2 ${
          isOpen
            ? "text-devi hover:bg-devi/20"
            : "text-bhairava hover:bg-bhairava/20"
        }`}
      >
        {isOpen ? (
          <X size={24} strokeWidth={1.8} />
        ) : (
          <Menu size={24} strokeWidth={1.8} />
        )}
      </button>
      {/* mobile navigation */}
      {isOpen && (
        <div className="z-[100] fixed inset-0 bg-bhairava/50">
          <aside
            className="flex flex-col bg-surface shadow-xl ml-auto px-6 py-[38] border-border border-l w-[85%] max-w-md h-dvh"
            onClick={(event) => event.stopPropagation()}
          >
            {/* drawer header */}
            <div className="flex justify-between items-center mb-5">
              <div className="text-center">
                <span className="font-hindi font-bold text-gold text-xl tracking-widest">
                  ॥ ॐ भैरवाय नमः ॥
                </span>
              </div>
            </div>

            {/* navigation links */}

            <nav
              aria-label="Mobile navbigation"
              className="flex-1 py-4 border-border border-t"
            >
              <ul className="flex flex-col gap-5">
                <li>
                  <Link
                    href="/"
                    onClick={() => setIsOpen(false)}
                    className="nav-link"
                  >
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link
                    href="/daily"
                    onClick={() => setIsOpen(false)}
                    className="nav-link"
                  >
                    Daily Record
                  </Link>
                </li>
                <li>
                  <Link
                    href="/calendar"
                    onClick={() => setIsOpen(false)}
                    className="nav-link"
                  >
                    Calendar
                  </Link>
                </li>
                <li>
                  <Link
                    href="/mantras"
                    onClick={() => setIsOpen(false)}
                    className="nav-link"
                  >
                    Mantras
                  </Link>
                </li>
                <li>
                  <Link
                    href="/stotras"
                    onClick={() => setIsOpen(false)}
                    className="nav-link"
                  >
                    Stotras
                  </Link>
                </li>
                <li>
                  <Link
                    href="/anushthans"
                    onClick={() => setIsOpen(false)}
                    className="nav-link"
                  >
                    Anushthan
                  </Link>
                </li>
                <li>
                  <Link
                    href="/settings"
                    onClick={() => setIsOpen(false)}
                    className="nav-link"
                  >
                    Settings
                  </Link>
                </li>
              </ul>
            </nav>

            {/* profile section */}
            <div className="pt-6 border-border border-t">
              <div className="flex items-center gap-4">
                <div className="bg-devi border border-border rounded-full w-8 h-8"></div>
                <div>
                  <p className="font-medium text-bhairava">Aman</p>
                  <p className="text-muted text-sm">Profile</p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      )}
    </>
  );
}
