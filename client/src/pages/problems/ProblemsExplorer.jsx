import React, { useState } from "react";
import Sidebar from "./components/Sidebar";
import RightSidebar from "./components/RightSidebar";
import ProblemCard from "./components/ProblemCard";
import { mockProblems, technologies, categories } from "./mockData";

const ProblemsExplorer = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTech, setActiveTech] = useState("All");
  const [activeCategory, setActiveCategory] = useState(null);

  const [heatmapCells] = useState(() => {
    const daysInMonth = 28;
    const intensityClasses = [
      "bg-surface-variant border border-outline-variant/10",
      "bg-primary/30 border border-primary/20",
      "bg-primary/60 border border-primary/40",
      "bg-primary border border-primary/80 glow-hover",
    ];

    return Array.from({ length: daysInMonth }).map((_, i) => {
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
  });

  // Filtering Logic
  const filteredProblems = mockProblems.filter((p) => {
    // Technology filter
    if (activeTech !== "All" && p.technology !== activeTech) return false;
    
    // Category filter
    if (activeCategory && p.category !== activeCategory) return false;
    
    // Search filter
    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      return (
        p.title.toLowerCase().includes(lowerQuery) ||
        p.description.toLowerCase().includes(lowerQuery) ||
        p.technology.toLowerCase().includes(lowerQuery)
      );
    }
    
    return true;
  });

  return (
    <div className="bg-background text-on-surface font-body-md h-screen overflow-hidden flex selection:bg-primary-container selection:text-on-primary-container">
      {/* Left Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Main Container */}
      <main className="flex-1 ml-0 md:ml-64 h-full flex flex-col xl:flex-row overflow-hidden relative">
        {/* Mobile Header Toggle */}
        <div className="md:hidden flex items-center justify-between p-md border-b border-outline-variant/30 glass-panel z-30 sticky top-0">
          <div className="flex items-center gap-2">
            <img src="/excode.svg" alt="excode logo" className="w-8 h-8" />
            <span className="font-headline-md text-headline-md font-bold text-primary">
              Excode
            </span>
          </div>
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
                >
                  search
                </span>
                <input
                  className="w-full bg-transparent border-none text-on-surface font-body-sm pl-xl py-sm focus:ring-0 placeholder:text-outline outline-none"
                  placeholder="Search challenges, technologies, concepts..."
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="w-px h-6 bg-outline-variant/50 hidden lg:block"></div>
              <button className="flex items-center gap-xs px-sm py-sm text-on-surface-variant hover:text-on-surface font-body-sm transition-colors">
                <span className="material-symbols-outlined text-[18px]">
                  filter_list
                </span>
                Difficulty
              </button>
              <button className="flex items-center gap-xs px-sm py-sm text-on-surface-variant hover:text-on-surface font-body-sm transition-colors">
                <span className="material-symbols-outlined text-[18px]">
                  category
                </span>
                Category
              </button>
              <button className="flex items-center gap-xs px-sm py-sm text-on-surface-variant hover:text-on-surface font-body-sm transition-colors ml-auto">
                <span className="material-symbols-outlined text-[18px]">
                  sort
                </span>
                Sort: Recommended
              </button>
            </div>
          </header>

          {/* Technology Tabs */}
          <div className="border-b border-outline-variant/30 pb-xs">
            <div className="flex gap-lg overflow-x-auto custom-scrollbar pb-sm">
              <button 
                onClick={() => setActiveTech("All")}
                className={`whitespace-nowrap font-body-sm pb-sm -mb-[5px] transition-colors ${
                  activeTech === "All" ? "font-medium text-primary border-b-2 border-primary" : "text-on-surface-variant hover:text-on-surface"
                }`}
              >
                All ({mockProblems.length})
              </button>
              {technologies.map((tech) => {
                const count = mockProblems.filter(p => p.technology === tech).length;
                return (
                  <button
                    key={tech}
                    onClick={() => setActiveTech(tech)}
                    className={`whitespace-nowrap font-body-sm pb-sm -mb-[5px] transition-colors flex items-center ${
                      activeTech === tech ? "font-medium text-primary border-b-2 border-primary" : "text-on-surface-variant hover:text-on-surface"
                    }`}
                  >
                    {tech}
                    {count > 0 && (
                      <span className="text-xs bg-surface-variant px-1.5 py-0.5 rounded-full ml-1">
                        {count}
                      </span>
                    )}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Subcategory Chips */}
          <div className="flex flex-wrap gap-xs">
            {categories.map((cat) => (
              <span
                key={cat}
                onClick={() => setActiveCategory(activeCategory === cat ? null : cat)}
                className={`px-sm py-xs rounded-full font-label-caps text-label-caps cursor-pointer transition-colors border ${
                  activeCategory === cat
                    ? "bg-secondary-container/30 text-on-secondary-container border-secondary-container hover:bg-secondary-container/50"
                    : "bg-surface-variant text-on-surface-variant border-outline-variant/30 hover:bg-surface-variant/80"
                }`}
              >
                {cat}
              </span>
            ))}
          </div>

          {/* Challenge List */}
          <div className="space-y-sm flex-1">
            {filteredProblems.length > 0 ? (
              filteredProblems.map((problem) => (
                <ProblemCard key={problem.id} problem={problem} />
              ))
            ) : (
              <div className="w-full py-10 flex flex-col items-center justify-center text-on-surface-variant">
                <span className="material-symbols-outlined text-4xl mb-2 opacity-50">search_off</span>
                <p>No challenges found matching your criteria.</p>
                <button 
                  onClick={() => {
                    setSearchQuery("");
                    setActiveTech("All");
                    setActiveCategory(null);
                  }}
                  className="mt-4 text-primary hover:underline text-sm font-medium"
                >
                  Clear filters
                </button>
              </div>
            )}
          </div>
        </section>

        {/* Right Sidebar */}
        <RightSidebar heatmapCells={heatmapCells} />
      </main>
    </div>
  );
};

export default ProblemsExplorer;
