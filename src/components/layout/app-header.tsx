import Link from "next/link";
import AppNavigation from "./app-navigation";

export default function AppHeader() {
  return (
    <>
      <header className="top-5 left-1/2 z-50 fixed bg-surface shadow-lg px-6 py-4 border border-border rounded-2xl w-[calc(100%-3rem)] max-w-7xl -translate-x-1/2">
        <div className="flex justify-center mb-1">
          <span className="font-medium text-gold text-sm tracking-widest">
            ॥ ॐ भैरवाय नमः ॥
          </span>
        </div>
        <div className="flex justify-between items-center">
          <Link href="/" className="font-bold text-bhairava text-xl">
            <span className="text-devi">ॐ </span>Sadhana
          </Link>
          <AppNavigation />
          <div className="flex items-center gap-3">
            <div className="bg-devi border border-border rounded-full w-7 h-7 overflow-hidden"></div>
            <span className="font-medium text-bhairava text-sm">Aman</span>
          </div>
        </div>
      </header>
      <div aria-hidden="true" className="h-32" />
    </>
  );
}
