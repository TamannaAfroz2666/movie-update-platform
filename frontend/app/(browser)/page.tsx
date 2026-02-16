"use client";

import HeaderNav from "../components/common/HeaderNav";
import ShowcaseNowShowing from "../components/showmovies/ShowcaseNowShowingList";
import HeroCaroselView from "../components/ViewHome/HeroCaroselView";



export default function BrowseHomePage() {
  return (
    <div className="mt-0">
     <HeroCaroselView/>
      <ShowcaseNowShowing/>
    </div>
  ); 
}