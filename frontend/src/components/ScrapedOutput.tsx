import React from "react";
import useScraperStore from "@/lib/Store/ScraperStore";
import toast from "react-hot-toast";

function ScrapedOutput() {
  const data = useScraperStore((state) => state.data);
  const toggleOutput = useScraperStore((state) => state.toggleOutput);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast.success("Copied!");
    });
  };

  return (
    <div className="max-h-[300px] overflow-y-auto overflow-x-auto rounded-md border border-gray-700 p-3">
      {!data || Object.keys(data).length === 0 ? (
        <div className="mt-6 text-yellow-400 text-sm">
          No output found for the given selectors.
        </div>
      ) : (
        Object.entries(data).map(([selector, results]) => (
          <div key={selector} className="mb-4">
            <h2 className="mt-4 text-yellow-400 text-sm break-words font-mono bg-slate-800 px-2 py-1 rounded">
              {selector}{" "}
              <span className="text-gray-400">
                ({results.length} {results.length === 1 ? "match" : "matches"})
              </span>
            </h2>

            {results.length === 0 ? (
              <p className="text-gray-400 text-sm italic">No data to show</p>
            ) : (
              results.map((item, idx) => (
                <div key={idx} className="relative group pr-10">
                  <button
                    type="button"
                    className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 text-xs bg-slate-600 text-white px-2 py-1 rounded transition"
                    onClick={() =>
                      handleCopy(
                        toggleOutput === "parsed" ? item.parsed : item.raw
                      )
                    }
                  >
                    Copy
                  </button>
                  <div
                    key={idx}
                    className="text-gray-200 text-sm break-words whitespace-pre-wrap"
                  >
                    {toggleOutput === "parsed" ? (
                      item.parsed
                    ) : (
                      <pre className="text-xs text-green-300 whitespace-pre-wrap">
                        {item.raw}
                      </pre>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        ))
      )}
    </div>
  );
}

export default ScrapedOutput;
