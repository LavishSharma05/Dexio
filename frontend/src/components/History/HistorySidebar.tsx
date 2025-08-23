"use client";
import useHistoryStore from "@/lib/Store/HistoryStore";
import useScraperStore from "@/lib/Store/ScraperStore";
import { deleteHistoryDb, clearHistoryDb} from "@/util/addHistoryDb";

type HistoryItem = {
  id: string;
  url: string;
  selectors: string[];
  duration: string;
  timestamp: string;
};

function HistorySidebar() {
  const history = useHistoryStore((state) => state.history);
  const setUrl=useScraperStore((state)=>state.setUrl)
  const addSelector=useScraperStore((state)=>state.addSelector)


  const handleStates=(item:HistoryItem)=>{
    setUrl(item.url)
    
    for (const selector of item.selectors){
      addSelector(selector)
    }
  }

  return (
    <div className="p-4 border-r border-gray-200 dark:border-gray-700 h-full overflow-y-auto w-72 bg-gray-50 dark:bg-slate-800">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-lg font-semibold text-slate-900 dark:text-white">History</h1>
        <button
          type="button"
          onClick={clearHistoryDb}
          className="text-xs text-red-600 hover:text-red-800"
        >
          Clear All
        </button>
      </div>

      {history.length === 0 ? (
        <p className="text-sm text-gray-500 dark:text-gray-300">No history yet</p>
      ) : (
        <ul className="space-y-2">
          {history.map((item: HistoryItem) => (
            <li
              key={item.id}
              className="bg-white dark:bg-slate-700 border border-gray-200 dark:border-gray-600 p-3 rounded shadow-sm"
              onClick={()=>handleStates(item)}
            >
              <p className="text-sm text-gray-700 dark:text-gray-100 font-medium truncate">
                {item.url}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-300 truncate">
                {item.selectors.join(", ")}
              </p>
              <div className="flex justify-between items-center mt-2">
                <span className="text-xs text-gray-400">
                  {new Date(item.timestamp).toLocaleString()}
                </span>
                <button
                  onClick={() => deleteHistoryDb(item.id)}
                  className="text-xs text-red-400 hover:text-red-600"
                >
                  Remove
                </button>
              </div>
              <p className="text-[10px] text-gray-400 italic mt-1">
                Duration: {item.duration}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default HistorySidebar;
