import Link from "next/link";
import AppNavigation from "./app-navigation";
import MobileNavigation from "./mobile-navigation";

export default function AppHeader() {
  return (
    <>
      {/* desktop invocation */}

      {/* responsive header */}
      <header className="z-[110] nav:z-50 relative flex justify-between items-center bg-surface shadow-sm nav:shadow-lg px-4 sm:px-6 py-6 nav:border-border w-full">
        <Link href="/" className="font-bold text-bhairava text-xl">
          <span className="font-hindi text-devi">ॐ </span>Sadhana
        </Link>
        <div className="hidden nav:block">
          <AppNavigation />
        </div>
        <MobileNavigation />

        <div className="hidden nav:flex items-center gap-3">
          <div className="bg-devi border border-border rounded-full w-7 h-7 overflow-hidden"></div>
          <span className="font-medium text-bhairava text-sm">Aman</span>
        </div>
      </header>
    </>
  );
}
