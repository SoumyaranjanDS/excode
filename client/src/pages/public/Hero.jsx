import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Hero = () => {
  const { backendUser } = useAuth();
  
  return (
    <section className="relative w-full overflow-hidden">
        {/* Simple Dotted Grid Background */}
        <div 
            className="absolute inset-0 z-0 opacity-[0.15]"
            style={{
                backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)',
                backgroundSize: '32px 32px',
                backgroundPosition: '0 0'
            }}
        >
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-background"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-background via-transparent to-background"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-12 md:pt-20 md:pb-24 text-center relative z-10 w-full mt-[54px]">
            <h1 
            className="text-5xl md:text-7xl font-jetbrains font-bold mb-6 mt-12 bg-clip-text text-transparent"
            style={{ backgroundImage: 'linear-gradient(90deg, #adc6ff, #ffffff)' }}
        >
            Code Beyond the Sandbox
        </h1>
        <p className="text-lg md:text-xl font-inter text-on-surface-variant max-w-3xl mx-auto mb-10 leading-relaxed">
            Real microservices. Real bugs. Master the engineering skills that actually matter in production.
        </p>

        <div className="flex justify-center gap-4 flex-col sm:flex-row">
            {backendUser ? (
                <Link
                    to="/dashboard"
                    className="bg-primary-container text-on-primary-container px-8 py-4 rounded-lg text-base font-inter font-medium transition-all hover:-translate-y-0.5 shadow-[0_0_15px_rgba(77,142,255,0.3)] hover:shadow-[0_0_25px_rgba(77,142,255,0.5)]"
                >
                    Start Solving
                </Link>
            ) : (
                <Link
                    to="/signup"
                    className="bg-primary-container text-on-primary-container px-8 py-4 rounded-lg text-base font-inter font-medium transition-all hover:-translate-y-0.5 shadow-[0_0_15px_rgba(77,142,255,0.3)] hover:shadow-[0_0_25px_rgba(77,142,255,0.5)]"
                >
                    Start Solving
                </Link>
            )}
            <a
                href="#features"
                className="border border-outline-variant text-on-surface px-8 py-4 rounded-lg hover:bg-surface-container transition-colors duration-200 text-base font-inter"
            >
                Explore Challenges
            </a>
            <Link
                to="/why"
                className="border border-transparent text-on-surface-variant hover:text-white px-6 py-4 rounded-lg hover:bg-surface-container-low transition-colors duration-200 text-base font-inter flex items-center gap-2"
            >
                <span className="material-symbols-outlined text-[20px]">help</span>
                Why
            </Link>
        </div>

        {/* Hero Visuals - The Terminal */}
        <div className="mt-24 relative max-w-5xl mx-auto h-[400px] md:h-[500px]">
            <div 
                className="absolute inset-0 rounded-xl overflow-hidden flex flex-col border border-outline-variant/30 shadow-2xl"
                style={{
                    background: 'rgba(17, 24, 39, 0.4)',
                    backdropFilter: 'blur(12px)',
                    WebkitBackdropFilter: 'blur(12px)',
                    backgroundImage: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0) 100%)'
                }}
            >
                <div className="bg-surface-container-high h-10 border-b border-outline-variant/20 flex items-center px-4 gap-2">
                    <div className="w-3 h-3 rounded-full bg-error"></div>
                    <div className="w-3 h-3 rounded-full bg-tertiary-container"></div>
                    <div className="w-3 h-3 rounded-full bg-success opacity-50"></div>
                    <span className="text-sm font-jetbrains text-on-surface-variant ml-auto">user@excode:~</span>
                </div>
                <div className="p-6 font-jetbrains text-sm text-on-surface text-left grow relative overflow-hidden">
                    {backendUser ? (
                        <>
                            <p className="text-primary-container">$ whoami</p>
                            <p className="text-success mt-2 whitespace-pre">{backendUser.name || backendUser.email || "developer"}</p>
                            
                            <p className="text-primary-container mt-4">$ echo "Welcome back to excode!"</p>
                            <p className="text-on-surface-variant mt-2 whitespace-pre">Welcome back to excode!</p>

                            <p className="text-primary-container mt-4">$ ./run_dashboard.sh</p>
                            <p className="text-on-surface-variant mt-2 whitespace-pre">Loading user profile...</p>
                            <p className="text-success whitespace-pre">✓ Systems ready</p>
                        </>
                    ) : (
                        <>
                            <p className="text-primary-container">$ node check_auth.js</p>
                            <p className="text-on-surface-variant mt-2 whitespace-pre">Checking user credentials...</p>
                            <p className="text-error whitespace-pre">Error: Authentication required</p>
                            
                            <p className="text-primary-container mt-4">$ cat instructions.txt</p>
                            <p className="text-on-surface-variant mt-2 whitespace-pre">Please login or sign up to access</p>
                            <p className="text-on-surface-variant whitespace-pre">the production engineering systems.</p>
                        </>
                    )}
                    <p className="text-primary mt-4 animate-pulse">_</p>

                    {/* Floating Element 1 */}
                    <div className="hidden md:block absolute -right-2 top-10 p-2 rounded border border-primary/20 rotate-3 shadow-lg" style={{ background: 'rgba(17, 24, 39, 0.4)', backdropFilter: 'blur(12px)' }}>
                        <span className="material-symbols-outlined text-primary text-[32px]">api</span>
                    </div>

                    {/* Floating Element 2 */}
                    <div className="hidden md:block absolute -left-2 bottom-20 p-2 rounded border border-error/20 -rotate-6 shadow-lg" style={{ background: 'rgba(17, 24, 39, 0.4)', backdropFilter: 'blur(12px)' }}>
                        <span className="material-symbols-outlined text-error text-[32px]">bug_report</span>
                    </div>
                </div>
            </div>
        </div>
        </div>
    </section>
  );
};

export default Hero;
