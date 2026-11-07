import Link from "next/link";
export default function DropdownPanel() {
  return (
    <div className="top-full left-0 z-50 absolute bg-surface shadow-lg p-2 border border-border rounded-md min-w-fit">
      <ul className="flex flex-col items-center gap-1">
        <li>
          <Link href="/mantras" className="dropdown-link">
            Mantras
          </Link>
        </li>
        <li>
          <Link href="/stotras" className="dropdown-link">
            Strotras
          </Link>
        </li>
      </ul>
    </div>
  );
}
