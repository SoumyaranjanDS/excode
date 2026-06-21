import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="w-full py-12 bg-surface-container-lowest border-t border-outline-variant/20 mt-auto relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
        <div>
          <div className="text-xl font-geist font-bold text-on-surface mb-4">DevArena</div>
          <p className="text-sm font-inter text-on-surface-variant">© {new Date().getFullYear()} DevArena Engineering. All rights reserved.</p>
        </div>
        <div className="flex flex-col gap-3">
          <Link to="/" className="text-on-surface-variant hover:text-primary transition-colors text-sm font-inter">Documentation</Link>
          <Link to="/" className="text-on-surface-variant hover:text-primary transition-colors text-sm font-inter">API Status</Link>
        </div>
        <div className="flex flex-col gap-3">
          <Link to="/" className="text-on-surface-variant hover:text-primary transition-colors text-sm font-inter">Privacy</Link>
          <Link to="/" className="text-on-surface-variant hover:text-primary transition-colors text-sm font-inter">Terms</Link>
        </div>
        <div className="flex flex-col gap-3">
          <Link to="/" className="text-on-surface-variant hover:text-primary transition-colors text-sm font-inter">Security</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
