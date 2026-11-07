"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import LibraryDropdown from "./library-dropdown";

export default function AppNavigation() {
  const pathname = usePathname();

  const getLinkClass = (isActive: boolean) =>
    `nav-link ${isActive ? "nav-link-active" : ""}`;
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
