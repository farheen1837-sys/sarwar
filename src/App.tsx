/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route, Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Navbar from "./components/Navbar";
import CustomCursor from "./components/CustomCursor";

// Auth context simple version
export interface User {
  email: string;
  name: string;
  picture: string;
}

export default function App() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const handleAuth = (event: MessageEvent) => {
      if (event.data?.type === "OAUTH_AUTH_SUCCESS") {
        setUser(event.data.user);
        localStorage.setItem("user", JSON.stringify(event.data.user));
      }
    };
    window.addEventListener("message", handleAuth);

    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }

    return () => window.removeEventListener("message", handleAuth);
  }, []);

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <Router>
      <div className="min-h-screen relative overflow-hidden selection:bg-brand selection:text-white">
        <CustomCursor />
        <Navbar user={user} onLogout={handleLogout} />
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/" element={<Home user={user} />} />
            <Route path="/login" element={<Login user={user} />} />
          </Routes>
        </AnimatePresence>
      </div>
    </Router>
  );
}
