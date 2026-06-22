import { Link } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';

const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const { backendUser } = useAuth();

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar Content */}
      <aside
        className={`w-64 h-screen fixed left-0 top-0 bg-surface border-r border-outline-variant/30 backdrop-blur-xl flex flex-col p-md z-40 transition-transform duration-300 transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0`}
      >
        {/* Brand */}
        <div className="flex items-center gap-sm mb-lg px-sm">
          <span className="font-headline-md text-headline-md font-bold text-primary tracking-tight">
            Excode
          </span>
        </div>
        {/* User Profile Card */}
        <div className="glass-panel rounded-xl p-md mb-lg">
          <div className="flex items-center gap-sm mb-md">
            <img
              className="w-10 h-10 rounded-full object-cover border border-outline-variant/50"
              alt="User profile"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAgIGP3kJBWkWCRd_1qtVQSDRKnCJEu9Jx6Hu-qyKQ7_1v1BRL9FkODk-3Qgs1m-ytPBzg0CtZ_BTQ7OT36VRUyZfuH9yiBuOI0NaLnoEF1dvCchH3xp9xtFkxj1661CAVrOh-yFjY03vq4ImNKJkosfwjT8aS2XPGuaewhDcdO_kWAlSxZ0x1e7hoIBJywTT7I6ZSjW2AzcL0RoBu1kRe3TNcuYw6v-o6ejZrthvu3stRES6oLALVKeTXRv9j4Ht-QhuLV80KB-FGV"
            />
            <div>
              <div className="font-body-md font-semibold text-on-surface leading-tight">
                {backendUser?.name || "Guest"}
              </div>
              <div className="font-code-sm text-on-surface-variant flex items-center gap-xs mt-1">
                <span
                  className="material-symbols-outlined text-[14px] text-amber-400"
                >
                  local_fire_department
                </span>
                15 Day Streak
              </div>
            </div>
          </div>
          <div className="space-y-sm">
            <div className="flex justify-between font-label-caps text-label-caps text-on-surface-variant">
              <span>LEVEL 14</span>
              <span>350 / 500 XP</span>
            </div>
            <div className="h-1 bg-surface-variant rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-primary to-primary-container rounded-full"
                style={{ width: "70%" }}
              />
            </div>
          </div>
        </div>
        {/* Navigation Links */}
        <nav className="flex-1 space-y-sm overflow-y-auto custom-scrollbar pr-xs">
          <Link
            className="flex items-center gap-md px-md py-sm rounded-lg text-on-surface-variant hover:bg-surface-variant/50 transition-colors duration-200"
            to="#"
          >
            <span className="material-symbols-outlined text-xl">dashboard</span>
            <span>Dashboard</span>
          </Link>
          <Link
            className="flex items-center gap-md px-md py-sm rounded-lg text-on-surface-variant hover:bg-surface-variant/50 transition-colors duration-200"
            to="#"
          >
            <span className="material-symbols-outlined text-xl">school</span>
            <span>Learning Paths</span>
          </Link>
          <Link
            className="flex items-center gap-md px-md py-sm rounded-lg text-primary bg-secondary-container/20"
            to="#"
          >
            <span className="material-symbols-outlined text-xl">workspace_premium</span>
            <span className="font-medium">Challenges</span>
          </Link>
          <Link
            className="flex items-center gap-md px-md py-sm rounded-lg text-on-surface-variant hover:bg-surface-variant/50 transition-colors duration-200"
            to="#"
          >
            <span className="material-symbols-outlined text-xl">emoji_events</span>
            <span>Competitions</span>
          </Link>
          <Link
            className="flex items-center gap-md px-md py-sm rounded-lg text-on-surface-variant hover:bg-surface-variant/50 transition-colors duration-200"
            to="#"
          >
            <span className="material-symbols-outlined text-xl">assignment</span>
            <span>Assessments</span>
          </Link>
          <Link
            className="flex items-center gap-md px-md py-sm rounded-lg text-on-surface-variant hover:bg-surface-variant/50 transition-colors duration-200"
            to="#"
          >
            <span className="material-symbols-outlined text-xl">leaderboard</span>
            <span>Leaderboard</span>
          </Link>
          <Link
            className="flex items-center gap-md px-md py-sm rounded-lg text-on-surface-variant hover:bg-surface-variant/50 transition-colors duration-200"
            to="#"
          >
            <span className="material-symbols-outlined text-xl">stars</span>
            <span>Achievements</span>
          </Link>
        </nav>
        {/* Footer Links */}
        <div className="mt-auto pt-md border-t border-outline-variant/20 space-y-xs">
          <Link
            className="flex items-center gap-md px-md py-sm rounded-lg text-on-surface-variant hover:bg-surface-variant/50 transition-colors duration-200"
            to="#"
          >
            <span className="material-symbols-outlined text-xl">person</span>
            <span>Profile</span>
          </Link>
          <Link
            className="flex items-center gap-md px-md py-sm rounded-lg text-on-surface-variant hover:bg-surface-variant/50 transition-colors duration-200"
            to="#"
          >
            <span className="material-symbols-outlined text-xl">settings</span>
            <span>Settings</span>
          </Link>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
