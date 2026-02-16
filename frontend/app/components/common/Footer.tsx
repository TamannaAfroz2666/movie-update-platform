import Link from "next/link";
import { Play } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-neutral-900 text-white/80">
      <div className="mx-auto w-[90%]  px-6 py-10">
        <div className="grid gap-8 md:grid-cols-3 md:items-center">
          
          {/* LEFT */}
          <div className="flex flex-col items-center gap-3 md:items-start">
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white ">
                <Play size={18} className="text-black" />
              </div>
              <span className="text-lg font-semibold text-white">
                ReelBox
              </span>
            </div>
            <p className="text-sm text-white/60">
              © ReelBox.io
            </p>
          </div>

          {/* CENTER */}
          <div className="text-center">
            <p className="mx-auto max-w-xl text-sm leading-relaxed text-white/70">
              ReelBox.io is a Free Movies streaming site with zero ads.
              We let you watch movies online without having to register
              or paying, with over 10000 movies and TV-Series.
              You can also download full movies from ReelBox.io and
              watch it later if you want.
            </p>

            <div className="mt-4 flex flex-wrap justify-center gap-x-4 gap-y-2 text-sm">
              <Link href="#" className="hover:text-white">
                Terms of service
              </Link>
              <span>•</span>
              <Link href="#" className="hover:text-white">
                Contact
              </Link>
              <span>•</span>
              <Link href="#" className="hover:text-white">
                Sitemap
              </Link>
              <span>•</span>
              <Link href="#" className="hover:text-white">
                FAQ
              </Link>
              <span>•</span>
              <Link href="#" className="hover:text-white">
                anime
              </Link>
            </div>
          </div>

          {/* RIGHT */}
          <div className="text-center md:text-right">
            <p className="text-xs  leading-relaxed text-white/50">
              ReelBox.io does not store any files on our server,<br />
              we only linked to the media which is hosted on
              <br />3rd party services.
            </p>
          </div>

        </div>
      </div>
    </footer>
  );
}
