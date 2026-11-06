import Link from "next/link";
import AppNavigation from "./app-navigation";

export default function AppHeader() {
  return (
    <header className="flex justify-between items-center bg-surface shadow-lg px-6 py-5 border-border border-b rounded-b-sm">
      <Link href="/" className="font-bold text-bhairava text-xl">
        <span className="text-devi">ॐ </span>Sadhana
      </Link>
      <AppNavigation />
      <div className="flex items-center gap-3">
        <div className="bg-devi border border-border rounded-full w-7 h-7 overflow-hidden"></div>
        <span className="font-medium text-bhairava text-sm">Aman</span>
      </div>
    </header>
  );
}
