import DashboardHeading from "@/features/dashboard/components/dashboard-heading";
import TodaysPractice from "@/features/dashboard/components/todays-practice";

export default function Home() {
  return (
    <main className="flex flex-col gap-8 mx-auto px-4 sm:px-6 py-8 lg:py-12 w-full max-w-7xl">
      <DashboardHeading />
      <TodaysPractice />
    </main>
  );
}
