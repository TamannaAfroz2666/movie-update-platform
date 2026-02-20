import axios from "axios";

function toNum(x) {
  const n = Number(x);
  return Number.isFinite(n) ? n : null;
}

function pickDate(it) {
  return it?.release_date || it?.first_air_date || it?.date || null;
}

function isWithinLast7Days(dateStr) {
  if (!dateStr) return false;
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return false;

  const now = new Date();
  const startToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startItem = new Date(d.getFullYear(), d.getMonth(), d.getDate());

  const diffDays = Math.floor(
    (startToday.getTime() - startItem.getTime()) / 86400000
  );
  return diffDays >= 0 && diffDays <= 7;
}

//  score: prefer OMDb imdb_rating, fallback TMDB vote_average, fallback 0
function score(item) {
  const imdb = toNum(item.imdb_rating);
  if (imdb != null && imdb > 0) return imdb;

  const vote = toNum(item.vote_average);
  if (vote != null && vote > 0) return vote;

  return 0;
}

export async function getWeeklyTop5({ appUrl }) {
  const moviesUrl = `${appUrl}/api/trending/movies/feed?enrich=omdb&pageSize=50`;
  const tvUrl = `${appUrl}/api/tv-shows?enrich=omdb&type=popular`;

  console.log("MOVIES URL =", moviesUrl);
  console.log("TV URL =", tvUrl);

  const [moviesRes, tvRes] = await Promise.all([
    axios.get(moviesUrl),
    axios.get(tvUrl),
  ]);

  console.log("moviesRes keys =", Object.keys(moviesRes.data || {}));
  console.log("tvRes keys =", Object.keys(tvRes.data || {}));

  //  FIXED shapes
  const movieItems = moviesRes.data?.items ?? [];
  const tvItems =
    tvRes.data?.result?.data ?? tvRes.data?.data ?? tvRes.data?.items ?? [];

  console.log(" movieItems length =", movieItems.length);
  console.log(" tvItems length =", tvItems.length);
  console.log("movie sample =", movieItems[0]);
  console.log("tv sample =", tvItems[0]);

  //  normalize
  const combined = [
    ...movieItems.map((m) => ({
      kind: "movie",
      id: String(m.id),
      title: m.title || m.name || "Untitled",
      poster_path: m.poster_path || m.backdrop_path || null,
      overview: m.overview || null,
      release_date: m.release_date || null,
      first_air_date: null,
      imdb_rating: m.imdb_rating ?? null,
      vote_average: m.vote_average ?? null,
      date: pickDate(m),
    })),
    ...tvItems.map((t) => ({
      kind: "tv",
      id: String(t.id),
      title: t.name || t.title || "Untitled",
      poster_path: t.poster_path || t.backdrop_path || null,
      overview: t.overview || null,
      release_date: null,
      first_air_date: t.first_air_date || null,
      imdb_rating: t.imdb_rating ?? null,
      vote_average: t.vote_average ?? null,
      date: pickDate(t),
    })),
  ];

  console.log("combined length =", combined.length);

  //  last 7 days
  const recent = combined.filter((x) => isWithinLast7Days(x.date));
  console.log("recent length (last7days) =", recent.length);
  console.log("recent sample =", recent[0]);

  const validImdbCount = recent.filter((x) => {
    const imdb = toNum(x.imdb_rating);
    return imdb != null && imdb > 0;
  }).length;

  console.log(" valid imdb count =", validImdbCount);
  console.log(" invalid imdb count =", recent.length - validImdbCount);

  
  recent.sort((a, b) => score(b) - score(a));

 
  const top5 = recent.slice(0, 5);

  console.log(" top5 length =", top5.length);
  console.log(
    " top5 titles =",
    top5.map(
      (x) =>
        `${x.title} (imdb=${x.imdb_rating}, vote=${x.vote_average}, score=${score(
          x
        )})`
    )
  );
  console.log(" top5 sample =", top5[0]);

  return top5;
}
