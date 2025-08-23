"use client";

import useHistoryStore from "@/lib/Store/HistoryStore";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Navbar() {
  const router = useRouter();
  const [loggedIn,setLoggedIn]=useState(false)

  useEffect(()=>{
    const token=localStorage.getItem("token")
    if(token){
        setLoggedIn(true)
    }
  },[])

  const handleLogout=()=>{
    localStorage.removeItem("token")
    useHistoryStore.getState().clearHistory()
    setLoggedIn(false)
  }
  

  return (
    <nav className="bg-white shadow-md py-4 px-6 flex justify-between items-center">
      {/* Left: Brand */}
      <h1
        className="text-2xl font-bold text-blue-600 cursor-pointer"
        onClick={() => router.push("/")}
      >
        Dexio
      </h1>

      {/* Right: Conditional Auth Buttons */}
      <div className="space-x-4">
        {loggedIn ? (
          <button
            onClick={handleLogout}
            className="px-4 py-2 text-sm font-medium text-red-500 border border-red-500 rounded hover:bg-red-50 transition"
          >
            Signout
          </button>
        ) : (
          <>
            <button
              onClick={() => router.push("/signup")}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded hover:bg-blue-600 transition"
            >
              Signup
            </button>
            <button
              onClick={() => router.push("/login")}
              className="px-4 py-2 text-sm font-medium text-blue-500 border border-blue-500 rounded hover:bg-blue-50 transition"
            >
              Login
            </button>
          </>
        )}
      </div>
    </nav>
  );
}
