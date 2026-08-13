"use client";

import { useEffect, useState } from "react";
import LeadPopup from "./LeadPopup";
import FloatingContact from "./FloatingContact";


export default function GlobalPopupWrapper() {
    useEffect(() => {
  const openPopup = () => setPopupOpen(true);

  window.addEventListener("open-global-popup", openPopup);

  return () => {
    window.removeEventListener("open-global-popup", openPopup);
  };
}, []);
    
  const [popupOpen, setPopupOpen] = useState(false);

  return (
    
    <>
      <FloatingContact setPopupOpen={setPopupOpen} />

      <LeadPopup
        isOpen={popupOpen}
        setIsOpen={setPopupOpen}
      />
    </>
  );
}