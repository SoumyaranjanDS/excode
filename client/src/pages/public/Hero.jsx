import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Lightfall from "../../components/Lightfall";

const Hero = () => {
  const { backendUser } = useAuth();
  
  return (
    <section className="relative w-full overflow-hidden">
        {/* Lightfall Background */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 h-full w-[1200px] md:w-full md:left-0 md:translate-x-0" style={{ zIndex: 0 }}>
            <Lightfall
                colors={['#A6C8FF', '#5227FF', '#FF9FFC']}
                backgroundColor="#0A29FF"
                speed={0.3}
                streakCount={3}
                streakWidth={0.5}
                streakLength={1}
                glow={0.2}
                density={0.4}
                twinkle={0.25}
                zoom={3.2}
                backgroundGlow={0.2}
                opacity={1}
                mouseInteraction={true}
                mouseStrength={1}
                mouseRadius={0.6}
            />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-12 md:pt-20 md:pb-24 text-center relative z-10 w-full mt-[150px]">
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
