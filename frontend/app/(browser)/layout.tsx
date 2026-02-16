
'use client'

import { useEffect, useState } from "react";
import HeaderNav from "../components/common/HeaderNav";
import MobileMenuDrawer from "../components/common/MobileMenuDrawer";
import Footer from "../components/common/Footer";
import { clearPopupRecord, getPopupRecord, isRecordValid } from "../lib/popupTTL";
import UpdatesPopup from "../components/modal/UpdatesPopup";

export default function BrowseLayout({ children }: { children: React.ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const record = getPopupRecord();

    // record নাই => show
    if (!record) {
      setOpen(true);
      return;
    }

    // record আছে কিন্তু expired => remove + show
    if (!isRecordValid(record)) {
      clearPopupRecord();
      setOpen(true);
      return;
    }

    // record valid => 6 hours এর ভিতরে => hide
    setOpen(false);
  }, []);
  return (
    <div className="w-full text-white">
      <div className=" ">
        <HeaderNav onMenuClick={() => setMenuOpen(true)} />
        <MobileMenuDrawer open={menuOpen} onClose={() => setMenuOpen(false)} />

        <main className=" w-full">
          {/* <Topbar /> */}
          <div className="mx-auto w-[90%]  ">
            {children}
          </div>
          <Footer />
        </main>
         <UpdatesPopup open={open} onClose={() => setOpen(false)} />
      </div>
    </div>
  );
}
