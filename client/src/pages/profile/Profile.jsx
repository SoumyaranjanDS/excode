import React, { useState } from "react";
import Sidebar from "../problems/components/Sidebar";
import { useAuth } from "../../context/AuthContext";

const Profile = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { backendUser } = useAuth();

  const userAvatar = backendUser?.avatar || "https://lh3.googleusercontent.com/aida-public/AB6AXuAgIGP3kJBWkWCRd_1qtVQSDRKnCJEu9Jx6Hu-qyKQ7_1v1BRL9FkODk-3Qgs1m-ytPBzg0CtZ_BTQ7OT36VRUyZfuH9yiBuOI0NaLnoEF1dvCchH3xp9xtFkxj1661CAVrOh-yFjY03vq4ImNKJkosfwjT8aS2XPGuaewhDcdO_kWAlSxZ0x1e7hoIBJywTT7I6ZSjW2AzcL0RoBu1kRe3TNcuYw6v-o6ejZrthvu3stRES6oLALVKeTXRv9j4Ht-QhuLV80KB-FGV";

  return (
    <div className="bg-background text-on-surface font-body-md h-screen overflow-hidden flex selection:bg-primary-container selection:text-on-primary-container">
      {/* Left Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Main Container */}
      <main className="flex-1 ml-0 md:ml-64 h-full flex flex-col overflow-hidden relative">
        {/* Mobile Header Toggle */}
        <div className="md:hidden flex items-center justify-between p-md border-b border-outline-variant/30 glass-panel z-30 sticky top-0">
          <div className="flex items-center gap-2">
            <img src="/excode.svg" alt="excode logo" className="w-8 h-8" />
            <span className="font-headline-md text-headline-md font-bold text-primary tracking-tight">
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
        <section className="flex-1 h-full overflow-y-auto custom-scrollbar p-md lg:p-lg pb-24">
          <div className="grid grid-cols-12 gap-lg max-w-[1280px] mx-auto">
            
            {/* Left Column: Profile Header (Col Span 3) */}
            <aside className="col-span-12 lg:col-span-3 space-y-md">
              <div className="glass-panel rounded-xl p-lg flex flex-col items-center text-center shadow-lg border border-outline-variant/20">
                <div className="relative mb-md group">
                  <img 
                    className="w-32 h-32 rounded-full object-cover border-2 border-primary/30 p-1 group-hover:border-primary transition-colors duration-300" 
                    alt="User Profile" 
                    src={userAvatar}
                  />
                  <div className="absolute bottom-1 right-3 w-4 h-4 bg-[#4ade80] border-2 border-surface-container rounded-full" title="Online"></div>
                </div>
                
                <h2 className="font-geist text-2xl font-bold text-on-surface mb-1 tracking-tight">
                  {backendUser?.name || "Guest Developer"}
                </h2>
                <p className="font-jetbrains text-xs text-primary mb-5">Full Stack MERN Developer</p>
                
                <div className="flex items-center gap-2 text-on-surface-variant font-inter text-sm mb-2">
                  <span className="material-symbols-outlined text-sm">location_on</span>
                  Bengaluru, India
                </div>
                <div className="flex items-center gap-2 text-on-surface-variant font-inter text-sm mb-6">
                  <span className="material-symbols-outlined text-sm">calendar_month</span>
                  Joined Mar 2026
                </div>

                {/* Social Links */}
                <div className="flex items-center justify-center gap-4 mb-6 w-full">
                  <button className="w-10 h-10 rounded-full bg-surface-variant flex items-center justify-center text-on-surface-variant hover:text-primary hover:bg-primary/10 transition-colors">
                    <span className="material-symbols-outlined text-[20px]">code</span>
                  </button>
                  <button className="w-10 h-10 rounded-full bg-surface-variant flex items-center justify-center text-on-surface-variant hover:text-primary hover:bg-primary/10 transition-colors">
                    <span className="material-symbols-outlined text-[20px]">work</span>
                  </button>
                  <button className="w-10 h-10 rounded-full bg-surface-variant flex items-center justify-center text-on-surface-variant hover:text-primary hover:bg-primary/10 transition-colors">
                    <span className="material-symbols-outlined text-[20px]">language</span>
                  </button>
                </div>

                {/* Quick Actions */}
                <div className="w-full space-y-3 border-t border-outline-variant/20 pt-6">
                  <button className="w-full py-2.5 rounded-lg bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 transition-colors font-jetbrains text-xs font-semibold tracking-wider flex items-center justify-center gap-2">
                    <span className="material-symbols-outlined text-[16px]">edit</span>
                    EDIT PROFILE
                  </button>
                  <button className="w-full py-2.5 rounded-lg bg-transparent text-on-surface-variant border border-outline-variant/30 hover:bg-surface-variant/50 transition-colors font-jetbrains text-xs font-semibold tracking-wider flex items-center justify-center gap-2">
                    <span className="material-symbols-outlined text-[16px]">tune</span>
                    PREFERENCES
                  </button>
                </div>
              </div>
            </aside>

            {/* Center Column: Activity & Progression (Col Span 6) */}
            <div className="col-span-12 lg:col-span-6 space-y-lg">
              
              {/* XP Progress Card */}
              <div className="glass-panel rounded-xl p-lg shadow-[0_0_15px_rgba(0,0,0,0.2)] border border-outline-variant/20 hover:border-primary/30 transition-colors duration-300">
                <div className="flex justify-between items-end mb-3">
                  <div>
                    <p className="font-jetbrains text-xs text-on-surface-variant mb-1 uppercase tracking-wider">Current Rank</p>
                    <h3 className="font-geist text-3xl font-bold text-primary tracking-tight">Level 18</h3>
                  </div>
                  <div className="text-right">
                    <span className="font-jetbrains text-sm text-on-surface font-semibold">12,450</span>
                    <span className="font-jetbrains text-xs text-on-surface-variant"> / 15,000 XP</span>
                  </div>
                </div>
                <div className="w-full h-2 bg-surface-variant rounded-full overflow-hidden mt-4">
                  <div className="h-full bg-gradient-to-r from-blue-500 to-primary rounded-full relative" style={{ width: "83%" }}>
                    <div className="absolute right-0 top-0 bottom-0 w-8 bg-white/20 blur-sm"></div>
                  </div>
                </div>
              </div>

              {/* Developer Skill Radar (Bento Grid Style) */}
              <div className="glass-panel rounded-xl p-lg border border-outline-variant/20">
                <div className="flex items-center gap-2 mb-6">
                  <span className="material-symbols-outlined text-primary">radar</span>
                  <h3 className="font-geist text-xl font-bold">Skill Matrix</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  
                  {/* Skill Card 1 */}
                  <div className="bg-surface-container-high p-4 rounded-lg border border-outline-variant/20">
                    <div className="flex justify-between font-jetbrains text-xs mb-3">
                      <span className="text-on-surface">React.js</span>
                      <span className="text-primary font-semibold">95%</span>
                    </div>
                    <div className="w-full h-1.5 bg-surface-variant rounded-full overflow-hidden">
                      <div className="h-full bg-primary rounded-full shadow-[0_0_8px_rgba(173,198,255,0.6)]" style={{ width: "95%" }}></div>
                    </div>
                  </div>

                  {/* Skill Card 2 */}
                  <div className="bg-surface-container-high p-4 rounded-lg border border-outline-variant/20">
                    <div className="flex justify-between font-jetbrains text-xs mb-3">
                      <span className="text-on-surface">Node.js</span>
                      <span className="text-primary font-semibold">88%</span>
                    </div>
                    <div className="w-full h-1.5 bg-surface-variant rounded-full overflow-hidden">
                      <div className="h-full bg-primary rounded-full shadow-[0_0_8px_rgba(173,198,255,0.6)]" style={{ width: "88%" }}></div>
                    </div>
                  </div>

                  {/* Skill Card 3 */}
                  <div className="bg-surface-container-high p-4 rounded-lg border border-outline-variant/20">
                    <div className="flex justify-between font-jetbrains text-xs mb-3">
                      <span className="text-on-surface">MongoDB</span>
                      <span className="text-primary font-semibold">82%</span>
                    </div>
                    <div className="w-full h-1.5 bg-surface-variant rounded-full overflow-hidden">
                      <div className="h-full bg-primary rounded-full shadow-[0_0_8px_rgba(173,198,255,0.6)]" style={{ width: "82%" }}></div>
                    </div>
                  </div>

                  {/* Skill Card 4 */}
                  <div className="bg-surface-container-high p-4 rounded-lg border border-outline-variant/20">
                    <div className="flex justify-between font-jetbrains text-xs mb-3">
                      <span className="text-on-surface">TypeScript</span>
                      <span className="text-primary font-semibold">75%</span>
                    </div>
                    <div className="w-full h-1.5 bg-surface-variant rounded-full overflow-hidden">
                      <div className="h-full bg-primary rounded-full shadow-[0_0_8px_rgba(173,198,255,0.6)]" style={{ width: "75%" }}></div>
                    </div>
                  </div>
                  
                </div>
              </div>

              {/* Recent Activity Feed */}
              <div className="glass-panel rounded-xl p-lg border border-outline-variant/20">
                <div className="flex items-center gap-2 mb-6">
                  <span className="material-symbols-outlined text-primary">history</span>
                  <h3 className="font-geist text-xl font-bold">Recent Activity</h3>
                </div>
                
                <div className="pl-6 border-l-2 border-outline-variant/20 space-y-8 mt-2">
                  <div className="relative">
                    <div className="absolute -left-[31px] top-1 w-3.5 h-3.5 bg-primary rounded-full shadow-[0_0_10px_rgba(173,198,255,0.6)]"></div>
                    <p className="font-inter text-xs text-on-surface-variant mb-1">2 hours ago</p>
                    <p className="font-inter text-sm text-on-surface font-semibold">Completed "Advanced API Rate Limiting" Challenge</p>
                    <p className="font-jetbrains text-xs text-primary mt-2">+150 XP</p>
                  </div>
                  
                  <div className="relative">
                    <div className="absolute -left-[31px] top-1 w-3.5 h-3.5 bg-surface-variant border-2 border-outline-variant/50 rounded-full"></div>
                    <p className="font-inter text-xs text-on-surface-variant mb-1">Yesterday</p>
                    <p className="font-inter text-sm text-on-surface">Earned <span className="text-blue-300 font-semibold">30-Day Streak</span> Badge</p>
                  </div>
                  
                  <div className="relative">
                    <div className="absolute -left-[31px] top-1 w-3.5 h-3.5 bg-surface-variant border-2 border-outline-variant/50 rounded-full"></div>
                    <p className="font-inter text-xs text-on-surface-variant mb-1">3 days ago</p>
                    <p className="font-inter text-sm text-on-surface">Published project: <a className="text-primary hover:underline font-semibold" href="#">Real-time Chat Socket.io</a></p>
                  </div>
                </div>
              </div>

            </div>

            {/* Right Panel: Stats & Achievements (Col Span 3) */}
            <div className="col-span-12 lg:col-span-3 space-y-lg">
              
              {/* Quick Stats Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-1 gap-4">
                <div className="glass-panel rounded-xl p-4 flex items-center justify-between border border-outline-variant/20 hover:border-primary/20 transition-colors">
                  <div>
                    <p className="font-jetbrains text-xs text-on-surface-variant uppercase mb-1 tracking-wider">Global Rank</p>
                    <p className="font-geist text-2xl text-primary font-bold">#842</p>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shadow-[0_0_10px_rgba(173,198,255,0.2)]">
                    <span className="material-symbols-outlined text-[20px]">public</span>
                  </div>
                </div>
                
                <div className="glass-panel rounded-xl p-4 flex items-center justify-between border border-outline-variant/20 hover:border-[#ef4444]/30 transition-colors">
                  <div>
                    <p className="font-jetbrains text-xs text-on-surface-variant uppercase mb-1 tracking-wider">Current Streak</p>
                    <p className="font-geist text-2xl text-on-surface font-bold">15 <span className="text-sm font-normal text-on-surface-variant">Days</span></p>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-[#ef4444]/10 flex items-center justify-center text-[#ef4444] shadow-[0_0_10px_rgba(239,68,68,0.2)]">
                    <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>local_fire_department</span>
                  </div>
                </div>
                
                <div className="glass-panel rounded-xl p-4 flex items-center justify-between border border-outline-variant/20 hover:border-[#10b981]/30 transition-colors">
                  <div>
                    <p className="font-jetbrains text-xs text-on-surface-variant uppercase mb-1 tracking-wider">Solved</p>
                    <p className="font-geist text-2xl text-on-surface font-bold">235</p>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-[#10b981]/10 flex items-center justify-center text-[#10b981] shadow-[0_0_10px_rgba(16,185,129,0.2)]">
                    <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>task_alt</span>
                  </div>
                </div>
              </div>

              {/* Achievements Grid */}
              <div className="glass-panel rounded-xl p-5 border border-outline-variant/20">
                <div className="flex items-center gap-2 mb-4">
                  <span className="material-symbols-outlined text-primary">workspace_premium</span>
                  <h3 className="font-geist text-lg font-bold">Badges</h3>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div className="aspect-square rounded-lg bg-surface-container-high border border-outline-variant/30 flex items-center justify-center relative group overflow-hidden hover:border-primary/50 transition-colors">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <span className="material-symbols-outlined text-3xl text-[#fde047] drop-shadow-[0_0_5px_rgba(253,224,71,0.5)]" style={{ fontVariationSettings: "'FILL' 1" }}>stars</span>
                  </div>
                  <div className="aspect-square rounded-lg bg-surface-container-high border border-outline-variant/30 flex items-center justify-center relative group overflow-hidden hover:border-primary/50 transition-colors">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <span className="material-symbols-outlined text-3xl text-primary drop-shadow-[0_0_5px_rgba(173,198,255,0.5)]" style={{ fontVariationSettings: "'FILL' 1" }}>code_blocks</span>
                  </div>
                  <div className="aspect-square rounded-lg bg-surface-container-high border border-outline-variant/30 flex items-center justify-center relative group overflow-hidden hover:border-primary/50 transition-colors">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <span className="material-symbols-outlined text-3xl text-[#f97316] drop-shadow-[0_0_5px_rgba(249,115,22,0.5)]" style={{ fontVariationSettings: "'FILL' 1" }}>local_fire_department</span>
                  </div>
                  <div className="aspect-square rounded-lg bg-surface-container-high border border-outline-variant/30 flex items-center justify-center relative opacity-40 grayscale hover:opacity-80 transition-opacity">
                    <span className="material-symbols-outlined text-3xl text-on-surface-variant" style={{ fontVariationSettings: "'FILL' 1" }}>military_tech</span>
                  </div>
                  <div className="aspect-square rounded-lg bg-surface-container-high border border-outline-variant/30 flex items-center justify-center relative opacity-40 grayscale hover:opacity-80 transition-opacity">
                    <span className="material-symbols-outlined text-3xl text-on-surface-variant" style={{ fontVariationSettings: "'FILL' 1" }}>bug_report</span>
                  </div>
                  <div className="aspect-square rounded-lg bg-surface-container-high border border-outline-variant/30 flex items-center justify-center relative opacity-40 grayscale hover:opacity-80 transition-opacity">
                    <span className="material-symbols-outlined text-3xl text-on-surface-variant" style={{ fontVariationSettings: "'FILL' 1" }}>military_tech</span>
                  </div>
                </div>
                <button className="w-full mt-4 text-center font-jetbrains text-xs text-on-surface-variant hover:text-primary transition-colors tracking-wider">VIEW ALL (12)</button>
              </div>

              {/* DevArena Pro CTA */}
              <div className="rounded-xl p-5 relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-surface-container-high via-surface-container to-primary/20 group-hover:to-primary/30 transition-all duration-500"></div>
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/20 blur-3xl rounded-full"></div>
                <div className="relative z-10 border border-primary/30 rounded-xl p-5 bg-surface-container/40 backdrop-blur-sm">
                  <h4 className="font-geist text-xl font-bold text-on-surface mb-2 flex items-center gap-2">
                    Excode <span className="px-2 py-0.5 rounded text-[10px] bg-primary text-on-primary font-jetbrains uppercase tracking-wider">Pro</span>
                  </h4>
                  <p className="font-inter text-xs text-on-surface-variant mb-4 leading-relaxed">Unlock advanced analytics, private challenges, and AI-assisted code reviews.</p>
                  <button className="w-full py-2.5 rounded-lg bg-primary text-on-primary font-jetbrains text-xs font-bold uppercase tracking-wider hover:brightness-110 transition-all shadow-[0_0_15px_rgba(173,198,255,0.2)] hover:shadow-[0_0_20px_rgba(173,198,255,0.4)]">
                    Upgrade Now
                  </button>
                </div>
              </div>

            </div>

          </div>
        </section>
      </main>
    </div>
  );
};

export default Profile;
