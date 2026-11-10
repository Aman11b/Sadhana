import {
  MantraAnushthanYantra,
  MantraMandala,
} from "@/components/icons/sadhana-icons";
import { CalendarDays, Minus } from "lucide-react";
import type { OngoingAnushthanCardProps } from "./types/anushthan.types";

export default function OngoingAnushthanCard({
  type,
  name,
  target,
  completed,
  startDate,
  durationDays,
}: OngoingAnushthanCardProps) {
  // calculate progress percentage
  const progress =
    target > 0 ? Math.max(0, Math.min((completed / target) * 100, 100)) : 0;

  const endDate = new Date(`${startDate}T00:00:00.000Z`);
  endDate.setUTCDate(endDate.getUTCDate() + durationDays - 1);

  const dateFormatter = new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });

  const formattedStartDate = dateFormatter.format(
    new Date(`${startDate}T00:00:00.000Z`),
  );

  const formattedEndDate = dateFormatter.format(endDate);

  const unit = type === "mantra" ? "malas" : "recitations";
  const title = type === "mantra" ? "Mantra Anushthan" : "Stotra Anushthan";

  const accentColor = type === "mantra" ? "bg-purple-700" : "bg-amber-600";
  const accentColorText =
    type === "mantra" ? "text-purple-700" : "text-amber-600";

  return (
    <article className="relative bg-surface p-5 sm:p-6 border border-border rounded-2xl overflow-hidden">
      {type === "mantra" ? (
        <MantraAnushthanYantra
          size={150}
          color="#76519A"
          strokeWidth={0.6}
          className="-top-8 -right-8 absolute opacity-20"
          aria-hidden="true"
        />
      ) : (
        <MantraMandala
          size={150}
          color="#B78032"
          strokeWidth={0.7}
          className="-top-8 -right-8 absolute opacity-25"
          aria-hidden="true"
        />
      )}
      {/* card heading */}
      <div className="mb-5">
        <span className="font-semibold text-bhairava text-xs uppercase tracking-wider">
          {title}
        </span>
        <h3 className="mt-2 font-lora font-semibold text-devi text-xl">
          {name}
        </h3>
      </div>
      {/* progress info */}
      <div className="flex justify-between items-baseline gap-3 mb-3">
        <p className="font-lora font-semibold text-bhairava text-2xl">
          {completed}
          <span className="ml-1 font-normal text-muted text-base">
            /{target} {unit}
          </span>
        </p>
        <span className="font-semibold text-muted text-sm">
          {progress.toFixed(1).replace(/\.0$/, "")}%
        </span>
      </div>
      {/* progress bar */}
      <div
        className="bg-cream rounded-full h-2 overflow-hidden"
        role="progressbar"
        aria-label={`${title} progress`}
        aria-valuenow={Math.max(0, Math.min(completed, target))}
        aria-valuemin={0}
        aria-valuemax={target}
      >
        <div
          className={`h-full rounded-full transition-all duration-300 ${accentColor}`}
          style={{ width: `${progress}%` }}
        />
      </div>
      {/* anusthan dates */}
      <div className="flex items-center gap-2 mt-5 text-muted text-sm">
        <CalendarDays size={16} className={`${accentColorText}`} />
        <span className="flex items-center gap-2">
          {formattedStartDate}
          <Minus size={18} />
          {formattedEndDate}
        </span>
      </div>
    </article>
  );
}
