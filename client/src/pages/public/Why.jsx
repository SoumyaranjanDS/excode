import React from "react";
import { Link } from "react-router-dom";

const Why = () => {
  return (
    <div className="flex flex-col w-full h-[calc(100vh-64px)] relative overflow-hidden justify-center items-center">
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

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full text-center flex flex-col items-center">
            <h1 
                className="text-4xl md:text-6xl font-jetbrains font-bold mb-6 bg-clip-text text-transparent"
                style={{ backgroundImage: 'linear-gradient(90deg, #adc6ff, #ffffff)' }}
            >
                Why We Built Excode
            </h1>
            
            <div className="text-lg md:text-xl text-on-surface-variant font-inter max-w-3xl space-y-6">
                
                <p className="leading-relaxed">
                    The tech industry has a problem: <strong>The gap between learning and doing.</strong>
                </p>

                <p className="leading-relaxed">
                    Millions of developers grind algorithmic puzzles but freeze when faced with a real, messy codebase. Excode exists to bridge that gap. We believe true mastery comes from grappling with actual systems.
                </p>

                <p className="leading-relaxed">
                    Our goal is simple: To make you a developer who doesn't just know the theory, but can sit down at a keyboard and <strong>build anything</strong>.
                </p>

                <div className="mt-12">
                    <Link
                        to="/problems"
                        className="inline-block bg-primary text-[#002e6a] px-8 py-3 rounded-lg text-base font-inter font-bold transition-all hover:-translate-y-0.5 shadow-[0_0_15px_rgba(59,130,246,0.3)] hover:shadow-[0_0_20px_rgba(59,130,246,0.5)]"
                    >
                        Put Your Skills to the Test
                    </Link>
                </div>
            </div>
        </div>
    </div>
  );
};

export default Why;
