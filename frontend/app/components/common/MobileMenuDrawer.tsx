"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Plus, X, ChevronLeft } from "lucide-react";
import { mainLinks, genreLinks, countryLinks } from "./sideNavData";

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function MobileMenuDrawer({ open, onClose }: Props) {
  const [genreOpen, setGenreOpen] = useState(false);
  const [countryOpen, setCountryOpen] = useState(false);

  // ESC to close
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    if (open) window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  // lock body scroll
  // useEffect(() => {
  //   if (!open) return;

  //   const body = document.body;

  //   // previous values save
  //   const prevOverflow = body.style.overflow;
  //   const prevPaddingRight = body.style.paddingRight;

  //   // scrollbar width calculate
  //   const scrollbarWidth =
  //     window.innerWidth - document.documentElement.clientWidth;

  //   // lock scroll
  //   body.style.overflow = "hidden";

  //   // compensate scrollbar gap
  //   if (scrollbarWidth > 0) {
  //     body.style.paddingRight = `${scrollbarWidth}px`;
  //   }

  //   return () => {
  //     body.style.overflow = prevOverflow;
  //     body.style.paddingRight = prevPaddingRight;
  //   };
  // }, [open]);
  useEffect(() => {
    if (!open) return;
}, [open]);

return (
  <div
    className={[
      "fixed inset-0 z-[60] mt-[.4px]",
      open ? "pointer-events-auto" : "pointer-events-none",
    ].join(" ")}
    aria-hidden={!open}

  >
    {/* Overlay */}
    <div
      onClick={onClose}
      className={[
        "absolute inset-0 bg-black/60 transition-opacity duration-300",
        open ? "opacity-100" : "opacity-0",
      ].join(" ")}
    />

    {/* Panel */}
    <aside
      className={[
        "absolute left-0 top-0 h-full  w-[86%] max-w-[320px]",
        "bg-neutral-950/95 backdrop-blur",
        "border-r border-white/10",
        "transition-transform duration-300",
        open ? "translate-x-0" : "-translate-x-full",
      ].join(" ")}
      onClick={(e) => e.stopPropagation()}
    >
      {/* Close menu pill (pic-1 vibe) */}
      <div className="px-4 pt-4">
        <button
          onClick={onClose}
          className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-medium text-black"
        >
          <ChevronLeft size={18} />
          Close menu
        </button>
      </div>

      {/* Menu list */}
      <nav className="mt-4">
        <ul className="text-white">
          {mainLinks.map((item) => (
            <li key={item.href} className="border-b border-white/10">
              <Link
                href={item.href}
                onClick={onClose}
                className="block px-5 py-4 text-lg font-medium hover:bg-white/5"
              >
                {item.label}
              </Link>
            </li>
          ))}

          {/* Genre accordion */}
          <li className="border-b border-white/10">
            <button
              onClick={() => setGenreOpen((v) => !v)}
              className="flex w-full items-center justify-between px-5 py-4 text-lg font-medium hover:bg-white/5"
            >
              <span>Genre</span>
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/10">
                <Plus size={18} className="text-white" />
              </span>
            </button>

            <div className={genreOpen ? "block" : "hidden"}>
              {genreLinks.map((g) => (
                <Link
                  key={g.href}
                  href={g.href}
                  onClick={onClose}
                  className="block px-7 py-3 text-sm text-white/80 hover:bg-white/5"
                >
                  {g.label}
                </Link>
              ))}
            </div>
          </li>

          {/* Country accordion */}
          <li className="border-b border-white/10">
            <button
              onClick={() => setCountryOpen((v) => !v)}
              className="flex w-full items-center justify-between px-5 py-4 text-lg font-medium hover:bg-white/5"
            >
              <span>Country</span>
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/10">
                <Plus size={18} className="text-white" />
              </span>
            </button>

            <div className={countryOpen ? "block" : "hidden"}>
              {countryLinks.map((c) => (
                <Link
                  key={c.href}
                  href={c.href}
                  onClick={onClose}
                  className="block px-7 py-3 text-sm text-white/80 hover:bg-white/5"
                >
                  {c.label}
                </Link>
              ))}
            </div>
          </li>
        </ul>
      </nav>
    </aside>
  </div>
);
}
