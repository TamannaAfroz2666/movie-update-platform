export type HeroSlide = {
  id: string;
  title: string;
  meta: string;     
  image: string;     
  ctaText: string;   
  href?: string;
  trailerUrl?: string
};

export const heroSlides: HeroSlide[] = [
  {
    id: "1",
    title: "Avatar: Fire and Ash",
    meta: "PG-13 • 3 hr 17 min",
    image: "/photos/avater.jpg", 
    ctaText: "Check it out",
    href: "/photos/1",
    trailerUrl: "https://youtu.be/nb_fFj_0rq8?si=tZagz4qo1gSUVM3b"
  },
  {
    id: "2",
    title: "Dune: Part Two",
    meta: "PG-13 • 2 hr 46 min",
    image: "/photos/dune.jpg",
    ctaText: "Check it out",
    href: "/movie/2",
    trailerUrl: "https://youtu.be/Way9Dexny3w?si=jDfdXzcVwKEn5zoz "
  },
  {
    id: "3",
    title: "Oppenheimer",
    meta: "R • 3 hr 0 min",
    image: "/photos/oppenheimer.jpg",
    ctaText: "Check it out",
    href: "/movie/3",
    trailerUrl: "https://youtu.be/uYPbbksJxIg?si=sYfKNssX2Q9Bbt86"
  },
];
