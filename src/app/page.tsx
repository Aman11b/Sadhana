import DashboardHeading from "@/features/dashboard/dashboard-heading";
import TodaysPractice from "@/features/daily-records/todays-practice";
import OngoingAnuthans from "@/features/anushthans/ongoing-anushthans";
import { OrnamentalDivider } from "@/components/icons/sadhana-icons";

export default function Home() {
  return (
    <main className="flex flex-col gap-8 mx-auto px-4 sm:px-6 py-8 lg:py-12 w-full max-w-7xl">
      <DashboardHeading />
      <TodaysPractice />
      <OrnamentalDivider
        size={160}
        color="#B7955D"
        strokeWidth={0.7}
        className="self-center opacity-70 w-full shrink-0"
        aria-hidden="true"
      />
      <OngoingAnuthans />
    </main>
  );
}
