import Link from "next/link";
import { ChevronRight } from "lucide-react";
export default function DashboardHeading() {
  return (
    <section>
      <div>
        <p className="mb-4 w-full font-hindi font-medium text-gold text-xl text-center tracking-widest">
          ॥ ॐ भैरवाय नमः ॥
        </p>
        <div className="flex sm:flex-row flex-col sm:justify-between sm:items-end gap-3">
          <div>
            <h1 className="font-bold text-bhairava text-3xl sm:text-4xl tracking-tight">
              Return to your practice.
            </h1>
            <p className="mt-2 text-muted">
              A quiet record of your discipline, one day at a time.
            </p>
          </div>
          <Link
            href="/calendar"
            className="group flex items-center gap-1 hover:text-devi transition-colors duration-200"
          >
            View Calendar
            <ChevronRight className="transition-transform group-hover:translate-x-1 duration-200" />
          </Link>
        </div>
      </div>
    </section>
  );
}
