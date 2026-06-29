import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import PillNav from "../../components/PillNav";
const NAV_ITEMS = [
  { label: "Problems", href: "/problems" },
  { label: "Leaderboard", href: "/leaderboard" },
  { label: "Community", href: "/community" },
  { label: "Why", href: "/why" },
];

const Navbar = () => {
  const navigate = useNavigate();
  const { backendUser, logout } = useAuth();
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setProfileDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    await logout();
    setProfileDropdownOpen(false);
    navigate("/");
  };

  const DesktopAuth = (
    <>
      {backendUser ? (
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
            className="flex items-center gap-2 focus:outline-none hover:opacity-80 transition-opacity"
          >
            {backendUser.avatar ? (
              <img
                src={backendUser.avatar}
                alt="Profile Avatar"
                className="w-10 h-10 rounded-full border border-outline-variant/50 object-cover"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-bold text-lg border border-primary/30">
                {backendUser.name?.charAt(0).toUpperCase() || "U"}
              </div>
            )}
          </button>

          {/* Profile Dropdown */}
          {profileDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 rounded-xl bg-surface-container shadow-lg border border-outline-variant/50 overflow-hidden transform opacity-100 scale-100 transition-all duration-200 origin-top-right">
              <div className="px-4 py-3 border-b border-outline-variant/30">
                <p className="text-sm text-on-surface font-medium truncate">
                  {backendUser.name}
                </p>
                <p className="text-xs text-on-surface-variant truncate">
                  {backendUser.email}
                </p>
              </div>
              <Link
                to="/profile"
                className="block px-4 py-2 text-sm text-on-surface hover:bg-surface-container-high transition-colors"
                onClick={() => setProfileDropdownOpen(false)}
              >
                Profile
              </Link>
              <button
                onClick={handleLogout}
                className="block w-full text-left px-4 py-2 text-sm text-error hover:bg-error/10 transition-colors"
              >
                Sign Out
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="flex items-center gap-4">
          <Link
            to="/login"
            className="text-on-surface hover:text-primary font-jetbrains text-sm font-medium transition-colors"
          >
            Log In
          </Link>
          <Link
            to="/signup"
            className="bg-primary hover:bg-primary-fixed text-on-primary px-5 py-2 rounded-xl font-jetbrains text-sm font-semibold tracking-wide transition-all shadow-[0_0_10px_rgba(77,142,255,0.2)] hover:shadow-[0_0_15px_rgba(77,142,255,0.4)]"
          >
            Sign Up
          </Link>
        </div>
      )}
    </>
  );

  const MobileAuth = (closeMobileMenu) => (
    <>
      {backendUser ? (
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            {backendUser.avatar ? (
              <img
                src={backendUser.avatar}
                alt="Profile Avatar"
                className="w-10 h-10 rounded-full border border-outline-variant/50 object-cover"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-bold text-lg border border-primary/30">
                {backendUser.name?.charAt(0).toUpperCase() || "U"}
              </div>
            )}
            <div>
              <div className="text-base font-medium text-on-surface">
                {backendUser.name}
              </div>
              <div className="text-sm font-medium text-on-surface-variant">
                {backendUser.email}
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Link
              to="/profile"
              onClick={() => closeMobileMenu()}
              className="block px-3 py-2 rounded-md text-base font-medium text-on-surface hover:bg-surface-container"
            >
              Profile
            </Link>
            <button
              onClick={() => {
                handleLogout();
                closeMobileMenu();
              }}
              className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-error hover:bg-error/10"
            >
              Sign Out
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          <Link
            to="/login"
            onClick={() => closeMobileMenu()}
            className="w-full text-center border border-outline-variant text-on-surface hover:bg-surface-container px-4 py-3 rounded-xl font-jetbrains text-sm font-semibold transition-colors"
          >
            Log In
          </Link>
          <Link
            to="/signup"
            onClick={() => closeMobileMenu()}
            className="w-full text-center bg-primary hover:bg-primary-fixed text-on-primary px-4 py-3 rounded-xl font-jetbrains text-sm font-semibold transition-all shadow-[0_0_10px_rgba(77,142,255,0.2)]"
          >
            Sign Up
          </Link>
        </div>
      )}
    </>
  );

  return (
    <PillNav
      logo="/excode.svg"
      logoAlt="Excode"
      items={NAV_ITEMS}
      rightContent={DesktopAuth}
      mobileBottomContent={MobileAuth}
      baseColor="rgba(15, 19, 28, 0.8)"
      pillColor="#adc6ff"
      hoveredPillTextColor="#002e6a"
      pillTextColor="#dfe2ee"
    />
  );
};

export default Navbar;
