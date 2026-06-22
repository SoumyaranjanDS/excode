import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const ComingSoon = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center relative overflow-hidden p-6 font-inter">
      {/* Background decorations */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[100px] pointer-events-none"></div>
      
      <div className="relative z-10 glass-panel rounded-2xl p-8 md:p-12 text-center border border-outline-variant/30 flex flex-col items-center shadow-xl shadow-black/40">
        <span className="material-symbols-outlined text-[64px] text-primary mb-6 animate-pulse">
          rocket_launch
        </span>
        
        <h1 className="font-geist text-3xl md:text-4xl font-bold text-on-surface mb-3 tracking-tight">
          Coming Soon
        </h1>
        
        <p className="font-inter text-on-surface-variant mb-8 leading-relaxed">
          We're working hard to bring you this feature. It will be available in an upcoming update!
        </p>

        <div className="flex flex-col sm:flex-row gap-4 w-full">
          <button 
            onClick={() => navigate(-1)}
            className="flex-1 bg-surface-container hover:bg-surface-container-high border border-outline-variant/30 text-on-surface py-3 px-6 rounded-xl font-jetbrains text-xs font-semibold tracking-wider transition-all duration-200 hover:scale-[0.98]"
          >
            GO BACK
          </button>
          <Link 
            to="/dashboard"
            className="flex-1 bg-primary text-on-primary py-3 px-6 rounded-xl font-jetbrains text-xs font-semibold tracking-wider transition-all duration-200 shadow-[0_0_15px_rgba(77,142,255,0.3)] hover:shadow-[0_0_20px_rgba(77,142,255,0.5)] hover:scale-[0.98] flex items-center justify-center"
          >
            DASHBOARD
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ComingSoon;
