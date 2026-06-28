import React, { useState, useEffect, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ShareProfileModal from "./components/ShareProfileModal";
import ClaimUsernameModal from "./components/ClaimUsernameModal";
import Sidebar from "../problems/components/Sidebar";
import { useAuth } from "../../context/AuthContext";

const Profile = () => {
  const { username } = useParams();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { backendUser, setBackendUser, logout } = useAuth();
  const navigate = useNavigate();
  
  const isPublicView = !!username;
  const isOwnProfile = !isPublicView || (backendUser && backendUser.username === username);

  const [profileUser, setProfileUser] = useState(null);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [claimModalOpen, setClaimModalOpen] = useState(false);

  
  const [stats, setStats] = useState({
    totalSolved: 0,
    easySolved: 0,
    mediumSolved: 0,
    hardSolved: 0,
    totalProblems: 100,
    totalEasy: 30,
    totalMedium: 50,
    totalHard: 20,
    totalXP: 0,
    streak: 0,
    submissionDates: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        if (isPublicView && !isOwnProfile) {
          const res = await fetch(`http://localhost:3000/api/submissions/stats/public/${username}`);
          if (res.ok) {
            const data = await res.json();
            setStats(data);
            setProfileUser(data.user);
          } else {
            navigate('/profile'); // Redirect if not found
          }
        } else {
          const token = localStorage.getItem('token');
          if (!token) {
             navigate('/login');
             return;
          }
          const res = await fetch("http://localhost:3000/api/submissions/stats/profile", {
            headers: { Authorization: `Bearer ${token}` }
          });
          if (res.ok) {
            const data = await res.json();
            setStats(data);
            setProfileUser(backendUser);
          } else if (res.status === 401) {
            await logout();
            navigate('/login');
            return;
          }
        }
      } catch (error) {
        console.error("Failed to fetch stats", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [username, isOwnProfile, backendUser, navigate, isPublicView, logout]);

  const userAvatar = profileUser?.avatar || "https://lh3.googleusercontent.com/aida-public/AB6AXuCGADYytPStVTJfvVJ7-r1HPmvChtPTBqtJ8kssRepjEFW4k8ZlEor_RDkgeRNfSnFXD4NYGE2SgZFbaUr7K04SDw6X2mmKK8OUHjLHr4aloHIBRx9uDPFPnMlt4Z89Kz1Q7tNWknfFi8ovDjbi7Ue4FYruoRXkbbLFCDdnY17F5XPCuRmulDw4A35UHDBJQfucDQbI2Znypasd6tblESxuB3oqrn5SJwaCWSG9iQxMhV46YjbJmGkWRJh7CDhDOtdIfC7lcU9lDXaj";

  // Generate dynamic heatmap data for Calendar Year
  const { heatmapData, monthLabels } = useMemo(() => {
    const dateCounts = {};
    // Ensure we parse dates in local timezone
    stats.submissionDates.forEach(dStr => {
      // Create date from ISO string and format to YYYY-MM-DD in local time
      const dateObj = new Date(dStr);
      const localStr = `${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(2, '0')}-${String(dateObj.getDate()).padStart(2, '0')}`;
      dateCounts[localStr] = (dateCounts[localStr] || 0) + 1;
    });

    const grid = [];
    const today = new Date();
    today.setHours(0,0,0,0);
    const currentYear = today.getFullYear();
    
    // Start of the year
    const jan1 = new Date(currentYear, 0, 1);
    // Find the Sunday before or exactly on Jan 1
    const startDate = new Date(jan1);
    startDate.setDate(jan1.getDate() - jan1.getDay());

    // End of the year
    const dec31 = new Date(currentYear, 11, 31);

    let currDate = new Date(startDate);
    const months = []; 
    let currentMonth = -1;
    let weeksInCurrentMonth = 0;

    while (currDate <= dec31 || currDate.getDay() !== 0) {
      if (currDate.getDay() === 0) {
        grid.push([]);
        
        // Track months for labels based on the Thursday of the week
        const thursday = new Date(currDate);
        thursday.setDate(thursday.getDate() + 4);
        if (thursday.getFullYear() === currentYear) {
          const month = thursday.getMonth();
          if (month !== currentMonth) {
            if (currentMonth !== -1) {
              months.push({ name: new Date(currentYear, currentMonth, 1).toLocaleString('default', { month: 'short' }), weeks: weeksInCurrentMonth });
            }
            currentMonth = month;
            weeksInCurrentMonth = 1;
          } else {
            weeksInCurrentMonth++;
          }
        }
      }

      const weekArr = grid[grid.length - 1];
      
      // If outside the current year, it's invisible padding
      if (currDate.getFullYear() !== currentYear) {
        weekArr.push({ level: -1, count: 0, date: '' });
      } 
      // If inside the current year but in the future
      else if (currDate > today) {
        const dStr = `${currDate.getFullYear()}-${String(currDate.getMonth() + 1).padStart(2, '0')}-${String(currDate.getDate()).padStart(2, '0')}`;
        weekArr.push({ level: 0, count: 0, date: dStr }); // Empty dark box
      } 
      // Past or present valid dates
      else {
        const dStr = `${currDate.getFullYear()}-${String(currDate.getMonth() + 1).padStart(2, '0')}-${String(currDate.getDate()).padStart(2, '0')}`;
        const count = dateCounts[dStr] || 0;
        let level = 0;
        if (count > 0) level = 1;
        if (count > 2) level = 2;
        if (count > 4) level = 3;
        if (count > 6) level = 4;
        weekArr.push({ level, count, date: dStr });
      }
      
      currDate.setDate(currDate.getDate() + 1);
    }

    if (currentMonth !== -1) {
      months.push({ name: new Date(currentYear, currentMonth, 1).toLocaleString('default', { month: 'short' }), weeks: weeksInCurrentMonth });
    }

    return { heatmapData: grid, monthLabels: months };
  }, [stats.submissionDates]);

  // Calculate the SVG circle offset based on percentage of total questions solved
  const progressPercentage = Math.min(1, stats.totalSolved / Math.max(1, stats.totalProblems));
  const strokeDashoffset = 289 - (progressPercentage * 289);

  const getHeatmapColor = (level) => {
    switch (level) {
      case 4: return "bg-[#3B82F6] shadow-[0_0_5px_#3B82F6]";
      case 3: return "bg-[#3B82F6]/80";
      case 2: return "bg-[#3B82F6]/60";
      case 1: return "bg-[#3B82F6]/30";
      case -1: return "opacity-0 pointer-events-none";
      case 0:
      default: return "bg-[#181c24]";
    }
  };

  return (
    <div className="bg-background text-on-surface font-inter h-screen overflow-hidden flex selection:bg-primary-container selection:text-on-primary-container">
      {/* Left Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Main Container */}
      <main className="flex-1 ml-0 md:ml-64 h-full flex flex-col overflow-hidden relative">
        {/* Mobile Header Toggle */}
        <div className="md:hidden flex items-center justify-between p-4 border-b border-outline-variant/30 bg-surface-container/40 backdrop-blur-md z-30 sticky top-0">
          <div className="flex items-center gap-2">
            <img src="/excode.svg" alt="excode logo" className="w-8 h-8" />
            <span className="font-geist text-2xl font-bold text-primary tracking-tight">
              DevArena
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
        <section className="flex-1 h-full overflow-y-auto custom-scrollbar p-6 lg:p-8 pb-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-[1280px] mx-auto">
            
            {/* Left Sidebar: Profile Details (Col Span 3) */}
            <aside className="lg:col-span-3 space-y-6">
              
              {/* Avatar Card */}
              <div 
                className="rounded-xl p-6 flex flex-col items-center text-center border border-white/10"
                style={{ background: 'rgba(17, 24, 39, 0.4)', backdropFilter: 'blur(12px)' }}
              >
                <div className="relative w-32 h-32 mb-4">
                  <img 
                    alt="User Avatar" 
                    className="w-full h-full rounded-full object-cover border-4 border-surface-container shadow-xl" 
                    src={userAvatar}
                  />
                  <div className="absolute bottom-0 right-0 bg-primary text-on-primary rounded-full w-8 h-8 flex items-center justify-center font-jetbrains text-sm font-semibold border-2 border-background shadow-lg">
                    99
                  </div>
                </div>
                <h1 className="text-2xl font-geist font-semibold text-on-surface">{profileUser?.name || "Developer"}</h1>
                <p className="text-on-surface-variant text-sm font-inter mb-4">@{profileUser?.username || profileUser?.name?.toLowerCase().replace(/\s/g, '_')}</p>
                <div className="inline-block bg-primary-container/10 text-primary px-2 py-1 rounded-full font-jetbrains text-xs uppercase tracking-wider border border-primary/20 mb-6">
                  Staff Engineer
                </div>
                
                <div className="w-full flex gap-2 mb-6">
                  {isOwnProfile ? (
                    <button 
                      onClick={() => backendUser?.username ? setShareModalOpen(true) : setClaimModalOpen(true)}
                      className="flex-1 bg-primary text-on-primary px-4 py-2 rounded-lg hover:shadow-[0_0_15px_rgba(77,142,255,0.3)] hover:-translate-y-0.5 transition-all text-sm font-inter font-semibold flex items-center justify-center gap-2">
                      <span className="material-symbols-outlined text-sm">share</span>
                      {backendUser?.username ? "Share Profile" : "Claim Username"}
                    </button>
                  ) : (
                    <>
                      <button className="flex-1 bg-primary text-on-primary px-4 py-2 rounded-lg hover:shadow-[0_0_15px_rgba(77,142,255,0.3)] hover:-translate-y-0.5 transition-all text-sm font-inter font-semibold">
                        Follow
                      </button>
                      <button className="px-4 py-2 rounded-lg border border-outline-variant hover:border-primary transition-colors flex items-center justify-center">
                        <span className="material-symbols-outlined text-on-surface-variant">mail</span>
                      </button>
                    </>
                  )}
                </div>
                
                <div className="w-full text-left space-y-2 text-sm font-inter text-on-surface-variant">
                  {!isPublicView && backendUser?.email && (
                    <div className="flex items-center gap-2 max-w-full">
                      <span className="material-symbols-outlined text-[18px] shrink-0">mail</span> 
                      <div className="overflow-x-auto whitespace-nowrap custom-scrollbar pb-1">
                        <span>{backendUser.email}</span>
                      </div>
                    </div>
                  )}
                  <div className="flex items-center gap-2 max-w-full">
                    <span className="material-symbols-outlined text-[18px] shrink-0">link</span> 
                    <div className="overflow-x-auto whitespace-nowrap custom-scrollbar pb-1">
                      <a className="text-primary hover:underline" href={`https://github.com/${backendUser?.name?.toLowerCase().replace(/\s/g, '') || "guest"}`} target="_blank" rel="noopener noreferrer">
                        github.com/{backendUser?.name?.toLowerCase().replace(/\s/g, '') || "guest"}
                      </a>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px]">calendar_month</span> Joined {new Date(profileUser?.createdAt || "2023-01-01").toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                  </div>
                </div>
              </div>
              
              {/* Stats Card */}
              <div 
                className="rounded-xl p-6 border border-white/10"
                style={{ background: 'rgba(17, 24, 39, 0.4)', backdropFilter: 'blur(12px)' }}
              >
                <h2 className="text-xl font-geist font-semibold text-on-surface mb-4">Stats Overview</h2>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm font-inter mb-1">
                      <span className="text-on-surface-variant">Global Rank</span>
                      <span className="text-primary font-jetbrains font-semibold drop-shadow-[0_0_10px_rgba(173,198,255,0.5)]">
                        #{stats.totalSolved > 0 ? 1 : (stats.totalUsers || 1)} <span className="text-on-surface-variant text-xs font-inter ml-1">/ {stats.totalUsers || 1} users</span>
                      </span>
                    </div>
                    <div className="h-1 bg-surface-container-highest rounded-full overflow-hidden">
                      <div className="h-full bg-primary shadow-[0_0_8px_rgba(173,198,255,0.5)]" style={{ width: `${stats.totalProblems > 0 ? (stats.totalSolved / stats.totalProblems) * 100 : 0}%` }}></div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 pt-2">
                    <div className="bg-surface-container p-2 rounded-lg border border-outline-variant/30 text-center">
                      <span className="block font-jetbrains text-xs uppercase tracking-wider text-on-surface-variant mb-1">Streak</span>
                      <span className="flex items-center justify-center gap-1 text-2xl font-geist font-semibold text-on-surface">
                        <span className="material-symbols-outlined text-error text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>local_fire_department</span> {stats.streak}
                      </span>
                    </div>
                    <div className="bg-surface-container p-2 rounded-lg border border-outline-variant/30 text-center">
                      <span className="block font-jetbrains text-xs uppercase tracking-wider text-on-surface-variant mb-1">Total XP</span>
                      <span className="block text-2xl font-geist font-semibold text-on-surface">{stats.totalXP}</span>
                    </div>
                  </div>
                </div>
              </div>
            </aside>

            {/* Main Content Area (Col Span 9) */}
            <div className="lg:col-span-9 space-y-8">
              
              {/* Activity Heatmap */}
              <div 
                className="rounded-xl p-6 border border-primary/20 shadow-[0_0_15px_rgba(173,198,255,0.1)] transition-colors hover:border-primary/40"
                style={{ background: 'rgba(17, 24, 39, 0.4)', backdropFilter: 'blur(12px)' }}
              >
                <div className="flex justify-between items-end mb-6">
                  <div>
                    <h2 className="text-2xl font-geist font-semibold text-on-surface tracking-tight">Activity</h2>
                    <p className="text-on-surface-variant text-sm font-inter mt-1">{stats.totalSolved} problems solved in the last year</p>
                  </div>
                  <div className="hidden sm:flex items-center gap-2 text-sm font-inter text-on-surface-variant">
                    <span>Less</span>
                    <div className="flex gap-[2px]">
                      <div className={`w-3 h-3 rounded-[2px] ${getHeatmapColor(0)}`}></div>
                      <div className={`w-3 h-3 rounded-[2px] ${getHeatmapColor(1)}`}></div>
                      <div className={`w-3 h-3 rounded-[2px] ${getHeatmapColor(2)}`}></div>
                      <div className={`w-3 h-3 rounded-[2px] ${getHeatmapColor(3)}`}></div>
                      <div className={`w-3 h-3 rounded-[2px] ${getHeatmapColor(4)}`}></div>
                    </div>
                    <span>More</span>
                  </div>
                </div>
                <div className="overflow-x-auto pb-2 custom-scrollbar">
                  <div className="min-w-max">
                    {/* Month Labels */}
                    <div className="flex text-xs font-inter text-on-surface-variant mb-2 ml-8">
                      {monthLabels.map((monthObj, i) => (
                        <div key={`${monthObj.name}-${i}`} style={{ width: `${monthObj.weeks * 15}px` }}>
                          {monthObj.name}
                        </div>
                      ))}
                    </div>
                    
                    <div className="flex gap-2">
                      {/* Day Labels */}
                      <div className="flex flex-col gap-[3px] text-[10px] font-inter text-on-surface-variant">
                        <div className="h-3 flex items-center"></div>
                        <div className="h-3 flex items-center">Mon</div>
                        <div className="h-3 flex items-center"></div>
                        <div className="h-3 flex items-center">Wed</div>
                        <div className="h-3 flex items-center"></div>
                        <div className="h-3 flex items-center">Fri</div>
                        <div className="h-3 flex items-center"></div>
                      </div>

                      {/* Heatmap Grid */}
                      <div className="inline-flex gap-[3px]">
                        {heatmapData.map((week, wIndex) => (
                          <div key={wIndex} className="flex flex-col gap-[3px]">
                            {week.map((cell, dIndex) => (
                              <div 
                                key={`${wIndex}-${dIndex}`}
                                className={`w-3 h-3 rounded-[2px] transition-transform ${cell.level !== -1 ? 'hover:scale-125 cursor-pointer z-0 hover:z-10' : ''} ${getHeatmapColor(cell.level)}`}
                                title={cell.level === -1 ? '' : cell.level === 0 && cell.date > new Date().toISOString().split('T')[0] ? `Future date: ${new Date(cell.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}` : `${cell.count} submissions on ${cell.date ? new Date(cell.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : ''}`}
                              ></div>
                            ))}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bento Grid: Problem Solving & Achievements */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Problem Solving Stats */}
                <div 
                  className="rounded-xl p-6 flex flex-col border border-white/10"
                  style={{ background: 'rgba(17, 24, 39, 0.4)', backdropFilter: 'blur(12px)' }}
                >
                  <h3 className="text-xl font-geist font-semibold text-on-surface mb-4">Problem Solving</h3>
                  <div className="flex-grow flex items-center justify-center py-4 relative">
                    {/* Circular Progress SVG */}
                    <div className="relative w-40 h-40 flex items-center justify-center rounded-full border-8 border-surface-container">
                      <svg className="absolute top-0 left-0 w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" fill="transparent" r="46" stroke="rgba(77, 142, 255, 0.1)" strokeWidth="8"></circle>
                        <circle 
                          className="transition-all duration-1000 ease-out" 
                          cx="50" cy="50" fill="transparent" r="46" stroke="#4d8eff" 
                          strokeDasharray="289" strokeDashoffset={strokeDashoffset} strokeWidth="8"
                          style={{ filter: 'drop-shadow(0px 0px 4px rgba(77, 142, 255, 0.5))' }}
                        ></circle>
                      </svg>
                      <div className="text-center mt-2">
                        <span className="block text-3xl font-geist font-bold text-on-surface leading-none mb-1">{stats.totalSolved}</span>
                        <span className="block font-jetbrains text-[10px] uppercase tracking-wider text-on-surface-variant mb-1">Solved</span>
                        <span className="block text-xs font-inter text-on-surface-variant">out of {stats.totalProblems}</span>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2 mt-auto pt-4 border-t border-outline-variant/20">
                    <div className="flex justify-between items-center text-sm font-inter">
                      <span className="text-[#10B981] font-semibold">Easy</span>
                      <span className="text-on-surface font-jetbrains">{stats.easySolved} <span className="text-on-surface-variant text-xs ml-1">/ {stats.totalEasy}</span></span>
                    </div>
                    <div className="flex justify-between items-center text-sm font-inter">
                      <span className="text-[#F59E0B] font-semibold">Medium</span>
                      <span className="text-on-surface font-jetbrains">{stats.mediumSolved} <span className="text-on-surface-variant text-xs ml-1">/ {stats.totalMedium}</span></span>
                    </div>
                    <div className="flex justify-between items-center text-sm font-inter">
                      <span className="text-[#EF4444] font-semibold">Hard</span>
                      <span className="text-on-surface font-jetbrains">{stats.hardSolved} <span className="text-on-surface-variant text-xs ml-1">/ {stats.totalHard}</span></span>
                    </div>
                  </div>
                </div>

                {/* Recent Achievements Grid */}
                <div 
                  className="rounded-xl p-6 border border-white/10"
                  style={{ background: 'rgba(17, 24, 39, 0.4)', backdropFilter: 'blur(12px)' }}
                >
                  <div className="flex justify-between items-center mb-1">
                    <h3 className="text-xl font-geist font-semibold text-on-surface">Badges</h3>
                    <a className="text-primary text-sm font-inter hover:underline" href="#">View All</a>
                  </div>
                  <p className="text-xs text-on-surface-variant italic mb-4">* Future dynamic logic required</p>
                  <div className="grid grid-cols-2 gap-2">
                    
                    {/* Badge 1 */}
                    <div className="bg-gradient-to-br from-surface-container to-surface-container-lowest p-4 rounded-lg border border-outline-variant/30 flex flex-col items-center text-center relative overflow-hidden group hover:border-outline-variant transition-colors">
                      <div className="absolute inset-0 bg-gradient-to-br from-[#FCD34D]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      <span className="material-symbols-outlined text-[40px] text-[#FCD34D] mb-2 drop-shadow-[0_0_8px_rgba(252,211,77,0.5)]" style={{ fontVariationSettings: "'FILL' 1" }}>emoji_events</span>
                      <span className="text-sm font-inter text-on-surface font-semibold">Bug Slayer</span>
                      <span className="font-jetbrains text-[10px] uppercase tracking-wider text-on-surface-variant mt-1">Lvl 5</span>
                    </div>
                    
                    {/* Badge 2 */}
                    <div className="bg-gradient-to-br from-surface-container to-surface-container-lowest p-4 rounded-lg border border-outline-variant/30 flex flex-col items-center text-center relative overflow-hidden group hover:border-outline-variant transition-colors">
                      <div className="absolute inset-0 bg-gradient-to-br from-[#10B981]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      <span className="material-symbols-outlined text-[40px] text-[#10B981] mb-2 drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]" style={{ fontVariationSettings: "'FILL' 1" }}>bolt</span>
                      <span className="text-sm font-inter text-on-surface font-semibold">Speed Demon</span>
                      <span className="font-jetbrains text-[10px] uppercase tracking-wider text-on-surface-variant mt-1">Lvl 3</span>
                    </div>
                    
                    {/* Badge 3 */}
                    <div className="bg-gradient-to-br from-surface-container to-surface-container-lowest p-4 rounded-lg border border-outline-variant/30 flex flex-col items-center text-center relative overflow-hidden group hover:border-outline-variant transition-colors">
                      <div className="absolute inset-0 bg-gradient-to-br from-[#8B5CF6]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      <span className="material-symbols-outlined text-[40px] text-[#8B5CF6] mb-2 drop-shadow-[0_0_8px_rgba(139,92,246,0.5)]" style={{ fontVariationSettings: "'FILL' 1" }}>military_tech</span>
                      <span className="text-sm font-inter text-on-surface font-semibold">DP Master</span>
                      <span className="font-jetbrains text-[10px] uppercase tracking-wider text-on-surface-variant mt-1">Lvl 2</span>
                    </div>
                    
                    {/* Badge 4 (Locked) */}
                    <div className="bg-gradient-to-br from-surface-container to-surface-container-lowest p-4 rounded-lg border border-outline-variant/30 flex flex-col items-center text-center relative overflow-hidden group grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all cursor-pointer">
                      <span className="material-symbols-outlined text-[40px] text-surface-variant mb-2">lock</span>
                      <span className="text-sm font-inter text-on-surface font-semibold">Graph Guru</span>
                      <span className="font-jetbrains text-[10px] uppercase tracking-wider text-on-surface-variant mt-1">Locked</span>
                    </div>
                    
                  </div>
                </div>

              </div>

            </div>
          </div>
        </section>
      </main>

      {shareModalOpen && <ShareProfileModal username={backendUser?.username} onClose={() => setShareModalOpen(false)} />}
      {claimModalOpen && <ClaimUsernameModal backendUser={backendUser} setBackendUser={setBackendUser} onClose={() => setClaimModalOpen(false)} />}
    </div>
  );
};

export default Profile;
