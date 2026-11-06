"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import LibraryDropdown from "./library-dropdown";

export default function AppNavigation() {
  const pathname = usePathname();

  const getLinkClass = (isActive: boolean) =>
    `relative py-2 transition-colors duration-200 ${
      isActive
        ? "text-devi text-lg font-bold after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:bg-devi"
        : "text-muted hover:text-devi"
    }`;
  return (
    <nav aria-label="main navigation">
      <ul className="flex items-center gap-6">
        <li>
          <Link href="/" className={getLinkClass(pathname === "/")}>
            Dashboard
          </Link>
        </li>
        <li>
          <Link href="/daily" className={getLinkClass(pathname === "/daily")}>
            Daily Record
          </Link>
        </li>
        <li>
          <Link
            href="/calendar"
            className={getLinkClass(pathname === "/calendar")}
          >
            Calendar
          </Link>
        </li>
        <li>
          <LibraryDropdown />
        </li>
        <li>
          <Link
            href="/anushthans"
            className={getLinkClass(pathname === "/anushthans")}
          >
            Anushthan
          </Link>
        </li>
        <li>
          <Link
            href="/settings"
            className={getLinkClass(pathname === "/settings")}
          >
            Settings
          </Link>
        </li>
      </ul>
    </nav>
  );
}
