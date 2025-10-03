import useHistoryStore from "@/lib/Store/HistoryStore";
import axios from "axios";

type HistoryItem = {
  url: string;
  selectors: string[];
  duration: string;
};

export const addHistoryDb = async (history: HistoryItem) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) return;
    const response = await axios.post(
      "https://dexio-2.onrender.com/history",
      {
        url: history.url,
        selectors: history.selectors,
        duration: String(history.duration),
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log(response.data);

    return response.data;
  } catch (error) {
    console.error(error);
  }
};

export const getHistoryDb = async () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) return;
    const response = await axios.get("https://dexio-2.onrender.com/history", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const history = response.data;
    useHistoryStore.getState().setHistory(history);
  } catch (error) {
    console.error(error);
  }
};

// Delete a single history item by ID
export const deleteHistoryDb = async (id: string) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      useHistoryStore.getState().removeHistory(id);
      return;
    }
    const response = await axios.delete(`https://dexio-2.onrender.com/history/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    useHistoryStore.getState().removeHistory(id);
    return response.data; // can return success message or deleted item
  } catch (error) {
    console.error("Error deleting history",error);
  }
};

export const clearHistoryDb = async () => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      useHistoryStore.getState().clearHistory();
      return;
    }

    const response = await axios.delete("https://dexio-2.onrender.com/history", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    useHistoryStore.getState().clearHistory();
    return response.data;
  } catch (error) {
    console.error("Error deleting history",error);
  }
};
