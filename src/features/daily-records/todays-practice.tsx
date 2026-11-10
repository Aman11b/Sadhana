"use client";

import { Flower2 } from "lucide-react";
import { useState } from "react";

export default function TodaysPractice() {
  const [hasRecordedPractice, setHasRecordedPractice] = useState(true);
  return (
    <section className="bg-plum p-6 sm:p-8 rounded-2xl text-surface">
      {/* header */}
      <div className="flex sm:flex-row flex-col sm:justify-between sm:items-center gap-3">
        <div>
          <p className="flex items-center gap-2 mb-2 font-medium text-md text-saffron tracking-widest">
            <Flower2 size={17} />
            DAILY PRACTICE
          </p>
          <h2 className="font-bold text-2xl sm:text-3xl">
            Today&apos;s Sadhana
          </h2>
          <p className="mt-2 text-surface/70 text-sm">
            Your practice for todays, all in one place.
          </p>
        </div>
        <div className="sm:text-right">
          <p className="text-saffron text-sm">Sunday, 8 November 2026</p>
          <p className="mt-2 text-surface/60 text-xs">
            Tithi and Paksha information
          </p>
        </div>
      </div>
      {/* practice content */}
      <div className="mt-7 pt-7 border-surface/20 border-t">
        {hasRecordedPractice ? (
          <>
            <div className="items-stretch gap-4 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
              {/* mantras */}
              <div className="flex flex-col bg-ivory p-5 rounded-xl text-plum">
                <p className="font-medium text-muted text-xs tracking-widest">
                  MANTRA PRACTICE
                </p>
                <h3 className="mt-3 font-bold text-3xl">Shiv mantra</h3>
                <div className="mt-auto pt-5">
                  <p className="font-bold text-3xl">3 Malas</p>
                  <p className="mt-1 text-muted text-sm">324 times japa</p>
                </div>
              </div>

              {/* stotra */}
              <div className="flex flex-col bg-cream p-5 rounded-xl h-full text-plum">
                <p className="font-semibold text-muted text-xs tracking-widest">
                  STOTRA PRACTICE
                </p>
                <h3 className="mt-3 font-bold text-3xl">
                  Kaal Bhairav Astakam
                </h3>
                <div className="mt-auto pt-5">
                  <p className="font-bold text-3xl">2 times</p>
                  <p className="mt-1 text-muted text-sm">
                    Complete recitations
                  </p>
                </div>
              </div>

              {/* add another practice */}
              <button
                type="button"
                className="flex flex-col justify-center items-center md:col-span-2 xl:col-span-1 bg-ivory/20 hover:bg-surface/10 p-5 border-2 border-ivory border-dashed rounded-xl h-full min-h-48 text-center transition-colors"
              >
                <span className="flex justify-center items-center bg-teal border border-ivory rounded-full w-11 h-11 text-cream text-2xl">
                  +
                </span>
                <span className="mt-3 font-semibold text-ivory">
                  Add Another practice
                </span>
                <span className="mt-5 text-surface/70 text-sm">
                  Add a mantra or stotra
                </span>
              </button>
            </div>

            <p className="mt-5 text-surface/70 text-sm">
              Your practice for today has been recorded.
            </p>
          </>
        ) : (
          <div className="py-8 text-center">
            <p className="font-medium text-surface">
              Your practice hasn&apos;t been recorded yet
            </p>
            <p className="mt-2 text-surface/60 text-sm">
              Begin by recording your mantra or stotra practice
            </p>
            <button
              type="button"
              className="bg-devi hover:bg-devi/90 mt-5 px-5 py-2.5 rounded-lg font-medium text-white text-sm transition-colors"
            >
              Record Today&apos;s Practice
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
