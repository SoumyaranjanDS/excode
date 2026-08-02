import React, { useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { Rocket, Star, Home } from "lucide-react";
import gsap from "gsap";
import Seo from "../../components/Seo";

const NotFound = () => {
  const rocketRef = useRef(null);
  const containerRef = useRef(null);
  const starsRef = useRef([]);

  useEffect(() => {
    // Gentle floating animation for the rocket
    gsap.to(rocketRef.current, {
      y: -30,
      rotation: 5,
      duration: 2.5,
      yoyo: true,
      repeat: -1,
      ease: "power1.inOut",
    });

    // Twinkle animation for background stars
    starsRef.current.forEach((star) => {
      gsap.to(star, {
        opacity: 0.2,
        scale: 0.5,
        duration: gsap.utils.random(1, 3),
        yoyo: true,
        repeat: -1,
        ease: "power1.inOut",
        delay: gsap.utils.random(0, 2),
      });
    });
    
    // Animate the container in
    gsap.from(containerRef.current, {
      opacity: 0,
      y: 20,
      duration: 1,
      ease: "power3.out"
    });
  }, []);

  // Generate random positions for stars
  const stars = Array.from({ length: 15 }).map((_, i) => ({
    id: i,
    top: `${Math.random() * 100}%`,
    left: `${Math.random() * 100}%`,
    size: Math.random() * 16 + 8,
  }));

  return (
    <>
      <Seo 
        title="404 - Lost in Space" 
        description="The page you are looking for has drifted off into the cosmos."
        noindex={true}
      />
      <div className="min-h-screen bg-background relative overflow-hidden flex flex-col items-center justify-center text-on-background selection:bg-primary/30">
        
        {/* Deep space radial gradient */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/10 via-background to-background pointer-events-none" />

        {/* Stars */}
        {stars.map((star, i) => (
          <div
            key={star.id}
            ref={(el) => (starsRef.current[i] = el)}
            className="absolute text-primary/40"
            style={{ top: star.top, left: star.left }}
          >
            <Star size={star.size} fill="currentColor" />
          </div>
        ))}

        <div ref={containerRef} className="z-10 flex flex-col items-center text-center p-6 max-w-lg">
          {/* 404 Text Background */}
          <h1 className="text-[150px] md:text-[200px] font-black tracking-tighter text-surface-variant/20 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 select-none pointer-events-none -z-10">
            404
          </h1>

          {/* Floating Astronaut/Rocket */}
          <div ref={rocketRef} className="relative mb-12">
            <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full" />
            <Rocket size={120} className="text-primary relative z-10 drop-shadow-2xl" strokeWidth={1.5} />
          </div>

          <h2 className="text-4xl md:text-5xl font-headline-md font-bold mb-4">
            Lost in Space
          </h2>
          
          <p className="text-on-surface-variant text-lg mb-8">
            Houston, we have a problem. The page you're looking for has drifted off into the cosmos and cannot be found.
          </p>

          <Link 
            to="/" 
            className="group relative inline-flex items-center gap-2 px-8 py-4 bg-primary text-on-primary rounded-full font-semibold overflow-hidden transition-all hover:scale-105 active:scale-95"
          >
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
            <Home size={20} className="relative z-10" />
            <span className="relative z-10">Return to Base</span>
          </Link>
        </div>
      </div>
    </>
  );
};

export default NotFound;
