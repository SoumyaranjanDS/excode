import React, { useEffect, useRef } from "react";
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import { ReactLenis } from 'lenis/react';
import gsap from 'gsap';

// Page imports
import Home from "./pages/public/Home";
import Feature from "./pages/public/Feature";
import Footer from "./pages/public/Footer";
import Navbar from "./pages/public/Navbar";

//auth Pages
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import Dashboard from "./pages/dashboard/Dashboard";

import ProblemsExplorer from "./pages/problems/ProblemsExplorer";
import Workspace from "./pages/workspace/Workspace";
import Leaderboard from "./components/Leaderboard";
import Community from "./components/Community";

import { AuthProvider } from "./context/AuthContext";

const Layout = () => {
  const lenisRef = useRef();

  useEffect(() => {
    function update(time) {
      lenisRef.current?.lenis?.raf(time * 1000);
    }

    gsap.ticker.add(update);

    return () => {
      gsap.ticker.remove(update);
    };
  }, []);

  return (
    <ReactLenis root ref={lenisRef} autoRaf={false} options={{ lerp: 0.1, duration: 1.2, smoothTouch: false }}>
      <div className="flex flex-col min-h-screen w-full bg-background text-on-background">
        <Navbar />
        <main className="grow flex flex-col pt-24">
          <Outlet />
        </main>
        <Footer />
      </div>
    </ReactLenis>
  );
};

const App = () => {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [
        {
          index: true,
          element: <Home />,
        },
        {
          path: "feture",
          element: <Feature />,
        },
        {
          path: "dashboard",
          element: <Dashboard />,
        },
        {
          path: "community",
          element: <Community />,
        },
      ],
    },
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/signup",
      element: <Signup />,
    },
    {
      path: "/problems",
      element: <ProblemsExplorer />,
    },
    {
      path: "/workspace/:problemId",
      element: <Workspace />,
    },
  ]);

  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
};

export default App;
