"use client";

import { ImdbRatingOption, TabKey } from "@/app/lib/data/ShowcaseList";

const tabs: { key: TabKey; label: string }[] = [
    { key: "now", label: "Movies" },
    { key: "soon", label: "Top Series" },
    { key: "event", label: "Tv Shows" },
    { key: "commingSoon", label: "Coming soon" },
];

type Props = {
    activeTab: TabKey;
    onTabChange: (k: TabKey) => void;
    imdbRatings: ImdbRatingOption[];
    dayWeeklySelection: ImdbRatingOption[];

    selectedRating: string;
  onRatingChange: (v: string) => void;

  selectedWeekAndDay: string;
  onWeekAndDayChange: (v: string) => void;

};

export default function ShowtimeTabsBar({
    activeTab,
    onTabChange,
    imdbRatings,
    dayWeeklySelection,

      selectedRating,
  onRatingChange,

  selectedWeekAndDay,
  onWeekAndDayChange,
}: Props) {
   

    return (
        <div className="w-full">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                {/* Tabs */}
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    {/* Title */}
                    <span className="text-2xl font-semibold text-emerald-700 sm:text-3xl">
                        Trending
                    </span>

                    {/* Pills */}
                    <div className="flex flex-wrap items-center gap-2">
                        {tabs.map((t) => {
                            const isActive = activeTab === t.key;

                            return (
                                <button
                                    key={t.key}
                                    onClick={() => onTabChange(t.key)}
                                    className={[
                                        "rounded-md px-3 py-2 text-sm font-semibold transition sm:px-4",
                                        "outline-none focus:outline-none focus-visible:outline-none",
                                        "focus:ring-0 focus-visible:ring-0",
                                        "[-webkit-tap-highlight-color:transparent]",
                                        isActive
                                            ? "bg-emerald-700 text-white shadow-sm"
                                            : "bg-white text-black border border-black/10 hover:bg-black/5",
                                    ].join(" ")}
                                >
                                    {t.label}
                                </button>
                            );
                        })}
                    </div>
                </div>


                {/* Location dropdown */}
                <div className="w-full md:w-[220px] lg:w-[340px]">
                    <div className="flex gap-3 ">
                        <select
                            value={selectedWeekAndDay}
                            onChange={(e) => onWeekAndDayChange(e.target.value)}
                            className="w-[140px] rounded-md border border-blue-500 bg-white px-4 py-3 text-sm font-semibold text-black/80 outline-none"
                        >
                            {dayWeeklySelection.map((items: any) => (
                                <option key={items.value} value={items.value} >
                                    {items.label}
                                </option>
                            ))}
                        </select>

                        <select
                            value={selectedRating}
                            onChange={(e) => onRatingChange(e.target.value)}
                            className="w-[200px] rounded-md border border-blue-500 bg-white px-4 py-3 text-sm font-semibold text-black/80 outline-none"
                        >
                            {imdbRatings.map((items: any) => (
                                <option key={items.value} value={items.value}>
                                    {items.label}
                                </option>
                            ))}
                        </select>
                    </div>

                </div>
            </div>
        </div>
    );
}
