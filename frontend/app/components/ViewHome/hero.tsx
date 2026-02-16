"use client";

import Link from "next/link";
import { Play, ChevronLeft, ChevronRight } from "lucide-react";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import { useMemo, useState } from "react";
import TrailerModal from "../common/TrailerModal";
import Image from "next/image";
import { useGetMovieListQuery } from "@/app/services/movieApi";

// TMDB image base urls
const TMDB_IMG_1280 = "https://image.tmdb.org/t/p/w1280";
const TMDB_IMG_780 = "https://image.tmdb.org/t/p/w780";

// helper: runtime -> "2h 15m"
function formatRuntime(runtime?: number | null) {
  if (!runtime || runtime <= 0) return "N/A";
  const h = Math.floor(runtime / 60);
  const m = runtime % 60;
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}

export default function HeroCaroselView() {
  // ✅ API
  const { data, isLoading, isError } = useGetMovieListQuery();

  // ✅ results array (tomar response: data.data.results)
  const dataStore = useMemo(() => {
    return data?.data?.results ?? [];
  }, [data]);

  // ✅ active slide index based on API (NOT dummy)
  const [activeIndex, setActiveIndex] = useState(0);
  const activeMovie = dataStore?.[activeIndex];

  // trailer modal
  const [trailerOpen, setTrailerOpen] = useState(false);
  const [trailerUrl, setTrailerUrl] = useState<string | null>(null);

  function openTrailer(url?: string) {
    if (!url) return;
    setTrailerUrl(url);
    setTrailerOpen(true);
  }

  // ✅ basic UI states
  if (isLoading) {
    return (
      <div className="h-[617px] overflow-hidden rounded-xl bg-black/40 shadow-[0_10px_35px_rgba(0,0,0,0.35)]" />
    );
  }

  if (isError) {
    return (
      <div className="rounded-xl bg-black/40 p-6 text-white">
        Failed to load movies
      </div>
    );
  }

  if (!dataStore.length) {
    return (
      <div className="rounded-xl bg-black/40 p-6 text-white">
        No movies found
      </div>
    );
  }



  const viewData = (dataStore ?? [])
  // 1) keep only items with valid release_date
  .filter((item: any) => item?.release_date && !isNaN(Date.parse(item.release_date)))
  // 2) newest first
  .sort((a: any, b: any) => {
    return new Date(b.release_date).getTime() - new Date(a.release_date).getTime();
  })
  // 3) map for what you need
  .map((item: any) => (item));


  return (
    <>
      <TrailerModal
        open={trailerOpen}
        trailerUrl={trailerUrl}
        onClose={() => setTrailerOpen(false)}
      />

      <section className="relative w-full">
        <div className="md:px-6">
          <div className="overflow-hidden rounded-xl bg-black/40 shadow-[0_10px_35px_rgba(0,0,0,0.35)]">
            {/* HERO IMAGE SLIDER */}
            <div className="relative">
              <Swiper
                modules={[Navigation, Pagination, Autoplay]}
                slidesPerView={1}
                // ✅ loop only if enough items
                loop={dataStore.length > 3}
                autoplay={{ delay: 4500, disableOnInteraction: false }}
                navigation={{
                  nextEl: ".hero-next",
                  prevEl: ".hero-prev",
                }}
                pagination={{
                  clickable: true,
                  el: ".hero-dots",
                }}
                className="relative"
                onSlideChange={(swiper) => {
                  setActiveIndex(swiper.realIndex);
                }}
              >
                {/* ✅ API slides */}
                {dataStore
                  // ✅ correct filter (backdrop OR poster)
                  .filter((s: any) => s?.backdrop_path || s?.poster_path)
                  .map((s: any) => {
                    // ✅ prefer backdrop for hero, fallback to poster
                    const imageUrl = s?.backdrop_path
                      ? `${TMDB_IMG_1280}${s.backdrop_path}`
                      : `${TMDB_IMG_780}${s.poster_path}`;

                    return (
                      <SwiperSlide key={s.id}>
                        <div className="relative h-[617px] sm:h-[320px] md:h-[617px]">
                          <Image
                            src={dataStore .backdrop_path}
                            alt={s.title || s.original_title || "movie"}
                            fill
                            className="object-cover"
                            priority
                            sizes="(max-width: 768px) 100vw, 100vw"
                          />

                          {/* gradient overlay */}
                          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-black/20" />

                          {/* arrows */}
                          <button
                            className="hero-prev absolute left-2 top-1/2 z-20 -translate-y-1/2 rounded bg-white/50 p-2 hover:bg-white/70"
                            aria-label="Previous slide"
                          >
                            <ChevronLeft className="text-black" />
                          </button>

                          <button
                            className="hero-next absolute right-2 top-1/2 z-20 -translate-y-1/2 rounded bg-white/50 p-2 hover:bg-white/70"
                            aria-label="Next slide"
                          >
                            <ChevronRight className="text-black" />
                          </button>
                        </div>
                      </SwiperSlide>
                    );
                  })}
              </Swiper>

              {/* Dots row */}
              <div className="absolute bottom-3 left-1/2 z-30 -translate-x-1/2">
                <div className="hero-dots flex items-center gap-2" />
              </div>
            </div>

            {/* BOTTOM PURPLE INFO BAR */}
            <div className="flex flex-col gap-3 bg-gradient-to-r from-[#3f5f75] via-[#466175] to-[#4b6b80] px-4 py-6 text-white sm:flex-row sm:items-center sm:justify-between">
              {/* Left info */}
              <div>
                <p className="text-xl opacity-90">
                  {/* ✅ meta: release + rating + duration */}
                  {activeMovie?.release_date
                    ? `Release: ${activeMovie.release_date}`
                    : "Release: —"}
                  {"  "}•{"  "}
                  {typeof activeMovie?.vote_average === "number"
                    ? `⭐ ${activeMovie.vote_average.toFixed(1)}`
                    : "⭐ —"}
                  {"  "}•{"  "}
                  {/* ⚠️ runtime নেই list এ, তাই N/A দেখাবে */}
                  Duration: {formatRuntime(activeMovie?.runtime)}
                </p>

                <h2 className="text-[32px] font-extrabold text-white">
                  {/* ✅ movie title */}
                  {activeMovie?.title ||
                    activeMovie?.original_title ||
                    "Untitled"}
                </h2>
              </div>

              {/* Right actions */}
              <div className="flex items-center gap-3">
                <button
                  // ⚠️ trailerUrl API te nai hole এই button click e কিছু হবে না
                  onClick={() => openTrailer(activeMovie?.trailerUrl)}
                  className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-white/60 bg-transparent hover:bg-white/10"
                  aria-label="Play trailer"
                >
                  <Play className="text-white" />
                </button>

                {/* ✅ details link dynamic */}
                <Link
                  href={activeMovie?.id ? `/movie/${activeMovie.id}` : "#"}
                  className="inline-flex uppercase items-center justify-center rounded-full border border-white/70 bg-white/10 px-6 py-3 text-sm font-semibold tracking-wide hover:bg-white/20"
                >
                  DETAILS
                </Link>

                <button
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/70 bg-white/10 hover:bg-white/20"
                  aria-label="Favorite"
                >
                  ✦
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Swiper pagination dot styling */}
        <style jsx global>{`
          .hero-dots .swiper-pagination-bullet {
            width: 10px;
            height: 10px;
            opacity: 0.55;
            background: rgba(255, 255, 255, 0.25);
            border: 2px solid rgba(255, 255, 255, 0.35);
          }
          .hero-dots .swiper-pagination-bullet-active {
            opacity: 1;
            background: #b44cff;
            border-color: rgba(255, 255, 255, 0.7);
          }
        `}</style>
      </section>
    </>
  );
}
