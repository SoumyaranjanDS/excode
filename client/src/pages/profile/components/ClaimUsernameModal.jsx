import React, { useState } from 'react';

const ClaimUsernameModal = ({ backendUser, setBackendUser, onClose }) => {
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleClaim = async () => {
    if (!username) {
      setError("Username cannot be empty");
      return;
    }
    setLoading(true);
    setError('');
    
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:3000/api/auth/username', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ username })
      });
      
      const data = await res.json();
      if (res.ok) {
        // Update user in context and local storage
        const updatedUser = { ...backendUser, username: data.username };
        setBackendUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
        onClose();
      } else {
        setError(data.message || "Failed to claim username");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-surface-container rounded-2xl border border-outline-variant/30 p-6 shadow-2xl relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-on-surface-variant hover:text-on-surface">
          <span className="material-symbols-outlined">close</span>
        </button>
        
        <h2 className="text-2xl font-geist font-semibold text-on-surface mb-2">Claim Username</h2>
        <p className="text-on-surface-variant font-inter text-sm mb-6">Create a unique handle to share your DevArena profile with the world.</p>
        
        <div className="mb-6">
          <label className="block text-xs font-jetbrains text-on-surface-variant uppercase tracking-wider mb-2">Username</label>
          <div className="flex bg-background border border-outline-variant/50 rounded-lg overflow-hidden focus-within:border-primary transition-colors">
            <span className="px-3 py-3 text-on-surface-variant bg-surface-container-lowest border-r border-outline-variant/50 font-jetbrains">devarena.com/profile/</span>
            <input 
              type="text" 
              value={username}
              onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
              placeholder="jane_doe"
              className="flex-1 bg-transparent text-on-surface px-3 py-3 focus:outline-none font-inter"
              maxLength={20}
            />
          </div>
          {error && <p className="text-error text-xs font-inter mt-2">{error}</p>}
        </div>
        
        <div className="flex justify-end gap-3">
          <button onClick={onClose} className="px-5 py-2 rounded-lg text-on-surface hover:bg-surface-container-highest transition-colors font-inter text-sm font-semibold">
            Cancel
          </button>
          <button 
            onClick={handleClaim} 
            disabled={loading}
            className="bg-primary text-on-primary px-6 py-2 rounded-lg hover:shadow-[0_0_15px_rgba(77,142,255,0.3)] hover:-translate-y-0.5 transition-all font-inter text-sm font-semibold disabled:opacity-50"
          >
            {loading ? "Claiming..." : "Claim"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ClaimUsernameModal;
