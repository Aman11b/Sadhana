import Link from "next/link";
export default function DashboardHeading() {
  return (
    <section className="flex sm:flex-row flex-col sm:justify-between sm:items-end gap-3">
      <div>
        <p className="mb-2 font-medium text-gold text-sm tracking-widest">
          ॥ शुभम् ॥
        </p>
        <h1 className="font-bold text-bhairava text-3xl sm:text-4xl tracking-tight">
          Return to your practice.
        </h1>
        <p className="mt-2 text-muted">
          A quiet record of your discipline, one day at time.
        </p>
      </div>
      <Link href="/calendar">View Calendar</Link>
    </section>
  );
}
