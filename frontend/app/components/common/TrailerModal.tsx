"use client";

import { useEffect } from "react";

type Props = {
    open: boolean;
    trailerUrl: string | null;
    onClose: () => void;
};

function toYouTubeEmbed(url: string) {
    const short = url.match(/youtu\.be\/([a-zA-Z0-9_-]+)/)?.[1];
    const watch = url.match(/[?&]v=([a-zA-Z0-9_-]+)/)?.[1];
    const embed = url.match(/youtube\.com\/embed\/([a-zA-Z0-9_-]+)/)?.[1];

    const id = short || watch || embed;
    return id ? `https://www.youtube.com/embed/${id}?autoplay=1&rel=0` : url;
}

export default function TrailerModal({ open, trailerUrl, onClose }: Props) {
    // ESC key support
    useEffect(() => {
        function onEsc(e: KeyboardEvent) {
            if (e.key === "Escape") onClose();
        }
        if (open) window.addEventListener("keydown", onEsc);
        return () => window.removeEventListener("keydown", onEsc);
    }, [open, onClose]);

    if (!open || !trailerUrl) return null;

    return (
        <div
            className="fixed inset-0 z-[80] bg-black/70"
            onClick={onClose}
        >
            {/* Centering wrapper */}
            <div className="flex min-h-[85dvh] items-center justify-center p-4 ">
                {/* Modal box */}
                <div
                    className="relative w-full max-w-4xl overflow-hidden rounded-xl bg-black shadow-2xl"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Close button */}
                    <button
                        onClick={onClose}
                        className="absolute right-3 top-3 z-10 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
                        aria-label="Close trailer"
                    >
                        ✕
                    </button>

                    {/* Video wrapper: never exceed viewport height */}
                    <div className="max-h-[585dvh] w-full  ">
                        <div className="aspect-video w-full ">
                            <iframe
                                className="h-full w-full"
                                src={toYouTubeEmbed(trailerUrl)}
                                title="Trailer"
                                allow="autoplay; encrypted-media; picture-in-picture"
                                allowFullScreen
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

}
