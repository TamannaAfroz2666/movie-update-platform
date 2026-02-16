export const dummyMovies = Array.from({ length: 14 }).map((_, i) => ({
  id: String(i + 1),
  title: `Movie Title ${i + 1}`,
  badge: i % 3 === 0 ? "Hindi" : "",
  year: 2026,
  genre: "Drama",
  poster: `https://picsum.photos/seed/movie-${i + 1}/400/600`,
}));