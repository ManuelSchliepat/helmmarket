'use client'

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { motion, AnimatePresence } from "framer-motion";
import CountUp from "react-countup";
import { landingStats, companies, testimonials, featuredIn, recentInstalls, providers } from "@/lib/placeholder-data";
import { useState, useEffect } from "react";
import { Star, ArrowRight, Zap, Sparkles, ShieldCheck, Cpu } from "lucide-react";

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
                <h1 className="text-5xl font-extrabold tracking-tight sm:text-6xl md:text-7xl lg:text-8xl leading-[1.1]">
                  The App Store for <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-cyan-400 to-indigo-400 bg-[length:200%_auto] animate-gradient">AI Agent Skills</span>
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-400 md:text-xl leading-relaxed font-medium">
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
                <Button asChild size="lg" className="h-16 px-10 text-lg bg-indigo-600 hover:bg-indigo-700 text-white border-0 shadow-2xl shadow-indigo-600/40 rounded-2xl font-black uppercase tracking-widest transition-all active:scale-[0.98]">
                  <Link href="/skills">Browse Marketplace <ArrowRight className="ml-2 w-5 h-5" /></Link>
                </Button>
                <Button variant="outline" size="lg" asChild className="h-16 px-10 text-lg border-gray-800 hover:bg-gray-800 text-white bg-transparent rounded-2xl font-black uppercase tracking-widest transition-all active:scale-[0.98]">
                  <Link href="/onboarding">Publish & Earn</Link>
                </Button>
              </motion.div>
            </div>
          </div>
        </section>

        {/* TASK 4: PROVIDER-AGNOSTIC TRUST SIGNAL */}
        <section className="w-full pb-24 relative z-10">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="max-w-5xl mx-auto bg-gray-900/30 border border-gray-800/60 rounded-[3rem] p-10 md:p-16 backdrop-blur-xl shadow-inner">
              <div className="text-center mb-12">
                <h3 className="text-xs font-black text-indigo-400 uppercase tracking-[0.3em] mb-4">Infrastructure Neutrality</h3>
                <p className="text-2xl md:text-3xl font-black text-white tracking-tighter">Provider-Agnostic. Swap backends without rewriting skills.</p>
              </div>
              <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16">
                {providers.map((p) => (
                  <div key={p.id} className="group flex flex-col items-center gap-3 transition-all duration-500 hover:-translate-y-1">
                    <div className="w-16 h-16 bg-gray-900 border border-gray-800 rounded-2xl flex items-center justify-center shadow-lg group-hover:border-indigo-500/50 group-hover:shadow-indigo-500/10 transition-all">
                      <Cpu className="w-8 h-8 text-gray-600 group-hover:text-indigo-400 transition-colors" />
                    </div>
                    <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest group-hover:text-gray-300 transition-colors">{p.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
        
        {/* STATS SECTION */}
        <section className="w-full py-20 border-y border-gray-800 bg-gray-950">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-16 text-center">
              <div className="space-y-3">
                <h3 className="text-6xl font-black tracking-tighter text-white">
                  <CountUp end={landingStats.developers} separator="," duration={2.5} enableScrollSpy scrollSpyOnce />+
                </h3>
                <p className="text-indigo-400 font-black uppercase tracking-[0.2em] text-[10px]">Verified Developers</p>
              </div>
              <div className="space-y-3">
                <h3 className="text-6xl font-black tracking-tighter text-white">
                  <CountUp end={landingStats.installations} separator="," duration={2.5} enableScrollSpy scrollSpyOnce />
                </h3>
                <p className="text-indigo-400 font-black uppercase tracking-[0.2em] text-[10px]">Skills Installed</p>
              </div>
              <div className="space-y-3">
                <h3 className="text-6xl font-black tracking-tighter text-white">
                  €<CountUp end={landingStats.payouts} separator="," duration={2.5} enableScrollSpy scrollSpyOnce />
                </h3>
                <p className="text-indigo-400 font-black uppercase tracking-[0.2em] text-[10px]">Developer Payouts</p>
              </div>
            </div>
          </div>
        </section>

        {/* LOGOS SECTION */}
        <section className="w-full py-32 bg-[#09090b]">
          <div className="container px-4 md:px-6 mx-auto">
            <p className="text-center text-[10px] font-black text-gray-600 uppercase tracking-[0.4em] mb-16">Powering Agents at Global Teams</p>
            <div className="flex flex-wrap justify-center items-center gap-12 md:gap-24 opacity-40 hover:opacity-100 transition-all duration-1000">
              {companies.map((company) => (
                <div key={company.name} className="flex items-center gap-2 grayscale hover:grayscale-0 transition-all duration-500 hover:scale-110">
                  <div className="text-3xl font-black text-white tracking-tighter" style={{ color: company.color }}>{company.name}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* TESTIMONIALS SECTION */}
        <section className="w-full py-32 bg-gradient-to-b from-transparent via-indigo-500/5 to-transparent">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="text-center max-w-3xl mx-auto mb-24">
              <h2 className="text-5xl font-black tracking-tighter text-white mb-8">Architected for Production</h2>
              <p className="text-gray-400 text-xl font-medium leading-relaxed">Don't just take our word for it. Join the elite group of engineers deploying autonomous skills at scale.</p>
            </div>
            <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
              {testimonials.map((t, i) => (
                <motion.div 
                  key={t.name}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.6 }}
                  className="relative group p-10 bg-gray-900/40 border border-gray-800 rounded-[2.5rem] hover:border-indigo-500/40 transition-all duration-500 shadow-2xl hover:shadow-indigo-500/5"
                >
                  <div className="flex gap-1.5 text-amber-500 mb-8">
                    {[...Array(t.rating)].map((_, j) => (
                      <Star key={j} className="w-5 h-5 fill-current shadow-lg" />
                    ))}
                  </div>
                  <p className="text-gray-300 text-xl italic font-medium leading-relaxed mb-10">"{t.quote}"</p>
                  <div className="flex items-center gap-5 border-t border-gray-800/50 pt-8">
                    <img src={t.avatar} alt={t.name} className="w-14 h-14 rounded-2xl border-2 border-gray-800 shadow-2xl ring-2 ring-indigo-500/10" />
                    <div>
                      <p className="text-lg font-black text-white tracking-tight">{t.name}</p>
                      <p className="text-xs font-black text-indigo-400 uppercase tracking-widest">@{t.handle}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* RECENT INSTALLS TICKER */}
      <div className="fixed bottom-0 left-0 right-0 bg-black/90 backdrop-blur-2xl border-t border-gray-800/50 py-4 z-[100] shadow-2xl">
        <div className="container mx-auto px-4 flex items-center justify-center">
          <div className="flex items-center gap-4 overflow-hidden">
            <div className="flex items-center gap-2 bg-gray-900 border border-gray-800 px-3 py-1 rounded-full">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Live Flow</span>
            </div>
            <AnimatePresence mode="wait">
              <motion.div 
                key={currentInstallIndex}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.5, ease: "anticipate" }}
                className="text-xs md:text-sm font-mono font-bold tracking-tight"
              >
                <span className="text-indigo-400">{recentInstalls[currentInstallIndex].handle}</span> 
                <span className="text-gray-500 mx-3 uppercase text-[10px] font-black">linked</span> 
                <span className="text-white bg-white/5 px-2 py-1 rounded border border-white/10">{recentInstalls[currentInstallIndex].skill}</span> 
                <span className="text-gray-600 ml-4 font-black">{recentInstalls[currentInstallIndex].timeAgo}</span>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
