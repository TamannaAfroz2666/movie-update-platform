"use client";
import Image from "next/image";

type Props = {
  title: string;
  poster: string;
  badge?: string;
};

export default function MovieCard({ title, poster, badge }: Props) {
  return (
    <div className="group relative w-[150px] shrink-0 sm:w-[170px] md:w-[190px]">
      <div className="relative aspect-[2/3] overflow-hidden rounded-xl bg-white/5 ring-1 ring-white/10">
        <Image
          src={poster}
          alt={title}
          fill
          className="object-cover transition duration-300 group-hover:scale-[1.03]"
          sizes="(max-width: 640px) 150px, (max-width: 768px) 170px, 190px"
        />
        {badge ? (
          <span className="absolute right-2 top-2 rounded-md bg-black/70 px-2 py-1 text-xs text-white">
            {badge}
          </span>
        ) : null}
      </div>

      <p className="mt-2 line-clamp-1 text-sm text-white/90">{title}</p>
    </div>
  );
}