"use client";
import { usePathname } from "next/navigation";
import DropdownPanel from "./dropdown-panel";
import { ChevronDown } from "lucide-react";

export default function LibraryDropdown() {
  const pathname = usePathname();
  const isActive = pathname === "/mantras" || pathname === "/strotras";

  return (
    <div className="group relative">
      <button
        type="button"
        className={`flex items-center  gap-1 transition-colors duration-200 ${
          isActive ? "font-bold text-devi" : "text-muted hover:text-devi"
        }`}
        aria-haspopup="true"
      >
        Library
        <ChevronDown
          size={16}
          strokeWidth={1.8}
          className="group-hover:rotate-180 transition-transform duration-300 shrink-0"
        />
      </button>
      <div className="invisible group-hover:visible top-full left-0 z-50 absolute opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0 duration-500">
        <DropdownPanel />
      </div>
    </div>
  );
}
