import React from "react";
import { useAuth } from "../lib/authContext";

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <div className="flex items-center justify-between p-4 bg-white/10 backdrop-blur-lg rounded-xl shadow">
      <div className="text-lg font-semibold">
        AUY Student Portal
      </div>

      <div className="flex items-center gap-4">
        <span className="text-sm opacity-80">
          {user?.studentName || user?.email}
        </span>

        <button
          onClick={logout}
          className="px-3 py-1 text-sm rounded-lg bg-white/20 hover:bg-white/30"
        >
          Logout
        </button>
      </div>
    </div>
  );
}