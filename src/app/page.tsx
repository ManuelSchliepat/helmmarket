'use client'

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { motion, AnimatePresence } from "framer-motion";
import CountUp from "react-countup";
import { landingStats, companies, testimonials, featuredIn, recentInstalls } from "@/lib/placeholder-data";
import { useState, useEffect } from "react";
import { Star, ArrowRight, Zap, Sparkles, ShieldCheck } from "lucide-react";

export default function Home() {
  const [currentInstallIndex, setCurrentInstallIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentInstallIndex((prev) => (prev + 1) % recentInstalls.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-[#09090b] text-white overflow-hidden">
      <main className="flex-1">
        {/* HERO SECTION */}
        <section className="w-full pt-32 pb-20 md:pt-48 md:pb-32 relative">
          {/* Background glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-600/20 rounded-full blur-[120px] opacity-50 pointer-events-none" />
          
          <div className="container px-4 md:px-6 mx-auto relative z-10">
            <div className="flex flex-col items-center space-y-8 text-center max-w-4xl mx-auto">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="space-y-4"
              >
                <div className="inline-flex items-center rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 text-sm font-medium text-indigo-300 mb-4">
                  <span className="flex h-2 w-2 rounded-full bg-indigo-500 mr-2 animate-pulse"></span>
                  The Standard for AI Agent Skills
                </div>
                <h1 className="text-5xl font-extrabold tracking-tight sm:text-6xl md:text-7xl lg:text-8xl">
                  The App Store for <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-cyan-400 to-indigo-400 bg-[length:200%_auto] animate-gradient">AI Agent Skills</span>
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-400 md:text-xl leading-relaxed">
                  2,400 developers use Helm Market to discover, install and monetize 
                  typed, sandboxed AI skills. Built on the Helm paradigm.
                </p>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
              >
                <Button asChild size="lg" className="h-14 px-8 text-lg bg-indigo-600 hover:bg-indigo-700 text-white border-0 shadow-lg shadow-indigo-600/20">
                  <Link href="/skills">Install your first skill <ArrowRight className="ml-2 w-5 h-5" /></Link>
                </Button>
                <Button variant="outline" size="lg" asChild className="h-14 px-8 text-lg border-gray-700 hover:bg-gray-800 text-white bg-transparent">
                  <Link href="/onboarding">Publish & Earn 70%</Link>
                </Button>
              </motion.div>
            </div>
          </div>
        </section>
        
        {/* STATS SECTION */}
        <section className="w-full py-16 border-y border-gray-800 bg-gray-900/20 backdrop-blur-sm">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
              <div className="space-y-2">
                <h3 className="text-5xl font-bold tracking-tighter text-white">
                  <CountUp end={landingStats.developers} separator="," duration={2.5} enableScrollSpy scrollSpyOnce />+
                </h3>
                <p className="text-indigo-400 font-medium uppercase tracking-wider text-xs">Trusted Developers</p>
              </div>
              <div className="space-y-2">
                <h3 className="text-5xl font-bold tracking-tighter text-white">
                  <CountUp end={landingStats.installations} separator="," duration={2.5} enableScrollSpy scrollSpyOnce />
                </h3>
                <p className="text-indigo-400 font-medium uppercase tracking-wider text-xs">Skill Installations</p>
              </div>
              <div className="space-y-2">
                <h3 className="text-5xl font-bold tracking-tighter text-white">
                  €<CountUp end={landingStats.payouts} separator="," duration={2.5} enableScrollSpy scrollSpyOnce />
                </h3>
                <p className="text-indigo-400 font-medium uppercase tracking-wider text-xs">Paid to Creators</p>
              </div>
            </div>
          </div>
        </section>

        {/* LOGOS SECTION */}
        <section className="w-full py-24">
          <div className="container px-4 md:px-6 mx-auto">
            <p className="text-center text-sm font-semibold text-gray-500 uppercase tracking-widest mb-12">Teams using Helm Market</p>
            <div className="flex flex-wrap justify-center items-center gap-12 md:gap-24 opacity-60 hover:opacity-100 transition-opacity duration-500">
              {companies.map((company) => (
                <div key={company.name} className="flex items-center gap-2 grayscale hover:grayscale-0 transition-all duration-300">
                  <div className="text-2xl font-bold text-white tracking-tighter" style={{ color: company.color }}>{company.name}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FEATURED IN */}
        <section className="w-full py-12 bg-gray-900/40">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16">
              <span className="text-xs font-bold text-gray-600 uppercase tracking-widest">Featured in</span>
              <div className="flex flex-wrap justify-center gap-8 md:gap-16 items-center">
                {featuredIn.map(outlet => (
                  <span key={outlet.name} className="text-xl font-black text-gray-500 hover:text-gray-300 transition-colors cursor-default">{outlet.name}</span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* TESTIMONIALS SECTION */}
        <section className="w-full py-32 bg-gradient-to-b from-transparent to-gray-900/50">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="text-center max-w-3xl mx-auto mb-20">
              <h2 className="text-4xl font-bold tracking-tight sm:text-5xl mb-6">Built for the next decade of AI</h2>
              <p className="text-gray-400 text-lg">Top engineers from around the world are building their agent infrastructure on Helm Market.</p>
            </div>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {testimonials.map((t, i) => (
                <motion.div 
                  key={t.name}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                  className="relative group p-8 bg-gray-900/50 border border-gray-800 rounded-3xl hover:border-indigo-500/50 transition-all duration-300"
                >
                  <div className="flex gap-1 text-amber-500 mb-6">
                    {[...Array(t.rating)].map((_, j) => (
                      <Star key={j} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-300 text-lg italic leading-relaxed mb-8">"{t.quote}"</p>
                  <div className="flex items-center gap-4 border-t border-gray-800 pt-6">
                    <img src={t.avatar} alt={t.name} className="w-12 h-12 rounded-full border-2 border-indigo-500/20" />
                    <div>
                      <p className="font-bold text-white">{t.name}</p>
                      <p className="text-sm text-indigo-400">@{t.handle}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* RECENT INSTALLS TICKER */}
      <div className="fixed bottom-0 left-0 right-0 bg-black/80 backdrop-blur-xl border-t border-gray-800 py-3 z-[100]">
        <div className="container mx-auto px-4 flex items-center justify-center">
          <div className="flex items-center gap-3 overflow-hidden">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            <AnimatePresence mode="wait">
              <motion.div 
                key={currentInstallIndex}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4 }}
                className="text-xs md:text-sm font-mono tracking-tight"
              >
                <span className="text-indigo-400 font-bold">{recentInstalls[currentInstallIndex].handle}</span> 
                <span className="text-gray-400 mx-2">installed</span> 
                <span className="text-white font-bold">{recentInstalls[currentInstallIndex].skill}</span> 
                <span className="text-gray-600 ml-2">{recentInstalls[currentInstallIndex].timeAgo}</span>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
