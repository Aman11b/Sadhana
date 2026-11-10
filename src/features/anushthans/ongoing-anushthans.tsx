import { SectionLotus } from "@/components/icons/sadhana-icons";
import {
  mockAnushthan,
  mockDailyAnushthanRecords,
} from "./data/mock-anushthan";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import OngoingAnushthanCard from "./ongoing-anushthan-card";

export default function OngoingAnushthans() {
  const anushthan = mockAnushthan;

  // record for this anuthan
  const records = mockDailyAnushthanRecords.filter(
    (record) => record.anushthanId === anushthan.id,
  );

  // calculate completed count from daily records
  const completedMalas = records.reduce(
    (total, record) => total + record.mantraMalas,
    0,
  );

  const completedRecitations = records.reduce(
    (total, record) => total + record.stotraRecitations,
    0,
  );

  return (
    <section className="flex flex-col gap-5">
      {/* section heading */}
      <div className="flex justify-between items-center gap-4">
        <div className="flex items-center gap-2">
          <SectionLotus
            size={30}
            color="#B7955D"
            strokeWidth={2.9}
            aria-hidden="true"
          />
          <h2 className="font-lora font-semibold text-bhairava text-xl">
            Ongoing Anushthans
          </h2>
        </div>
        <Link
          href="/anushthans"
          className="group flex items-center gap-1 hover:text-devi transition-colors duration-200"
        >
          View Anushthans
          <ChevronRight className="transition-transform group-hover:translate-x-1 duration-200" />
        </Link>
      </div>
      <div className="gap-6 grid grid-cols-1 md:grid-cols-2">
        {/* card will be rendered here */}
        {anushthan.mantra && (
          <OngoingAnushthanCard
            type="mantra"
            name={anushthan.mantra.name}
            target={anushthan.mantra.targetMalas}
            completed={completedMalas}
            startDate={anushthan.startDate}
            durationDays={anushthan.durationDays}
          />
        )}

        {anushthan.stotra && (
          <OngoingAnushthanCard
            type="stotra"
            name={anushthan.stotra.name}
            target={anushthan.stotra.targetRecitations}
            completed={completedRecitations}
            startDate={anushthan.startDate}
            durationDays={anushthan.durationDays}
          />
        )}

        {!anushthan.mantra && !anushthan.stotra && (
          <p className="text-muted text-sm">
            No practices have been added to this Anushthan.
          </p>
        )}
      </div>
    </section>
  );
}
