"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import ShowtimeTabsBar from "./ShowTimeTabsBar";
import MovieRail from "./MovieRail";

import { dayWeeklySelection, imdbRatings, TabKey } from "@/app/lib/data/ShowcaseList";
import { getTrendingMovies } from "@/app/services/trending.reducer";
import { useAppDispatch, useAppSelector } from "@/app/store/hooks";
import { getSeriesThunk } from "@/app/services/Thunk/topSeries.thunk";
import { useSelector } from "react-redux";
import { getCommingSoonMoviesThunk } from "@/app/services/Thunk/commingSoon.thunk";
import { getShowThunk } from "@/app/services/Thunk/trendingShow.thunk";
import { getTrendingCombinedThunk } from "@/app/services/Thunk/combineApi.thunk";
import { isWithinWindow } from "@/app/utils/dateFilter";

const TMDB_IMG_780 = "https://image.tmdb.org/t/p/w780";

export default function ShowcaseNowShowing() {
  
 const dispatch = useAppDispatch();
const [activeTab, setActiveTab] = useState<TabKey>("now");
const [selectedRating, setSelectedRating] = useState(imdbRatings[0]?.value || "");
const [feed, setFeed] = useState<any[]>([]);
const [windowMode, setWindowMode] = useState<"" | "day" | "week">("");
const [cursor, setCursor] = useState<string | null>(null);
const [isLoadingMore, setIsLoadingMore] = useState(false);
const [hasMore, setHasMore] = useState(true);
const sentinelRef = useRef<HTMLDivElement | null>(null);

// tab api selectors
const trendingState = useAppSelector((s) => s.trending);
const trendingSereies = useAppSelector((state) => state.topSeries);
const trendingCoomingMoviesView = useAppSelector((state) => state.commingsoon);
const trendingShowView = useAppSelector((state) => state.tvShow);
const combined = useAppSelector((s) => s.combinedTrending);

const trendingItems = trendingState.items;
const nextCursorFromRedux = trendingState.cursor;
const hasMoreFromRedux = trendingState.hasMore;

// ----------------------------
//  ADDED: refs for stable guard (prevents spam calls)
// ----------------------------
const cursorRef = useRef<string | null>(null);
const hasMoreRef = useRef(true);
const isLoadingMoreRef = useRef(false);

// keep refs synced with state
useEffect(() => { cursorRef.current = cursor; }, [cursor]);
useEffect(() => { hasMoreRef.current = hasMore; }, [hasMore]);
useEffect(() => { isLoadingMoreRef.current = isLoadingMore; }, [isLoadingMore]);

// ----------------------------
// ADDED: per-tab fetched guard (first time only)
// ----------------------------
const fetchedRef = useRef({
  now: false,
  soon: false,
  event: false,
  commingSoon: false,
  combined: false,
});

// helper - reset when tab changes
const resetFeed = () => {
  setFeed([]);
  setCursor(null);
  setHasMore(true);
  setIsLoadingMore(false);

  //  ADDED: also reset refs so loadMore doesn’t use stale values
  cursorRef.current = null;
  hasMoreRef.current = true;
  isLoadingMoreRef.current = false;
};

// ----------------------------
//  Tab fetch (only first time)
// ----------------------------
useEffect(() => {
  if (activeTab !== "soon") return;
  if (fetchedRef.current.soon) return;           
  fetchedRef.current.soon = true;               
  dispatch(getSeriesThunk());
}, [activeTab, dispatch]);

useEffect(() => {
  if (activeTab !== "event") return;
  if (fetchedRef.current.event) return;         
  fetchedRef.current.event = true;              
  dispatch(getShowThunk());
}, [activeTab, dispatch]);

useEffect(() => {
  if (activeTab !== "commingSoon") return;
  if (fetchedRef.current.commingSoon) return;   
  fetchedRef.current.commingSoon = true;        
  dispatch(getCommingSoonMoviesThunk());
}, [activeTab, dispatch]);

// ----------------------------
//  NOW tab initial fetch (only first time on NOW tab)
// ----------------------------
useEffect(() => {
  if (activeTab !== "now") return;

  resetFeed();
  setWindowMode("");
  setSelectedRating("");

  //  ADDED: only first time call
  if (fetchedRef.current.now) return;
  fetchedRef.current.now = true;

  dispatch(getTrendingMovies({ pageSize: 6, cursor: null }));
}, [activeTab, dispatch]);

// redux -> local feed sync
useEffect(() => {
  if (activeTab !== "now") return;
  if (!trendingItems || trendingItems.length === 0) return;

  setFeed(trendingItems);
  setCursor(nextCursorFromRedux ?? null);
  setHasMore(hasMoreFromRedux ?? true);
}, [trendingItems, nextCursorFromRedux, hasMoreFromRedux, activeTab]);

// ----------------------------
//  UPDATED loadMore: use refs (no stale state + no spam)
// ----------------------------
const loadMore = async () => {
  if (activeTab !== "now") return;
  if (isLoadingMoreRef.current) return;   
  if (!hasMoreRef.current) return;       

  setIsLoadingMore(true);
  isLoadingMoreRef.current = true;

  try {
    const nextPageSize = feed.length < 6 ? 6 : 20;

    await dispatch(
      getTrendingMovies({
        pageSize: nextPageSize,
        cursor: cursorRef.current,       
      })
    );
  } finally {
    setIsLoadingMore(false);
    isLoadingMoreRef.current = false;
  }
};


useEffect(() => {
  if (activeTab !== "now") return;
  if (!sentinelRef.current) return;

  const el = sentinelRef.current;

  const obs = new IntersectionObserver(
    (entries) => {
      const first = entries[0];
      if (first?.isIntersecting) {
        loadMore();
      }
    },
    {
      root: null,
      rootMargin: "300px",
      threshold: 0,
    }
  );

  obs.observe(el);
  return () => obs.disconnect();

  //  REMOVED deps: windowMode, cursor, hasMore, isLoadingMore, feed.length
}, [activeTab]); //  ONLY activeTab

// ----------------------------
//  rawList memo deps FIX
// ----------------------------
const rawList = useMemo(() => {
  if (selectedRating) return combined.items ?? [];

  if (activeTab === "now") return feed ?? [];
  if (activeTab === "soon") return trendingSereies.results ?? [];
  if (activeTab === "event") return trendingShowView.result ?? [];
  if (activeTab === "commingSoon") return trendingCoomingMoviesView.data ?? [];
  return [];
}, [
  activeTab,
  feed,
  selectedRating,
  combined.items,
  trendingSereies.results,
  trendingShowView.result,
  trendingCoomingMoviesView.data,
]);

// ----------------------------
// Combined call: only first time when rating becomes non-empty
// ----------------------------
useEffect(() => {
  if (!selectedRating) return;
  if (fetchedRef.current.combined) return;  
  fetchedRef.current.combined = true;       
  dispatch(getTrendingCombinedThunk());
}, [selectedRating, dispatch]);


const items = useMemo(() => {
  const mapped = (rawList ?? [])
    .map((m: any) => {
      const img = m.poster_path || m.backdrop_path;

      const imdb = m.imdb_rating != null ? Number(m.imdb_rating) : null;
      const fallback = m.vote_average != null ? Number(m.vote_average) : 0;

      const date = m.date ?? m.release_date ?? m.first_air_date ?? null;

      return {
        id: String(m.id),
        title: m.title || m.name || "Untitled",
        poster: img ? `${TMDB_IMG_780}${img}` : "",
        rating: imdb != null && Number.isFinite(imdb) ? imdb : fallback,
        date,
      };
    })
    .filter((x: any) => !!x.poster);

  const dateFiltered = mapped.filter((x: any) => isWithinWindow(x.date, windowMode));

  if (!selectedRating) return dateFiltered;

  return dateFiltered.filter((x: any) => {
    const r = Number(x.rating ?? 0);
    if (selectedRating === "8_9") return r >= 8 && r < 9;
    if (selectedRating === "7_8") return r >= 7 && r < 8;
    if (selectedRating === "6_7") return r >= 6 && r < 7;
    if (selectedRating === "5_6") return r >= 5 && r < 6;
    if (selectedRating === "lt_5") return r < 5;
    return true;
  });
}, [rawList, selectedRating, windowMode]); 

  return (
    <section className="w-full bg-white py-10">
      <div className="mx-auto w-full w-[90%] px-4">
        <ShowtimeTabsBar
          activeTab={activeTab}
          onTabChange={setActiveTab}
          imdbRatings={imdbRatings}
          dayWeeklySelection={dayWeeklySelection}

          selectedRating={selectedRating}
          onRatingChange={setSelectedRating}

          selectedWeekAndDay={windowMode}
          onWeekAndDayChange={(v) => setWindowMode(v as "" | "day" | "week")}

        />

        <MovieRail items={items}  hideRating={activeTab === "commingSoon"} />

        {/*  sentinel for infinite scroll */}

        {activeTab === "now" && <div ref={sentinelRef} className="h-10" />}



      </div>
    </section>
  );
}
