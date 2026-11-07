"use client";
import {
  CalendarDays,
  Flame,
  LayoutDashboard,
  NotebookPen,
  Settings,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import LibraryDropdown from "./library-dropdown";

export default function AppNavigation() {
  const pathname = usePathname();

  const getLinkClass = (isActive: boolean) =>
    `nav-link flex items-center gap-2 ${isActive ? "nav-link-active" : ""}`;
  return (
    <nav aria-label="main navigation">
      <ul className="flex items-center gap-6">
        <li className="">
          <Link href="/" className={`${getLinkClass(pathname === "/")} `}>
            <LayoutDashboard size={16} strokeWidth={1.8} />
            Dashboard
          </Link>
        </li>
        <li>
          <Link
            href="/daily"
            className={`${getLinkClass(pathname === "/daily")} `}
          >
            <NotebookPen size={16} strokeWidth={1.8} />
            Daily Record
          </Link>
        </li>
        <li>
          <Link
            href="/calendar"
            className={`${getLinkClass(pathname === "/calendar")} `}
          >
            <CalendarDays size={16} strokeWidth={1.8} />
            Calendar
          </Link>
        </li>
        <li>
          <LibraryDropdown />
        </li>
        <li>
          <Link
            href="/anushthans"
            className={`${getLinkClass(pathname === "/anushthans")} `}
          >
            <Flame size={16} strokeWidth={1.8} />
            Anushthan
          </Link>
        </li>
        <li>
          <Link
            href="/settings"
            className={`${getLinkClass(pathname === "/settings")} `}
          >
            <Settings size={16} strokeWidth={1.8} />
            Settings
          </Link>
        </li>
      </ul>
    </nav>
  );
}
