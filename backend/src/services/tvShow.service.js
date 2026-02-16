// services/tvShows.service.js
// ✅ Supports 2 modes on ONE route (/tv-shows)
// 1) Single/Filter mode (default):  GET /tv-shows?type=on_the_air|popular|airing_today|top_rated
// 2) Mixed infinite rail (sequential): GET /tv-shows?mode=mixed&order=on_the_air,airing_today,popular&cursor=...&pageSize=20

// import { tmdbUrlCreat } from "../lib/tmdbClient.js"; 
import { enrichTvWithOmdb } from "../utils/enRichTvSeriesOmdb.js";
import { tmdbUrlCreat } from "../utils/tmdbUrlCreate.js";

// <-- use your existing axios creator

// ✅ Allowed TMDB TV list types for single endpoint
const SINGLE_ALLOWED = new Set([
  "on_the_air",
  "airing_today",
  "popular",
  "top_rated",
]);

// ✅ Allowed types for mixed rail (you said only these 3)
const RAIL_ALLOWED = new Set(["on_the_air", "airing_today", "popular"]);

/** ========== helpers ========== */

// single mode validation + default
function normalizeType(type) {
  const t = String(type || "on_the_air").trim();
  if (!SINGLE_ALLOWED.has(t)) {
    throw new Error(
      `Invalid type "${t}". Allowed: on_the_air, airing_today, popular, top_rated`,
    );
  }
  return t;
}

// rail order parsing + validation + default
function parseOrder(orderStr) {
  const list = String(orderStr || "on_the_air,airing_today,popular")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  const safe = list.length ? list : ["on_the_air", "airing_today", "popular"];

  for (const t of safe) {
    if (!RAIL_ALLOWED.has(t)) {
      throw new Error(
        `Invalid order type "${t}". Allowed: on_the_air, airing_today, popular`,
      );
    }
  }

  return safe;
}

// encode cursor object -> base64url string
function encodeCursor(obj) {
  return Buffer.from(JSON.stringify(obj), "utf8").toString("base64url");
}

// decode cursor string -> object (safe fallback)
function decodeCursor(cursor) {
  if (!cursor) return { bucketIndex: 0, page: 1 };

  try {
    const json = Buffer.from(String(cursor), "base64url").toString("utf8");
    const obj = JSON.parse(json);

    return {
      bucketIndex: Number(obj.bucketIndex) || 0,
      page: Number(obj.page) || 1,
    };
  } catch {
    return { bucketIndex: 0, page: 1 };
  }
}

// clamp pageSize (company standard safety)
function clampPageSize( {pageSize, enrichOmdb = false}) {
  const n = Number(pageSize);
  if (Number.isNaN(n) || !Number.isFinite(n)) return 20;
  return Math.max(1, Math.min(n, 50));
}

/** ========== Mode A: SINGLE/FILTER LIST ========== */
async function fetchSingleList({ type, page = 1 ,  enrichOmdb = false}) {
  const client = tmdbUrlCreat();
  const res = await client.get(`/tv/${type}`, { params: { page } });

  const raw = res?.data;
  let results = raw?.results ?? [];

  if (enrichOmdb) {
    results = await enrichTvWithOmdb(results); // ✅ returns enriched array
  }

  return {
    data: results,
    meta: {
      mode: "single",
      type,
      page,
      returned: results.length,
      tmdb_total_pages: raw?.total_pages ?? null,
      fetched_at: new Date().toISOString(),
      enriched: enrichOmdb,
    },
  };
}

/** ========== Mode B: MIXED INFINITE RAIL (SEQUENTIAL BUCKETS) ========== */
/**
 * Sequential behavior:
 * - start from order[0] page=1
 * - keep filling items until pageSize reached
 * - if current type has more pages -> go next page
 * - else move to next type, page=1
 * - nextCursor tells where to continue
 */
async function fetchMixedRail({ order, cursor, pageSize, enrichOmdb = false }) {
  const client = tmdbUrlCreat();
  const types = parseOrder(order);

  let { bucketIndex, page } = decodeCursor(cursor);
  let items = [];

  // Safety to prevent infinite loops if TMDB returns weird data
  let loops = 0;

  while (items.length < pageSize && bucketIndex < types.length && loops < 20) {
    loops += 1;

    const type = types[bucketIndex];
    const res = await client.get(`/tv/${type}`, { params: { page } });

    const raw = res?.data;
    const results = raw?.results ?? [];
    const totalPages = Number(raw?.total_pages) || 1;

    // add bucket tag for frontend divider/label if needed
    for (const it of results) {
      items.push({ ...it, _bucket: type });
      if (items.length >= pageSize) break;
    }

    // move cursor forward
    if (results.length === 0) {
      // if empty, jump to next bucket to avoid stuck
      bucketIndex += 1;
      page = 1;
      continue;
    }

    if (page < totalPages) {
      page += 1; // next page in same bucket
    } else {
      bucketIndex += 1; // next bucket
      page = 1;
    }
  }

  if (enrichOmdb) {
    items = await enrichTvWithOmdb(items);
  }


  const nextCursor =
    bucketIndex >= types.length ? null : encodeCursor({ bucketIndex, page });

  return {
    items,
    nextCursor,
    meta: {
      mode: "mixed",
      order: types,
      returned: items.length,
      fetched_at: new Date().toISOString(),
      enriched: enrichOmdb,
    },
  };
}

/** ========== PUBLIC SERVICE (called by controller) ========== */
export async function getTvShowServiceInfo({
  type,
  mode,
  cursor,
  pageSize,
  order,
  enrichOmdb = false
} = {}) {
  const effectiveMode = String(mode || "single").trim();

  // ✅ Mixed mode
  if (effectiveMode === "mixed") {
    const size = clampPageSize(pageSize);
    return await fetchMixedRail({
      order,
      cursor,
      pageSize: size,
      enrichOmdb
    });
  }

  // ✅ Single/Filter mode (default)
  const t = normalizeType(type);
  return await fetchSingleList({ type: t, page: 1, enrichOmdb });
}
