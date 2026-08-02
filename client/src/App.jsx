import React, { useEffect, useRef, Suspense, lazy } from "react";
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import { HelmetProvider } from 'react-helmet-async';
import { ReactLenis } from 'lenis/react';
import gsap from 'gsap';

// Eagerly loaded (essential for layout/initial render)
import Navbar from "./pages/public/Navbar";
import Footer from "./pages/public/Footer";
import Home from "./pages/public/Home"; // Keep Home eager for fastest possible FCP!

// Lazy loaded (split into separate chunks)
const Feature = lazy(() => import("./pages/public/Feature"));
const ComingSoon = lazy(() => import("./pages/public/ComingSoon"));
const Why = lazy(() => import("./pages/public/Why"));

// Auth Pages
const Login = lazy(() => import("./pages/auth/Login"));
const Signup = lazy(() => import("./pages/auth/Signup"));
const Dashboard = lazy(() => import("./pages/dashboard/Dashboard"));
const Profile = lazy(() => import("./pages/profile/Profile"));
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));

const ProblemsExplorer = lazy(() => import("./pages/problems/ProblemsExplorer"));
const Workspace = lazy(() => import("./pages/workspace/Workspace"));
const Leaderboard = lazy(() => import("./components/Leaderboard"));
const Community = lazy(() => import("./components/Community"));

import { AuthProvider } from "./context/AuthContext";
import { Agentation } from "agentation";

// Fallback loader for lazy-loaded pages
const PageLoader = () => (
  <div className="flex h-[calc(100vh-80px)] w-full items-center justify-center bg-background">
    <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
  </div>
);

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
      <div className="flex flex-col min-h-screen w-full bg-background text-on-background relative">
        <Navbar />
        <main className="grow flex flex-col">
          <Suspense fallback={<PageLoader />}>
            <Outlet />
          </Suspense>
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
          element: <Suspense fallback={<PageLoader />}><Feature /></Suspense>,
        },
        {
          path: "why",
          element: <Suspense fallback={<PageLoader />}><Why /></Suspense>,
        },
        {
          path: "dashboard",
          element: <Suspense fallback={<PageLoader />}><Dashboard /></Suspense>,
        },
        {
          path: "community",
          element: <Suspense fallback={<PageLoader />}><Community /></Suspense>,
        },
      ],
    },
    {
      path: "/login",
      element: <Suspense fallback={<PageLoader />}><Login /></Suspense>,
    },
    {
      path: "/signup",
      element: <Suspense fallback={<PageLoader />}><Signup /></Suspense>,
    },
    {
      path: "/problems",
      element: <Suspense fallback={<PageLoader />}><ProblemsExplorer /></Suspense>,
    },
    {
      path: "/workspace/:problemId",
      element: <Suspense fallback={<PageLoader />}><Workspace /></Suspense>,
    },
    {
      path: "/profile/:username?",
      element: <Suspense fallback={<PageLoader />}><Profile /></Suspense>,
    },
    {
      path: "/admin",
      element: <Suspense fallback={<PageLoader />}><AdminDashboard /></Suspense>,
    },
    {
      path: "/learning-paths",
      element: <Suspense fallback={<PageLoader />}><ComingSoon /></Suspense>,
    },
    {
      path: "/competitions",
      element: <Suspense fallback={<PageLoader />}><ComingSoon /></Suspense>,
    },
    {
      path: "/assessments",
      element: <Suspense fallback={<PageLoader />}><ComingSoon /></Suspense>,
    },
    {
      path: "/leaderboard",
      element: <Suspense fallback={<PageLoader />}><ComingSoon /></Suspense>,
    },
    {
      path: "/achievements",
      element: <Suspense fallback={<PageLoader />}><ComingSoon /></Suspense>,
    },
    {
      path: "/settings",
      element: <Suspense fallback={<PageLoader />}><ComingSoon /></Suspense>,
    },
  ]);

  return (
    <HelmetProvider>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </HelmetProvider>
  );
};

export default App;
