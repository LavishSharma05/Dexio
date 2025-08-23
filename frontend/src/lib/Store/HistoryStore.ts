import { addHistoryDb } from "@/util/addHistoryDb";
import { create } from "zustand";

type HistoryItem = {
  id: string;
  url: string;
  selectors: string[];
  duration: string;
  timestamp: string;
};

type HistoryStore = {
  history: HistoryItem[];
  setHistory: (items: HistoryItem[]) => void;
  addHistory: (item: Omit<HistoryItem, "id" | "timestamp">) => void;
  removeHistory: (id: string) => void;
  clearHistory: () => void;
};

const useHistoryStore = create<HistoryStore>((set) => ({
  history: [],

  setHistory: (items) => {
    set(() => ({
      history: items,
    }));
  },

  addHistory: async (item) => {
    const savedItem = await addHistoryDb(item);

    if (savedItem) {
      set((state) => ({
        history: [savedItem, ...state.history.slice(0, 20)],
      }));
    } else {
      const localItem: HistoryItem = {
        ...item,
        id: crypto.randomUUID(),
        timestamp: new Date().toISOString(),
      };
      set((state) => ({
        history: [localItem, ...state.history.slice(0, 20)],
      }));
    }
  },

  removeHistory: (id) => {
    set((state) => ({
      history: state.history.filter((item) => item.id !== id),
    }));
  },

  clearHistory: () => {
    set((state) => ({
      history: [],
    }));
  },
}));

export default useHistoryStore;
