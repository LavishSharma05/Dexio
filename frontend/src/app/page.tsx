"use client"
import ScrapeForm from "@/components/ScrapeForm";
import HistorySidebar from "@/components/History/HistorySidebar";
import Navbar from "@/components/Navbar"; // Import your navbar
import { useEffect } from "react";
import { getHistoryDb } from "@/util/addHistoryDb";

export default function Home() {
  useEffect(()=>{
    const token=localStorage.getItem("token")
    if (token) {
      getHistoryDb(); // refetch history and set Zustand store
    }
  },[])
  return (
    <div className="flex flex-col h-screen">
      {/* Top Navbar */}
      <Navbar />

      {/* Main content area */}
      <div className="flex flex-1">
        {/* Left History Panel */}
        <aside className="w-[300px] border-r border-gray-200 dark:border-gray-700 p-4 overflow-y-auto bg-gray-50 dark:bg-slate-800">
          <HistorySidebar />
        </aside>

        {/* Main Scraper Form */}
        <main className="flex-1 p-6 overflow-y-auto">
          <ScrapeForm />
        </main>
      </div>
    </div>
  );
}
