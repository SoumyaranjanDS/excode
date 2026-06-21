import React from "react";
import { useAuth } from "../../context/AuthContext";
import { Link, Navigate } from "react-router-dom";

const Dashboard = () => {
  const { backendUser } = useAuth();

  // If not logged in, redirect to login
  if (!backendUser) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="relative w-full flex-grow flex items-center justify-center overflow-hidden bg-background">
      {/* Huge Background Logo */}
      <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none overflow-hidden">
        <img
          src="/excode.svg"
          alt="excode background"
          className="w-[80vw] h-[80vw] max-w-[800px] max-h-[800px] opacity-[0.03] grayscale"
        />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-6">
        <h1 className="font-geist text-4xl md:text-6xl font-bold tracking-tight text-on-surface mb-6">
          Hii <span className="text-primary">{backendUser.name}</span>,
          <br />
          welcome to excode.
        </h1>
        <p className="font-inter text-lg text-on-surface-variant max-w-2xl mx-auto mb-10">
          Your arena is ready. Time to start building and executing code with ruthless precision.
        </p>
        <Link
          to="/problems"
          className="inline-block bg-primary text-on-primary px-8 py-3 rounded-xl font-jetbrains text-sm font-semibold tracking-wide transition-all shadow-[0_0_15px_rgba(77,142,255,0.3)] hover:shadow-[0_0_20px_rgba(77,142,255,0.5)] hover:-translate-y-0.5"
        >
          ENTER THE ARENA
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;
