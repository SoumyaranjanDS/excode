import React, { useState } from 'react';

const ShareProfileModal = ({ username, onClose }) => {
  const [copied, setCopied] = useState(false);
  const profileUrl = `${window.location.origin}/profile/${username}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(profileUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  const shareOnTwitter = () => {
    const text = `Check out my DevArena coding profile! 🔥`;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(profileUrl)}`, '_blank');
  };

  const shareOnLinkedIn = () => {
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(profileUrl)}`, '_blank');
  };

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-surface-container rounded-2xl border border-outline-variant/30 p-6 shadow-2xl relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-on-surface-variant hover:text-on-surface">
          <span className="material-symbols-outlined">close</span>
        </button>
        
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-primary/20">
            <span className="material-symbols-outlined text-[32px] text-primary">share</span>
          </div>
          <h2 className="text-2xl font-geist font-semibold text-on-surface mb-2">Share Profile</h2>
          <p className="text-on-surface-variant font-inter text-sm">Show off your coding stats and badges to the world!</p>
        </div>
        
        <div className="flex bg-background border border-outline-variant/50 rounded-lg overflow-hidden mb-6">
          <input 
            type="text" 
            readOnly 
            value={profileUrl}
            className="flex-1 bg-transparent text-on-surface px-4 py-3 focus:outline-none font-jetbrains text-sm"
          />
          <button 
            onClick={handleCopy}
            className="bg-surface-container-highest hover:bg-outline-variant/30 px-4 flex items-center justify-center transition-colors border-l border-outline-variant/50 text-on-surface"
          >
            {copied ? (
              <span className="material-symbols-outlined text-primary text-[20px]">check</span>
            ) : (
              <span className="material-symbols-outlined text-[20px]">content_copy</span>
            )}
          </button>
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          <button 
            onClick={shareOnTwitter}
            className="bg-[#1DA1F2]/10 text-[#1DA1F2] hover:bg-[#1DA1F2]/20 border border-[#1DA1F2]/20 py-3 rounded-xl flex items-center justify-center gap-2 transition-colors font-inter font-semibold text-sm"
          >
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>
            Twitter
          </button>
          <button 
            onClick={shareOnLinkedIn}
            className="bg-[#0A66C2]/10 text-[#0A66C2] hover:bg-[#0A66C2]/20 border border-[#0A66C2]/20 py-3 rounded-xl flex items-center justify-center gap-2 transition-colors font-inter font-semibold text-sm"
          >
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
            LinkedIn
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShareProfileModal;
