"use client";
import MovieCard from "./MovieCard";

type Item = { id: string; title: string; poster: string; badge?: string };

export default function MovieRow({
  title,
  items,
}: {
  title: string;
  items: Item[];
}) {
  return (
    <section className="mt-6">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-base font-semibold text-white">
          <span className="mr-2">🔥</span>
          {title}
        </h2>
        <button className="text-sm text-white/70 hover:text-white">
          More →
        </button>
      </div>

      <div className="flex gap-3 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {items.map((m) => (
          <MovieCard key={m.id} title={m.title} poster={m.poster} badge={m.badge} />
        ))}
      </div>
    </section>
  );
}