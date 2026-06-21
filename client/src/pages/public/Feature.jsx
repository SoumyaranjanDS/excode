import React from "react";
import BorderGlow from "../../components/BorderGlow";

const Feature = () => {
  return (
    <>
      {/* Features Section (Bento Grid) */}
      <section id="features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 relative z-10">
        <h2 className="text-4xl md:text-5xl font-geist font-bold text-center mb-16 text-on-surface">Beyond LeetCode</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Large Feature 1 */}
          <BorderGlow
            className="md:col-span-2 rounded-xl"
            glowColor="40 80 80"
            backgroundColor="#0f131c"
            colors={['#adc6ff', '#4d8eff', '#005ac2']}
          >
            <div className="p-8 flex flex-col justify-between group relative overflow-hidden h-full">
              <div className="relative z-10">
                <span className="material-symbols-outlined text-primary mb-6 text-[40px]">deployed_code</span>
                <h3 className="text-2xl font-geist font-bold mb-3 text-on-surface">Real-world Architectures</h3>
                <p className="text-base font-inter text-on-surface-variant">
                  Don't just write a function. Debug entire microservices, fix race conditions in concurrent queues, and optimize slow SQL queries in production-like environments.
                </p>
              </div>
              <div className="mt-8 h-32 bg-surface-container-low rounded border border-outline-variant/20 p-4 overflow-hidden relative z-10">
                <div className="absolute inset-0 bg-gradient-to-t from-surface-container-low to-transparent z-10"></div>
                <pre className="text-xs font-jetbrains text-on-surface-variant whitespace-pre">
  <code>{`import asyncio
from typing import List

async def process_batch(items: List[int]):
    # A wild race condition appears
    tasks = [process_item(i) for i in items]
    return await asyncio.gather(*tasks)`}</code>
                </pre>
              </div>
            </div>
          </BorderGlow>

          {/* Small Feature 1 */}
          <BorderGlow
            className="rounded-xl"
            glowColor="40 80 80"
            backgroundColor="#0f131c"
            colors={['#adc6ff', '#4d8eff', '#005ac2']}
          >
            <div className="p-8 flex flex-col justify-between h-full">
              <div>
                <span className="material-symbols-outlined text-tertiary-fixed mb-6 text-[40px]">terminal</span>
                <h3 className="text-2xl font-geist font-bold mb-3 text-on-surface">Cloud Native</h3>
                <p className="text-base font-inter text-on-surface-variant">
                  Every challenge runs in its own isolated Docker container. Full shell access included.
                </p>
              </div>
            </div>
          </BorderGlow>

          {/* Small Feature 2 */}
          <BorderGlow
            className="rounded-xl"
            glowColor="40 80 80"
            backgroundColor="#0f131c"
            colors={['#adc6ff', '#4d8eff', '#005ac2']}
          >
            <div className="p-8 flex flex-col justify-between h-full">
              <div>
                <span className="material-symbols-outlined text-secondary-fixed mb-6 text-[40px]">troubleshoot</span>
                <h3 className="text-2xl font-geist font-bold mb-3 text-on-surface">Systems Debugging</h3>
                <p className="text-base font-inter text-on-surface-variant">
                  Track down memory leaks and CPU spikes across distributed systems.
                </p>
              </div>
            </div>
          </BorderGlow>

          {/* Large Feature 2 */}
          <BorderGlow
            className="md:col-span-2 rounded-xl overflow-hidden relative"
            glowColor="40 80 80"
            backgroundColor="#0f131c"
            colors={['#adc6ff', '#4d8eff', '#005ac2']}
          >
            <div className="p-8 flex items-center justify-between h-full">
              <div className="z-10 w-full md:w-2/3">
                <span className="material-symbols-outlined text-primary-container mb-6 text-[40px]">military_tech</span>
                <h3 className="text-2xl font-geist font-bold mb-3 text-on-surface">Verified Engineering Profiles</h3>
                <p className="text-base font-inter text-on-surface-variant">
                  Build a portfolio of verified skills based on complex systems engineering, not just algorithmic tricks.
                </p>
              </div>
              <div className="hidden md:flex absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-primary/10 to-transparent items-center justify-center opacity-50">
                <span className="material-symbols-outlined text-primary text-[120px]">workspace_premium</span>
              </div>
            </div>
          </BorderGlow>
        </div>
      </section>

      {/* Trusted By Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-outline-variant/10 relative z-10">
        <p className="text-xs font-jetbrains text-on-surface-variant text-center mb-10 uppercase tracking-widest">
          Trusted by top engineering teams
        </p>
        <div className="flex flex-wrap justify-center gap-12 md:gap-24 opacity-50 grayscale hover:grayscale-0 transition-all duration-300">
          <span className="text-2xl font-geist font-bold tracking-tight">AcmeCorp</span>
          <span className="text-2xl font-geist font-bold tracking-tight">GlobalTech</span>
          <span className="text-2xl font-geist font-bold tracking-tight">CloudNative</span>
          <span className="text-2xl font-geist font-bold tracking-tight">DataFlow</span>
        </div>
      </section>
    </>
  );
};

export default Feature;