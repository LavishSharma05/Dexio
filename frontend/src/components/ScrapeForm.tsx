"use client";
import axios from "axios";
import React,{useState} from "react";
import LoadingSpinner from "./LoadingSpinner";
import useScraperStore from "@/lib/Store/ScraperStore";
import SelectorGrid from "./SelectorGrid";
import ScrapedOutput from "./ScrapedOutput";
import { handledownload } from "@/util/handleDownload";
import useHistoryStore from "@/lib/Store/HistoryStore";

function ScrapeForm() {
  const selectors = useScraperStore((state) => state.selectors);
  const setUrl = useScraperStore((state) => state.setUrl);
  const setData = useScraperStore((state) => state.setData);
  const setLoading = useScraperStore((state) => state.setLoading);
  const setError = useScraperStore((state) => state.setError);
  const reset = useScraperStore((state) => state.reset);
  const toggleOutput = useScraperStore((state) => state.toggleOutput);
  const setToggleOutput = useScraperStore((state) => state.setToggleOutput);
  const duration = useScraperStore((state) => state.duration);
  const setDuration = useScraperStore((state) => state.setDuration); 
  const addHistory=useHistoryStore((state)=>state.addHistory)

  const loading = useScraperStore((state) => state.loading);
  const error = useScraperStore((state) => state.error);
  const url = useScraperStore((state) => state.url);
  const toggleDownload = useScraperStore((state) => state.toggleDownload);
  const setToggleDownload = useScraperStore((state) => state.setToggleDownload);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setData({});

    if (!url.trim() || selectors.length === 0) {
      setError("URL and selector are required.");
      return;
    }

    setLoading(true);

    try {
      const res = await axios.post(
        "http://127.0.0.1:8000/scrape",
        {
          url,
          selectors,
        },
        { timeout: 10000 }
      );

      if (res.data?.output) {
        setData(res.data.output);
        setDuration(res.data.duration);
        addHistory({url,selectors,duration})
      } else {
        throw new Error("Invalid response format");
      }
    } catch (err: any) {
      const errorMsg =
        err.response?.data?.detail || err.response?.data?.error || err.message;
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    reset();
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-3xl 
           bg-gradient-to-br from-[#1e293b]/80 to-[#0f172a]/80 
           backdrop-blur-lg 
           border border-[#3b4a5e]/30 
           p-10 
           rounded-2xl 
           shadow-[0_0_40px_rgba(30,58,138,0.3)] 
           space-y-8 
           text-base"
      >
        <h2 className="text-2xl font-semibold text-gray-100 text-center tracking-tight">
          Dexio Web Scraper
        </h2>

        <div className="space-y-1">
          <label htmlFor="url" className="text-sm text-gray-400">
            Page URL
          </label>
          <input
            type="url"
            id="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com"
            className="w-full px-4 py-2 rounded-md bg-[#0d0d0d] text-gray-100 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-white transition"
            required
          />
        </div>

        <div className="h-[300px] overflow-y-auto border border-gray-700 rounded-md p-2">
          <SelectorGrid />
        </div>

        <button
          type="submit"
          className="w-full py-2 rounded-md bg-gradient-to-br from-gray-800 to-gray-700 text-white font-semibold hover:from-gray-700 hover:to-gray-600 focus:ring-2 focus:ring-white"
        >
          Scrape
        </button>

        <button
          className="mt-2 px-3 py-1 text-sm bg-slate-600 text-white rounded hover:bg-slate-700 transition"
          onClick={handleClear}
        >
          Clear Form
        </button>

        {loading ? (
          <LoadingSpinner />
        ) : error ? (
          <div className="text-red-400 bg-red-900/30 border border-red-700 rounded-md p-3 text-sm mt-4">
            {error}
          </div>
        ) : (
          <div className="p-4 border rounded-lg shadow-md bg-white dark:bg-slate-900">
            <h3 className="text-lg font-semibold mb-4">Scraped Output:</h3>

            {/* Toggle View Buttons */}
            <div className="flex gap-2 mb-4">
              <button
                type="button"
                onClick={() => setToggleOutput("parsed")}
                className={`px-3 py-1 text-sm rounded transition 
        ${
          toggleOutput === "parsed"
            ? "bg-slate-200 text-slate-800 dark:bg-slate-100"
            : "bg-slate-800 text-white dark:bg-slate-700"
        }
      `}
              >
                Parsed
              </button>

              <button
                type="button"
                onClick={() => setToggleOutput("raw")}
                className={`px-3 py-1 text-sm rounded transition 
        ${
          toggleOutput === "raw"
            ? "bg-slate-200 text-slate-800 dark:bg-slate-100"
            : "bg-slate-800 text-white dark:bg-slate-700"
        }
      `}
              >
                Raw HTML
              </button>
            </div>

            {/* Download Selector + Button */}
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <select
                className="px-3 py-2 text-sm rounded-md border border-slate-300 bg-white text-slate-800 dark:bg-slate-700 dark:text-white"
                value={toggleDownload}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                  setToggleDownload(e.target.value as "txt" | "csv" | "json")
                }
              >
                <option value="csv">Download as CSV</option>
                <option value="txt">Download as .txt</option>
                <option value="json">Download as JSON</option>
              </select>

              <button
                type="button"
                onClick={handledownload}
                className="px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition"
              >
                Download
              </button>
              <p className="text-sm text-gray-600">
                Scraping completed in <strong>{duration} ms</strong>
              </p>
            </div>

            <ScrapedOutput />
          </div>
        )}
      </form>
    </div>
  );
}

export default ScrapeForm;
