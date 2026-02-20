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

  //tab api selectors
  const trendingState = useAppSelector((s) => s.trending);
  const trendingSereies = useAppSelector((state) => state.topSeries);
  const trendingCoomingMoviesView = useAppSelector((state) => state.commingsoon);
  const trendingShowView = useAppSelector((state) => state.tvShow);
  const combined = useAppSelector((s) => s.combinedTrending);

  useEffect(() => {
    if (activeTab !== "soon") return;

    dispatch(getSeriesThunk());

  }, [activeTab, dispatch]);


  useEffect(() => {
    if (activeTab !== "event") return;

    dispatch(getShowThunk());
  }, [activeTab, dispatch]);

  useEffect(() => {
    if (activeTab !== 'commingSoon') return;
    dispatch(getCommingSoonMoviesThunk())
  }, [activeTab, dispatch])


  //   helper - reset when tab changes
  const resetFeed = () => {
    setFeed([]);
    // setWindowMode("day");
    setCursor(null);
    setHasMore(true);
    setIsLoadingMore(false);
  };

  const trendingItems = trendingState.items;
  const nextCursorFromRedux = trendingState.cursor;
  const hasMoreFromRedux = trendingState.hasMore;
  const isReduxLoading = trendingState.loading;

  useEffect(() => {
    if (activeTab !== "now") return;
    resetFeed();
    setWindowMode("");      
    setSelectedRating("");  
    dispatch(getTrendingMovies({ pageSize: 6, cursor: null }));
  }, [activeTab, dispatch]);


  useEffect(() => {
    if (activeTab !== "now") return;
    if (!trendingItems || trendingItems.length === 0) return;

    setFeed(trendingItems);
    setCursor(nextCursorFromRedux ?? null);
    setHasMore(hasMoreFromRedux ?? true);

  }, [trendingItems, nextCursorFromRedux, hasMoreFromRedux, activeTab]);

  const loadMore = async () => {
    if (activeTab !== "now") return;
    if (isLoadingMore) return;
    if (!hasMore) return;

    setIsLoadingMore(true);
    try {
      const nextPageSize = feed.length < 6 ? 6 : 20;

      const action: any = await dispatch(
        getTrendingMovies({
          pageSize: nextPageSize,
          cursor, 
        })
      );

    } finally {
      setIsLoadingMore(false);
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
  }, [activeTab, windowMode, cursor, hasMore, isLoadingMore, feed.length]);



  const rawList = useMemo(() => {
    if (selectedRating) return combined.items ?? [];

    if (activeTab === "now") return feed ?? [];
    if (activeTab === "soon") return trendingSereies.results ?? [];
    if (activeTab === "event") return trendingShowView.result ?? [];
    if (activeTab === "commingSoon") return trendingCoomingMoviesView.data ?? [];
    return [];
  }, [activeTab, feed, trendingSereies.results, trendingShowView.result, trendingShowView.result]);





  //  map API -> MovieRail items format

  const items = useMemo(() => {
    const mapped = rawList
      .map((m: any) => {
        const img = m.poster_path || m.backdrop_path;

        const imdb = m.imdb_rating != null ? Number(m.imdb_rating) : null;
        const fallback = m.vote_average != null ? Number(m.vote_average) : 0;

        
        const date = m.date ?? m.release_date ?? m.first_air_date ?? null;

        return {
          id: String(m.id),
          title: m.title || m.name || "Untitled",
          poster: img ? `${TMDB_IMG_780}${img}` : "",
          rating: imdb != null && Number.isFinite(imdb) ? imdb : fallback, // 0–10
          date,
        };
      })
      .filter((x: any) => !!x.poster);

   
    const dateFiltered = mapped.filter((x: any) => isWithinWindow(x.date, windowMode));

    // console.log("WindowMode:", windowMode, "Mapped:", mapped.length, "DateFiltered:", dateFiltered.length);

  
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



 
  useEffect(() => {
   
    console.table(
      items.map((x: any) => ({
        title: x.title,
        rating: x.rating,
        date: x.date,
      }))
    );
  }, [windowMode, items]);


  // combine api call 
  useEffect(() => {
   
    if (selectedRating) {
      dispatch(getTrendingCombinedThunk());
    }
  }, [selectedRating, dispatch]);

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
