import Link from "next/link";
import AppNavigation from "./app-navigation";
import MobileNavigation from "./mobile-navigation";

export default function AppHeader() {
  return (
    <>
      {/* desktop invocation */}
      <div className="hidden nav:flex justify-center my-2 mt-3">
        <span className="font-medium text-gold text-lg tracking-widest">
          ॥ ॐ भैरवाय नमः ॥
        </span>
      </div>
      {/* responsive header */}
      <header className="nav:top-12 z-[110] nav:z-50 nav:fixed flex justify-between items-center bg-surface shadow-sm nav:shadow-lg px-4 sm:px-6 py-4 nav:border nav:border-border nav:rounded-2xl w-full nav:w-[calc(100%-2rem)] nav:max-w-7xl">
        <Link href="/" className="font-bold text-bhairava text-xl">
          <span className="text-devi">ॐ </span>Sadhana
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
      <div aria-hidden="true" className="hidden nav:h-24" />
    </>
  );
}
