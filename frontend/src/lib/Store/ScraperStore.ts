import { create } from "zustand";

type ScrapedElement = {
  raw: string;
  parsed: string;
};

type ScrapeStore = {
  url: string;
  selectors: string[];
  data: Record<string, ScrapedElement[]>;
  loading: boolean;
  error: string | null; 
  custom: string;
  toggleOutput: "parsed" | "raw";
  toggleDownload: "csv" | "json" | "txt"
  duration:string

  setUrl: (url: string) => void;
  addSelector: (selector: string) => void;
  removeSelector: (selector: string) => void;
  setData: (data: Record<string, ScrapedElement[]>) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setCustom: (custom: string) => void;
  reset: () => void;
  setToggleOutput:(toggleOutput:"parsed" | "raw")=>void;
  setToggleDownload:(toggleDownload:"csv" | "json" | "txt")=>void;
  setDuration:(duration:string)=>void
};

const useScraperStore = create<ScrapeStore>((set) => ({
  url: "",
  selectors: [],
  data: {},
  loading: false,
  error: null,
  custom: "",
  toggleOutput:"parsed",
  toggleDownload:"csv",
  duration:"0",

  setUrl: (url) => set({ url }),

  addSelector: (selector) =>
    set((state) => ({
      selectors: [
        ...new Set([...state.selectors, selector.trim().toLowerCase()]),
      ],
    })),

  removeSelector: (selector) =>
    set((state) => ({
      selectors: state.selectors.filter((s) => s !== selector),
    })),
  setData: (data) => set({ data }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  setCustom: (custom) => set({ custom }),
  setToggleOutput:(toggleOutput)=>set({toggleOutput}),
  setToggleDownload:(toggleDownload:"csv" | "json" | "txt")=>set({toggleDownload}),
  setDuration:(duration)=>set({duration}),
  reset: () =>
    set({
      url: "",
      selectors: [],
      data: {},
      loading: false,
      error: null,
      custom: "",
      toggleOutput:"parsed",
      toggleDownload:"csv",
      duration:"0"
    }),
}));

export default useScraperStore;
