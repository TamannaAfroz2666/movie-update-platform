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

const TMDB_IMG_1280 = "https://image.tmdb.org/t/p/w1280";
const TMDB_IMG_780 = "https://image.tmdb.org/t/p/w780";

function formatRuntime(runtime?: number | null) {
  if (!runtime || runtime <= 0) return "N/A";
  const h = Math.floor(runtime / 60);
  const m = runtime % 60;
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}

//   image builder function (UI clean thakbe)
function getTmdbImageUrl(movie: any) {
  if (movie?.backdrop_path) return `${TMDB_IMG_1280}${movie.backdrop_path}`;
  if (movie?.poster_path) return `${TMDB_IMG_780}${movie.poster_path}`;
  return "/photos/avatar.jpg"; // fallback local
}

export default function HeroCaroselView() {
  const { data, isLoading, isError } = useGetMovieListQuery();

 

  //  raw results
  const dataStore = useMemo(() => {
    return data?.items ?? [];
  }, [data]);

 console.log('check api data', dataStore);

  //  NEW: sorted + cleaned data (present year / newest first)
  const viewData = useMemo(() => {
    return (dataStore ?? [])
      // keep only valid release_date
      .filter((item: any) => item?.release_date && !isNaN(Date.parse(item.release_date)))
      // newest first
      .sort(
        (a: any, b: any) =>
          new Date(b.release_date).getTime() - new Date(a.release_date).getTime(),
      );
  }, [dataStore]);

  //  active slide from viewData
  const [activeIndex, setActiveIndex] = useState(0);
  const activeMovie = viewData?.[activeIndex];

  const [trailerOpen, setTrailerOpen] = useState(false);
  const [trailerUrl, setTrailerUrl] = useState<string | null>(null);

  function openTrailer(url?: string) {
    if (!url) return;
    setTrailerUrl(url);
    setTrailerOpen(true);
  }

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
  if (!viewData.length) {
    return (
      <div className="rounded-xl bg-black/40 p-6 text-white">
        No movies found
      </div>
    );
  }
  // console.log('data',viewData)
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
                loop={viewData.length > 3}
                autoplay={{ delay: 4500, disableOnInteraction: false }}
                navigation={{ nextEl: ".hero-next", prevEl: ".hero-prev" }}
                pagination={{ clickable: true, el: ".hero-dots" }}
                className="relative"
                onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
              >
                {/* ✅ UI clean: ONLY map */}
                {viewData.map((movie: any) => {
                  const imageUrl = getTmdbImageUrl(movie);

                  return (
                    <SwiperSlide key={movie.id}>
                      <div className="relative h-[617px] sm:h-[320px] md:h-[617px]">
                        <Image
                          src={imageUrl}
                          alt={movie.title || movie.original_title || "movie"}
                          fill
                          className="object-cover"
                          priority
                          sizes="(max-width: 768px) 100vw, 100vw"
                        />

                        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-black/20" />

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

              {/* Dots */}
              <div className="absolute bottom-3 left-1/2 z-30 -translate-x-1/2">
                <div className="hero-dots flex items-center gap-2" />
              </div>
            </div>

            {/* BOTTOM INFO BAR */}
            <div className="flex flex-col gap-3 bg-gradient-to-r from-[#3f5f75] via-[#466175] to-[#4b6b80] px-4 py-6 text-white sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xl opacity-90">
                  {activeMovie?.release_date
                    ? `Release: ${activeMovie.release_date}`
                    : "Release: —"}
                  {"  "}•{"  "}
                  {typeof activeMovie?.vote_average === "number"
                    ? `⭐ ${activeMovie.vote_average.toFixed(1)}`
                    : "⭐ —"}
                  {/* {"  "}•{"  "} */}
                  {/* Duration: {formatRuntime(activeMovie?.runtime)} */}
                </p>

                <h2 className="text-[32px] font-extrabold text-white">
                  {activeMovie?.title || activeMovie?.original_title || "Untitled"}
                </h2>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => openTrailer(activeMovie?.trailerUrl)}
                  className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-white/60 bg-transparent hover:bg-white/10"
                  aria-label="Play trailer"
                >
                  <Play className="text-white" />
                </button>

                <Link
                  href={activeMovie?.overview ? `/movie/${activeMovie.id}` : "#"}
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
