"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight, Play } from "lucide-react";
import { MovieItem } from "@/app/lib/data/ShowcaseList";


type Props = {
    items: MovieItem[];
    hideRating?: boolean;
};

const getRatingStyle = (rating: number) => {
    const r = Number(rating) || 0;



    if (r >= 8) {
        return "bg-orange-400 text-white";
    }
    if (r >= 7) {
        return "bg-purple-500 text-white";
    }
    return "bg-yellow-400 text-black";
};

export default function MovieRail({ items, hideRating = false }: Props) {
    const railRef = useRef<HTMLDivElement | null>(null);

    const scrollBy = (dx: number) => {
        railRef.current?.scrollBy({ left: dx, behavior: "smooth" });
    };

    return (
        <div className="relative mt-6 w-full">

            {/* Left/Right arrows (desktop) */}

            <button
                onClick={() => scrollBy(-520)}
                className="hidden lg:flex absolute left-0 top-1/2 z-10 -translate-y-1/2 rounded bg-white/60 p-2 hover:bg-white/80"
                aria-label="Scroll left"
            >
                <ChevronLeft className="text-black" />
            </button>

            <button
                onClick={() => scrollBy(520)}
                className="hidden lg:flex absolute right-0 top-1/2 z-10 -translate-y-1/2 rounded bg-white/60 p-2 hover:bg-white/80"
                aria-label="Scroll right"
            >
                <ChevronRight className="text-black" />
            </button>

            {/* Rail */}
            <div
                ref={railRef}
                className=" no-scrollbar flex gap-6 overflow-x-auto scroll-smooth   px-6 py-6"

            >
                {items.map((m) => (
                    <div key={m.id} className="shrink-0">
                        <div className="relative h-[360px] w-[260px] overflow-hidden rounded-lg bg-gray-200 shadow-lg group">
                            <img
                                src={m.poster}
                                alt={m.title}
                                className="h-full w-full object-cover"
                            />
                            {/* dark overlay  */}
                            <div className="absolute inset-0 bg-black/30 opacity-0 transition group-hover:opacity-100" />


                            {/* blue play button (top-right) */}
                            <button

                                className="absolute left-1/2 top-1/2 
                 -translate-x-1/2 -translate-y-1/2
               inline-flex h-12 w-12 items-center justify-center
               rounded-full bg-blue-500 text-white
               opacity-0 scale-90
               transition-all duration-300
               group-hover:opacity-100 group-hover:scale-100
                  hover:bg-blue-700"
                                aria-label="Play trailer"
                            >
                                <Play className="text-white" size={18} />
                            </button>

                            {/* Event badge bottom-right (optional) */}

                            {/* <div
                                className={`absolute bottom-3 right-3
              flex h-10 w-10 items-center justify-center
              rounded-full text-sm font-bold
              shadow-lg
              ${getRatingStyle(m.rating)}`}
                            >
                               {Number(m.rating).toFixed(1)}
                            </div> */}

                            {!hideRating && (
                                <div
                                    className={`absolute bottom-3 right-3
            flex h-10 w-10 items-center justify-center
            rounded-full text-sm font-bold
            shadow-lg
            ${getRatingStyle(m.rating)}`}
                                >
                                    {Number(m.rating).toFixed(1)}
                                </div>
                            )}
                        </div>

                        <p className="mt-3 max-w-[260px] text-lg font-semibold text-black">
                            {m.title}
                        </p>
                    </div>
                ))}
            </div>

        </div>
    );
}
