import React, { useState } from "react";
import useScraperStore from "@/lib/Store/ScraperStore";

const commonSelectors = ["h1", "p", "a", "img", "div", "span"];

function SelectorGrid() {
  const { selectors, addSelector, removeSelector,custom,setCustom } = useScraperStore();

  const toggleSelector = (selector: string) => {
    if (selectors.includes(selector)){
        removeSelector(selector);
    } 
    else{
        addSelector(selector);
    } 
    
  };

  return (
    <div className="space-y-4">
      {/* Common Selectors Grid */}
      <div>
        <p className="font-semibold mb-2">Common Selectors:</p>
        <div className="grid grid-cols-3 gap-2">
          {commonSelectors.map((sel) => (
            <label
              key={sel}
              className={`px-3 py-2 border rounded cursor-pointer ${
                selectors.includes(sel)
                  ? "bg-blue-500 text-white"
                  : "bg-black-100"
              }`}
              onClick={() => toggleSelector(sel)}
            >
              {sel}
            </label>
          ))}
        </div>
      </div>

      {/* Custom Selector Input */}
      <div className="flex gap-2 items-center">
        <input
          value={custom}
          onChange={(e) => setCustom(e.target.value)}
          placeholder="Enter custom selector"
          className="border px-3 py-2 rounded w-full"
        />
        <button
          type="button"
          onClick={() => {
            if (custom.trim()) {
              addSelector(custom.trim());
              setCustom("");
            }
          }}
          className="bg-blue-600 text-white px-3 py-2 rounded"
        >
          Add
        </button>
      </div>

      {/* Selected Selectors Display */}
      {selectors.length > 0 && (
        <div>
          <p className="font-semibold mb-2">Selected:</p>
          <div className="flex flex-wrap gap-2">
            {selectors.map((sel) => (
              <div
                key={sel}
                className="bg-black-10 px-3 py-1 rounded-full text-sm flex items-center gap-2"
              >
                {sel}
                <button
                  onClick={() => removeSelector(sel)}
                  className="text-red-500 hover:text-red-700"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default SelectorGrid;
