'use client'
import { Menu, Play, Search, User } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import MovieUpdatesModal from '../modal/MovieUpdatesModal';

const HeaderNav = ({ onMenuClick }: { onMenuClick: () => void }) => {
  // const [value, setValue] = useState(HeaderNav);
  const [open, setOpen] = useState(false);

  return (<>

    {/* from-[#455242] to-[#455242] */}
    <header className="sticky top-0 z-50 w-full bg-gradient-to-r  from-[#3f5f75] via-[#466175] to-[#4b6b80] ">
      <div className='w-[90%] m-auto'>
        <div className="mx-auto flex h-24  items-center justify-between px-4">

          {/* LEFT */}
          <div className="flex items-center gap-4">
            <button
              onClick={onMenuClick}
              aria-label="Open menu"
              className="text-white hover:opacity-80">
              <Menu size={30} />
            </button>

            <div className=" group relative flex items-center gap-2">
              <Link href="/" className="flex items-center gap-2">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white ">
                  <Play size={30} className="text-black" />
                </div>
                <div className="pointer-events-none absolute left-18  z-50  
  -translate-x-1/2 translate-y-1 rounded-md bg-white px-1 py-[5px] text-xs text-black 
  opacity-0 transition-all duration-200 
  group-hover:translate-y-0 group-hover:opacity-100">
                  reelbox.io
                </div>
              </Link>
            </div>
          </div>

          {/* CENTER SEARCH */}
          <div className="hidden w-full max-w-md sm:block">
            <div className="relative">
              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-900"
              />
              <input
                type="text"
                placeholder="Enter keywords..."
                className="w-full rounded-full bg-white px-12 py-2 text-lg text-black outline-none placeholder:text-gray-500"
              />
            </div>
          </div>

          {/* RIGHT */}
          {/* ✅ Modal */}
          <div className="relative">
            <button
             onClick={() => setOpen(true)}
              className="inline-flex uppercase items-center justify-center rounded-full border border-white/70 bg-white/10 px-6 py-3 text-sm font-semibold tracking-wide hover:bg-white/20"
              aria-label="Play trailer"
            >
              {/* <Play className="text-white" /> */}
              Latest
            </button>

            <MovieUpdatesModal open={open} onClose={() => setOpen(false)} />

          </div>
        </div>

        {/* MOBILE SEARCH */}
        <div className="px-4 pb-3 sm:hidden">
          <div className="relative">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
            />
            <input
              type="text"
              placeholder="Enter keywords..."
              className="w-full rounded-full bg-white px-12 py-2 text-sm text-black outline-none"
            />
          </div>
        </div>
      </div>

    </header>



  </>



  );
}

export default HeaderNav;