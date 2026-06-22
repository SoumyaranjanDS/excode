import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const ProblemsExplorer = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { backendUser } = useAuth();

  const [heatmapCells, setHeatmapCells] = useState([]);

  React.useEffect(() => {
    const daysInMonth = 28;
    const intensityClasses = [
      "bg-surface-variant border border-outline-variant/10",
      "bg-primary/30 border border-primary/20",
      "bg-primary/60 border border-primary/40",
      "bg-primary border border-primary/80 glow-hover",
    ];

    const cells = Array.from({ length: daysInMonth }).map((_, i) => {
      const rand = Math.random();
      let intensity = 0;
      if (rand > 0.6) intensity = 1;
      if (rand > 0.8) intensity = 2;
      if (rand > 0.9) intensity = 3;
      return (
        <div
          key={i}
          className={`w-full aspect-square rounded-sm ${intensityClasses[intensity]} transition-all duration-200`}
        />
      );
    });
    setHeatmapCells(cells);
  }, []);

  return (
    <div className="bg-background text-on-surface font-body-md h-screen overflow-hidden flex selection:bg-primary-container selection:text-on-primary-container">
      {/* Left Sidebar */}
      <aside
        className={`w-64 h-screen fixed left-0 top-0 bg-surface border-r border-outline-variant/30 backdrop-blur-xl flex flex-col p-md z-40 transition-transform duration-300 transform ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
      >
        {/* Brand */}
        <div className="flex items-center gap-sm mb-lg px-sm">
          <span
            className="material-symbols-outlined text-primary text-3xl"
            data-icon="terminal"
          >
            terminal
          </span>
          <span className="font-headline-md text-headline-md font-bold text-primary tracking-tight">
            Excode
          </span>
        </div>
        {/* User Profile Card */}
        <div className="glass-panel rounded-xl p-md mb-lg">
          <div className="flex items-center gap-sm mb-md">
            <img
              className="w-10 h-10 rounded-full object-cover border border-outline-variant/50"
              data-alt="A detailed, hyper-realistic profile portrait of a modern software developer in a dimly lit studio environment. Cool blue and purple ambient lighting highlights the subject's focused expression. The overall aesthetic is cinematic, premium, and professional."
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAgIGP3kJBWkWCRd_1qtVQSDRKnCJEu9Jx6Hu-qyKQ7_1v1BRL9FkODk-3Qgs1m-ytPBzg0CtZ_BTQ7OT36VRUyZfuH9yiBuOI0NaLnoEF1dvCchH3xp9xtFkxj1661CAVrOh-yFjY03vq4ImNKJkosfwjT8aS2XPGuaewhDcdO_kWAlSxZ0x1e7hoIBJywTT7I6ZSjW2AzcL0RoBu1kRe3TNcuYw6v-o6ejZrthvu3stRES6oLALVKeTXRv9j4Ht-QhuLV80KB-FGV"
            />
            <div>
              <div className="font-body-md font-semibold text-on-surface leading-tight">
                {backendUser?.name || "Guest"}
              </div>
              <div className="font-code-sm text-on-surface-variant flex items-center gap-xs mt-1">
                <span
                  className="material-symbols-outlined text-[14px] text-amber-400"
                  data-icon="local_fire_department"
                  data-weight="fill"
                >
                  local_fire_department
                </span>
                15 Day Streak
              </div>
            </div>
          </div>
          <div className="space-y-sm">
            <div className="flex justify-between font-label-caps text-label-caps text-on-surface-variant">
              <span className="">LEVEL 14</span>
              <span className="">350 / 500 XP</span>
            </div>
            <div className="h-1 bg-surface-variant rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-primary to-primary-container rounded-full"
                style={{ width: "70%" }}
              ></div>
            </div>
          </div>
        </div>
        {/* Navigation Links */}
        <nav className="flex-1 space-y-sm overflow-y-auto custom-scrollbar pr-xs">
          <Link
            className="flex items-center gap-md px-md py-sm rounded-lg text-on-surface-variant hover:bg-surface-variant/50 transition-colors duration-200"
            to="#"
          >
            <span
              className="material-symbols-outlined text-xl"
              data-icon="dashboard"
            >
              dashboard
            </span>
            <span className="">Dashboard</span>
          </Link>
          <Link
            className="flex items-center gap-md px-md py-sm rounded-lg text-on-surface-variant hover:bg-surface-variant/50 transition-colors duration-200"
            to="#"
          >
            <span
              className="material-symbols-outlined text-xl"
              data-icon="school"
            >
              school
            </span>
            <span className="">Learning Paths</span>
          </Link>
          <Link
            className="flex items-center gap-md px-md py-sm rounded-lg text-primary bg-secondary-container/20"
            to="#"
          >
            <span
              className="material-symbols-outlined text-xl"
              data-icon="workspace_premium"
              data-weight="fill"
            >
              workspace_premium
            </span>
            <span className="font-medium">Challenges</span>
          </Link>
          <Link
            className="flex items-center gap-md px-md py-sm rounded-lg text-on-surface-variant hover:bg-surface-variant/50 transition-colors duration-200"
            to="#"
          >
            <span
              className="material-symbols-outlined text-xl"
              data-icon="emoji_events"
            >
              emoji_events
            </span>
            <span className="">Competitions</span>
          </Link>
          <Link
            className="flex items-center gap-md px-md py-sm rounded-lg text-on-surface-variant hover:bg-surface-variant/50 transition-colors duration-200"
            to="#"
          >
            <span
              className="material-symbols-outlined text-xl"
              data-icon="assignment"
            >
              assignment
            </span>
            <span className="">Assessments</span>
          </Link>
          <Link
            className="flex items-center gap-md px-md py-sm rounded-lg text-on-surface-variant hover:bg-surface-variant/50 transition-colors duration-200"
            to="#"
          >
            <span
              className="material-symbols-outlined text-xl"
              data-icon="leaderboard"
            >
              leaderboard
            </span>
            <span className="">Leaderboard</span>
          </Link>
          <Link
            className="flex items-center gap-md px-md py-sm rounded-lg text-on-surface-variant hover:bg-surface-variant/50 transition-colors duration-200"
            to="#"
          >
            <span
              className="material-symbols-outlined text-xl"
              data-icon="stars"
            >
              stars
            </span>
            <span className="">Achievements</span>
          </Link>
        </nav>
        {/* Footer Links */}
        <div className="mt-auto pt-md border-t border-outline-variant/20 space-y-xs">
          <Link
            className="flex items-center gap-md px-md py-sm rounded-lg text-on-surface-variant hover:bg-surface-variant/50 transition-colors duration-200"
            to="#"
          >
            <span
              className="material-symbols-outlined text-xl"
              data-icon="person"
            >
              person
            </span>
            <span className="">Profile</span>
          </Link>
          <Link
            className="flex items-center gap-md px-md py-sm rounded-lg text-on-surface-variant hover:bg-surface-variant/50 transition-colors duration-200"
            to="#"
          >
            <span
              className="material-symbols-outlined text-xl"
              data-icon="settings"
            >
              settings
            </span>
            <span className="">Settings</span>
          </Link>
        </div>
      </aside>
      {/* Main Container */}
      <main className="flex-1 ml-0 md:ml-64 h-full flex flex-col xl:flex-row overflow-hidden relative">
        {/* Mobile Header Toggle */}
        <div className="md:hidden flex items-center justify-between p-md border-b border-outline-variant/30 glass-panel z-30 sticky top-0">
          <img src="/excode.svg" alt="excode logo" className="w-10 h-10" />
          <span className="font-headline-md text-headline-md font-bold text-primary">
            code
          </span>
          <button
            className="text-on-surface-variant hover:text-on-surface"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <span className="material-symbols-outlined" data-icon="menu">
              menu
            </span>
          </button>
        </div>
        {/* Center Content */}
        <section className="flex-1 h-full overflow-y-auto custom-scrollbar p-md lg:p-lg lg:pr-4 flex flex-col gap-lg">
          {/* Header & Search */}
          <header className="space-y-md">
            <div>
              <h1 className="font-headline-lg text-headline-lg font-bold tracking-tight mb-xs">
                Explore Challenges
              </h1>
              <p className="text-on-surface-variant text-body-md">
                Sharpen your skills with real-world scenarios and algorithmic
                puzzles.
              </p>
            </div>
            <div className="glass-panel rounded-xl p-xs flex flex-wrap lg:flex-nowrap items-center gap-sm">
              <div className="flex-1 relative min-w-[200px]">
                <span
                  className="material-symbols-outlined absolute left-sm top-1/2 -translate-y-1/2 text-on-surface-variant"
                  data-icon="search"
                >
                  search
                </span>
                <input
                  className="w-full bg-transparent border-none text-on-surface font-body-sm pl-xl py-sm focus:ring-0 placeholder:text-outline"
                  placeholder="Search challenges, technologies, concepts..."
                  type="text"
                />
              </div>
              <div className="w-px h-6 bg-outline-variant/50 hidden lg:block"></div>
              <button className="flex items-center gap-xs px-sm py-sm text-on-surface-variant hover:text-on-surface font-body-sm transition-colors">
                <span
                  className="material-symbols-outlined text-[18px]"
                  data-icon="filter_list"
                >
                  filter_list
                </span>
                Difficulty
              </button>
              <button className="flex items-center gap-xs px-sm py-sm text-on-surface-variant hover:text-on-surface font-body-sm transition-colors">
                <span
                  className="material-symbols-outlined text-[18px]"
                  data-icon="category"
                >
                  category
                </span>
                Category
              </button>
              <button className="flex items-center gap-xs px-sm py-sm text-on-surface-variant hover:text-on-surface font-body-sm transition-colors ml-auto">
                <span
                  className="material-symbols-outlined text-[18px]"
                  data-icon="sort"
                >
                  sort
                </span>
                Sort: Recommended
              </button>
            </div>
          </header>
          {/* Technology Tabs */}
          <div className="border-b border-outline-variant/30 pb-xs">
            <div className="flex gap-lg overflow-x-auto custom-scrollbar pb-sm">
              <button className="whitespace-nowrap font-body-sm font-medium text-primary border-b-2 border-primary pb-sm -mb-[5px]">
                All (1,240)
              </button>
              <button className="whitespace-nowrap font-body-sm text-on-surface-variant hover:text-on-surface pb-sm -mb-[5px] transition-colors">
                React{" "}
                <span className="text-xs bg-surface-variant px-1.5 py-0.5 rounded-full ml-1">
                  245
                </span>
              </button>
              <button className="whitespace-nowrap font-body-sm text-on-surface-variant hover:text-on-surface pb-sm -mb-[5px] transition-colors">
                Node.js{" "}
                <span className="text-xs bg-surface-variant px-1.5 py-0.5 rounded-full ml-1">
                  180
                </span>
              </button>
              <button className="whitespace-nowrap font-body-sm text-on-surface-variant hover:text-on-surface pb-sm -mb-[5px] transition-colors">
                TypeScript
              </button>
              <button className="whitespace-nowrap font-body-sm text-on-surface-variant hover:text-on-surface pb-sm -mb-[5px] transition-colors">
                Python
              </button>
              <button className="whitespace-nowrap font-body-sm text-on-surface-variant hover:text-on-surface pb-sm -mb-[5px] transition-colors">
                MongoDB{" "}
                <span className="text-xs bg-surface-variant px-1.5 py-0.5 rounded-full ml-1">
                  95
                </span>
              </button>
              <button className="whitespace-nowrap font-body-sm text-on-surface-variant hover:text-on-surface pb-sm -mb-[5px] transition-colors">
                System Design
              </button>
              <button className="whitespace-nowrap font-body-sm text-on-surface-variant hover:text-on-surface pb-sm -mb-[5px] transition-colors">
                AWS
              </button>
              <button className="whitespace-nowrap font-body-sm text-on-surface-variant hover:text-on-surface pb-sm -mb-[5px] transition-colors">
                Docker
              </button>
            </div>
          </div>
          {/* Subcategory Chips */}
          <div className="flex flex-wrap gap-xs">
            <span className="px-sm py-xs bg-secondary-container/30 text-on-secondary-container border border-secondary-container rounded-full font-label-caps text-label-caps cursor-pointer hover:bg-secondary-container/50 transition-colors">
              Interview Questions
            </span>
            <span className="px-sm py-xs bg-surface-variant text-on-surface-variant border border-outline-variant/30 rounded-full font-label-caps text-label-caps cursor-pointer hover:bg-surface-variant/80 transition-colors">
              Practical Scenarios
            </span>
            <span className="px-sm py-xs bg-surface-variant text-on-surface-variant border border-outline-variant/30 rounded-full font-label-caps text-label-caps cursor-pointer hover:bg-surface-variant/80 transition-colors">
              Debugging
            </span>
            <span className="px-sm py-xs bg-surface-variant text-on-surface-variant border border-outline-variant/30 rounded-full font-label-caps text-label-caps cursor-pointer hover:bg-surface-variant/80 transition-colors">
              Projects
            </span>
            <span className="px-sm py-xs bg-surface-variant text-on-surface-variant border border-outline-variant/30 rounded-full font-label-caps text-label-caps cursor-pointer hover:bg-surface-variant/80 transition-colors">
              Authentication
            </span>
            <span className="px-sm py-xs bg-surface-variant text-on-surface-variant border border-outline-variant/30 rounded-full font-label-caps text-label-caps cursor-pointer hover:bg-surface-variant/80 transition-colors">
              Performance
            </span>
          </div>
          {/* Challenge List */}
          <div className="space-y-sm flex-1">
            {/* Card 1 */}
            <div className="glass-panel rounded-xl p-md flex flex-col md:flex-row gap-md items-start md:items-center group hover:border-outline-variant/60 transition-all">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center border border-green-500/30">
                <span
                  className="material-symbols-outlined text-[18px] text-green-400"
                  data-icon="check"
                  data-weight="fill"
                >
                  check
                </span>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-sm mb-1">
                  <h3 className="font-body-md font-semibold text-on-surface group-hover:text-primary transition-colors">
                    React useEffect Infinite Loop
                  </h3>
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-green-500/10 text-green-400 border border-green-500/20">
                    Easy
                  </span>
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-primary/10 text-primary border border-primary/20">
                    React
                  </span>
                </div>
                <p className="font-body-sm text-on-surface-variant line-clamp-1">
                  Users report repeated API requests crashing the server. Fix
                  the dependency array in the main dashboard component.
                </p>
              </div>
              <div className="flex items-center gap-md font-code-sm text-on-surface-variant md:ml-auto w-full md:w-auto justify-between md:justify-end mt-sm md:mt-0">
                <div className="flex items-center gap-1">
                  <span
                    className="material-symbols-outlined text-[14px]"
                    data-icon="toll"
                  >
                    toll
                  </span>{" "}
                  50 XP
                </div>
                <div className="flex items-center gap-1">
                  <span
                    className="material-symbols-outlined text-[14px]"
                    data-icon="schedule"
                  >
                    schedule
                  </span>{" "}
                  10m
                </div>
                <div className="flex items-center gap-1">
                  <span
                    className="material-symbols-outlined text-[14px]"
                    data-icon="group"
                  >
                    group
                  </span>{" "}
                  82%
                </div>
                <button className="bg-surface-variant hover:bg-surface-bright text-on-surface px-sm py-xs rounded-lg font-body-sm font-medium transition-colors ml-sm border border-outline-variant/30">
                  Review
                </button>
              </div>
            </div>
            {/* Card 2 */}
            <div className="glass-panel rounded-xl p-md flex flex-col md:flex-row gap-md items-start md:items-center group hover:border-outline-variant/60 transition-all border-l-2 border-l-red-500/50">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-surface-variant flex items-center justify-center border border-outline-variant/30">
                <span className="w-2 h-2 rounded-full bg-outline"></span>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-sm mb-1">
                  <h3 className="font-body-md font-semibold text-on-surface group-hover:text-primary transition-colors">
                    Distributed Lock Implementation
                  </h3>
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-red-500/10 text-red-400 border border-red-500/20">
                    Hard
                  </span>
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-purple-500/10 text-purple-400 border border-purple-500/20">
                    Backend
                  </span>
                </div>
                <p className="font-body-sm text-on-surface-variant line-clamp-1">
                  Design a Redis-based distributed lock to prevent race
                  conditions in the microservices payment gateway.
                </p>
              </div>
              <div className="flex items-center gap-md font-code-sm text-on-surface-variant md:ml-auto w-full md:w-auto justify-between md:justify-end mt-sm md:mt-0">
                <div className="flex items-center gap-1">
                  <span
                    className="material-symbols-outlined text-[14px]"
                    data-icon="toll"
                  >
                    toll
                  </span>{" "}
                  250 XP
                </div>
                <div className="flex items-center gap-1">
                  <span
                    className="material-symbols-outlined text-[14px]"
                    data-icon="schedule"
                  >
                    schedule
                  </span>{" "}
                  45m
                </div>
                <div className="flex items-center gap-1">
                  <span
                    className="material-symbols-outlined text-[14px]"
                    data-icon="group"
                  >
                    group
                  </span>{" "}
                  12%
                </div>
                <button className="bg-primary hover:bg-primary-container text-on-primary font-body-sm font-medium px-sm py-xs rounded-lg transition-all glow-hover ml-sm">
                  Solve
                </button>
              </div>
            </div>
            {/* Card 3 */}
            <div className="glass-panel rounded-xl p-md flex flex-col md:flex-row gap-md items-start md:items-center group hover:border-outline-variant/60 transition-all border-l-2 border-l-amber-500/50">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-amber-500/10 flex items-center justify-center border border-amber-500/30">
                <span className="w-3 h-3 rounded-full bg-amber-500 animate-pulse"></span>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-sm mb-1">
                  <h3 className="font-body-md font-semibold text-on-surface group-hover:text-primary transition-colors">
                    Virtual DOM Diffing
                  </h3>
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-amber-500/10 text-amber-400 border border-amber-500/20">
                    Medium
                  </span>
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-blue-500/10 text-blue-400 border border-blue-500/20">
                    Frontend
                  </span>
                </div>
                <p className="font-body-sm text-on-surface-variant line-clamp-1">
                  Implement a simplified VDOM algorithm to efficiently update
                  the actual DOM structure without full re-renders.
                </p>
              </div>
              <div className="flex items-center gap-md font-code-sm text-on-surface-variant md:ml-auto w-full md:w-auto justify-between md:justify-end mt-sm md:mt-0">
                <div className="flex items-center gap-1">
                  <span
                    className="material-symbols-outlined text-[14px]"
                    data-icon="toll"
                  >
                    toll
                  </span>{" "}
                  100 XP
                </div>
                <div className="flex items-center gap-1">
                  <span
                    className="material-symbols-outlined text-[14px]"
                    data-icon="schedule"
                  >
                    schedule
                  </span>{" "}
                  30m
                </div>
                <button className="bg-surface-variant hover:bg-surface-bright text-on-surface px-sm py-xs rounded-lg font-body-sm font-medium transition-colors ml-sm border border-outline-variant/30 flex items-center gap-1">
                  Continue{" "}
                  <span
                    className="material-symbols-outlined text-[16px]"
                    data-icon="arrow_forward"
                  >
                    arrow_forward
                  </span>
                </button>
              </div>
            </div>
            {/* Card 4 */}
            <div className="glass-panel rounded-xl p-md flex flex-col md:flex-row gap-md items-start md:items-center opacity-60 bg-surface-container-highest/20">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-surface-variant flex items-center justify-center border border-outline-variant/30">
                <span
                  className="material-symbols-outlined text-[16px] text-outline"
                  data-icon="lock"
                >
                  lock
                </span>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-sm mb-1">
                  <h3 className="font-body-md font-semibold text-on-surface-variant">
                    Mastering K8s Ingress
                  </h3>
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-fuchsia-500/10 text-fuchsia-400 border border-fuchsia-500/20">
                    Expert
                  </span>
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-teal-500/10 text-teal-400 border border-teal-500/20">
                    DevOps
                  </span>
                </div>
                <p className="font-body-sm text-outline line-clamp-1">
                  Configure advanced routing rules and TLS termination for a
                  multi-tenant microservices cluster.
                </p>
              </div>
              <div className="flex items-center gap-md font-code-sm text-outline md:ml-auto w-full md:w-auto justify-between md:justify-end mt-sm md:mt-0">
                <div className="text-xs flex items-center gap-1">
                  <span
                    className="material-symbols-outlined text-[14px]"
                    data-icon="lock_clock"
                  >
                    lock_clock
                  </span>{" "}
                  Unlocks at Level 20
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* Right Sidebar */}
        <aside className="w-full xl:w-80 h-auto xl:h-full overflow-y-auto custom-scrollbar border-t xl:border-t-0 xl:border-l border-outline-variant/30 bg-surface-container-lowest p-md lg:p-lg flex flex-col gap-lg z-20">
          {/* Daily Challenge */}
          <div className="glass-panel rounded-xl p-md relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-50"></div>
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-sm">
                <h2 className="font-label-caps text-label-caps text-primary tracking-widest flex items-center gap-xs">
                  <span
                    className="material-symbols-outlined text-[16px]"
                    data-icon="today"
                  >
                    today
                  </span>{" "}
                  DAILY CHALLENGE
                </h2>
                <span className="font-code-sm text-on-surface-variant bg-surface-variant/80 px-2 py-0.5 rounded border border-outline-variant/30">
                  04:12:30
                </span>
              </div>
              <h3 className="font-body-lg font-bold text-on-surface leading-tight mb-xs group-hover:text-primary transition-colors">
                Fix Authentication Race Condition
              </h3>
              <p className="font-body-sm text-on-surface-variant mb-md">
                Prevent concurrent token refresh requests from logging users out
                unexpectedly.
              </p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-xs text-amber-400 font-code-sm font-semibold">
                  <span
                    className="material-symbols-outlined text-[16px]"
                    data-icon="toll"
                    data-weight="fill"
                  >
                    toll
                  </span>{" "}
                  120 XP
                </div>
                <button className="bg-primary hover:bg-primary-container text-on-primary font-body-sm font-medium px-md py-sm rounded-lg transition-all glow-hover">
                  Solve Now
                </button>
              </div>
            </div>
          </div>
          {/* Calendar Widget / Heatmap */}
          <div>
            <h3 className="font-body-md font-semibold text-on-surface mb-sm flex items-center gap-xs">
              <span
                className="material-symbols-outlined text-on-surface-variant text-[18px]"
                data-icon="calendar_month"
              >
                calendar_month
              </span>
              Activity
            </h3>
            <div className="glass-panel rounded-xl p-md">
              <div className="flex justify-between items-end mb-sm px-xs">
                <div className="flex gap-lg text-[10px] font-code-sm text-on-surface-variant uppercase tracking-wider">
                  <span className="">Sep</span>
                  <span className="">Oct</span>
                  <span className="">Nov</span>
                  <span className="">Dec</span>
                </div>
                <div className="text-[10px] font-code-sm text-primary font-semibold">
                  842 submissions this year
                </div>
              </div>
              <div className="grid grid-cols-7 gap-1 mb-md">{heatmapCells}</div>
              <div className="flex justify-end items-center text-[10px] font-code-sm text-on-surface-variant gap-xs">
                <span className="">Less</span>
                <div className="flex gap-1">
                  <div className="w-2 h-2 rounded-sm bg-surface-variant"></div>
                  <div className="w-2 h-2 rounded-sm bg-primary/30"></div>
                  <div className="w-2 h-2 rounded-sm bg-primary/60"></div>
                  <div className="w-2 h-2 rounded-sm bg-primary"></div>
                </div>
                <span className="">More</span>
              </div>
            </div>
          </div>
          {/* Weekly Competition */}
          <div>
            <h3 className="font-body-md font-semibold text-on-surface mb-sm flex items-center gap-xs">
              <span
                className="material-symbols-outlined text-on-surface-variant text-[18px]"
                data-icon="social_leaderboard"
              >
                social_leaderboard
              </span>
              Active Competition
            </h3>
            <div className="glass-panel rounded-xl p-md border border-primary/20 bg-gradient-to-b from-surface-container to-surface">
              <h4 className="font-body-md font-bold text-on-surface mb-1">
                System Design Sprint
              </h4>
              <div className="flex justify-between items-center mb-md font-code-sm">
                <span className="text-primary font-semibold">Rank: #42</span>
                <span className="text-on-surface-variant">2d 14h left</span>
              </div>
              <div className="flex gap-xs mb-md">
                <span className="bg-green-500/10 text-green-400 border border-green-500/20 text-[10px] uppercase font-bold tracking-wider px-2 py-1 rounded">
                  Pool: $500
                </span>
                <span className="bg-surface-variant text-on-surface-variant border border-outline-variant/30 text-[10px] uppercase font-bold tracking-wider px-2 py-1 rounded">
                  Top 100
                </span>
              </div>
              <button className="w-full bg-surface-variant hover:bg-surface-bright text-on-surface font-body-sm font-medium py-sm rounded-lg transition-colors border border-outline-variant/30">
                View Details
              </button>
            </div>
          </div>
          {/* Trending */}
          <div>
            <h3 className="font-body-md font-semibold text-on-surface mb-sm flex items-center gap-xs">
              <span
                className="material-symbols-outlined text-on-surface-variant text-[18px]"
                data-icon="trending_up"
              >
                trending_up
              </span>
              Trending Technologies
            </h3>
            <div className="glass-panel rounded-xl p-xs">
              <div className="flex items-center justify-between p-sm hover:bg-surface-variant/50 rounded-lg transition-colors cursor-pointer">
                <div className="flex items-center gap-sm">
                  <span className="font-code-sm text-outline w-4">1</span>
                  <span className="font-body-sm text-on-surface">React</span>
                </div>
                <span className="font-code-sm text-green-400 flex items-center text-[10px]">
                  <span
                    className="material-symbols-outlined text-[12px]"
                    data-icon="arrow_upward"
                  >
                    arrow_upward
                  </span>{" "}
                  12%
                </span>
              </div>
              <div className="flex items-center justify-between p-sm hover:bg-surface-variant/50 rounded-lg transition-colors cursor-pointer">
                <div className="flex items-center gap-sm">
                  <span className="font-code-sm text-outline w-4">2</span>
                  <span className="font-body-sm text-on-surface">Node.js</span>
                </div>
                <span className="font-code-sm text-green-400 flex items-center text-[10px]">
                  <span
                    className="material-symbols-outlined text-[12px]"
                    data-icon="arrow_upward"
                  >
                    arrow_upward
                  </span>{" "}
                  8%
                </span>
              </div>
              <div className="flex items-center justify-between p-sm hover:bg-surface-variant/50 rounded-lg transition-colors cursor-pointer">
                <div className="flex items-center gap-sm">
                  <span className="font-code-sm text-outline w-4">3</span>
                  <span className="font-body-sm text-on-surface">
                    TypeScript
                  </span>
                </div>
                <span className="font-code-sm text-green-400 flex items-center text-[10px]">
                  <span
                    className="material-symbols-outlined text-[12px]"
                    data-icon="arrow_upward"
                  >
                    arrow_upward
                  </span>{" "}
                  15%
                </span>
              </div>
            </div>
          </div>
        </aside>
      </main>
    </div>
  );
};

export default ProblemsExplorer;
