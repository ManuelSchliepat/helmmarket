'use client'

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { companies, placeholderSkills, testimonials, providers } from "@/lib/placeholder-data";
import { SkillCard } from "@/components/skills/SkillCard";
import { ArrowRight, Check } from "lucide-react";

export default function Home() {
  const featuredSkills = placeholderSkills.slice(0, 6);
  const mainTestimonial = testimonials[1]; // Guillermo Rauch

  return (
    <div className="flex flex-col min-h-screen bg-[#0a0a0a] text-zinc-400 selection:bg-indigo-500/30 selection:text-white">
      <main className="flex-1">
        
        {/* HERO SECTION */}
        <section className="relative pt-32 pb-20 md:pt-48 md:pb-32">
          <div className="container px-6 mx-auto relative z-10">
            <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              >
                <h1 className="text-5xl md:text-7xl font-semibold tracking-tight text-white mb-8">
                  The App Store for <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-b from-indigo-300 to-indigo-600">AI Agent Skills</span>
                </h1>
                <p className="mx-auto max-w-2xl text-lg md:text-xl text-zinc-400 leading-relaxed mb-12">
                  2,400 developers use Helm Market to discover, install and monetize 
                  typed, sandboxed AI skills. Built on the provider-agnostic Helm paradigm.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Button asChild size="lg" className="h-12 px-8 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full transition-all duration-300 shadow-lg shadow-indigo-500/20">
                    <Link href="/skills">Browse Marketplace</Link>
                  </Button>
                  <Button asChild variant="outline" size="lg" className="h-12 px-8 bg-transparent border-zinc-800 hover:border-zinc-600 text-white rounded-full transition-all duration-300">
                    <Link href="/onboarding">Publish & Earn</Link>
                  </Button>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* TRUST BAR */}
        <section className="py-12 border-y border-zinc-900 bg-zinc-900/20">
          <div className="container px-6 mx-auto">
            <div className="flex flex-wrap justify-center items-center gap-12 md:gap-24 opacity-40">
              {companies.map((company) => (
                <div key={company.name} className="text-xl md:text-2xl font-semibold text-white tracking-tighter grayscale">
                  {company.name}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SKILLS GRID */}
        <section className="py-32">
          <div className="container px-6 mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-16">
              <div className="max-w-xl text-left">
                <h2 className="text-2xl md:text-3xl font-medium text-white mb-4">Enterprise-grade skills</h2>
                <p className="text-zinc-400 leading-relaxed">
                  Discover production-ready skills for security, compliance, and industrial automation.
                </p>
              </div>
              <Link href="/skills" className="text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-2 group transition-colors">
                View all skills <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredSkills.map((skill, index) => (
                <SkillCard key={skill.id} skill={skill} index={index} />
              ))}
            </div>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section className="py-32 bg-zinc-900/10 border-y border-zinc-900">
          <div className="container px-6 mx-auto">
            <div className="text-center mb-24">
              <h2 className="text-2xl md:text-3xl font-medium text-white mb-4">Secure, Typed, Scalable</h2>
              <p className="text-zinc-400 max-w-xl mx-auto">The Helm paradigm ensures your agents are safe and efficient.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
              {[
                { title: 'Secure Sandbox', desc: 'Every skill runs in an isolated environment with fine-grained permission control.' },
                { title: 'Provider Agnostic', desc: 'Write once, run on any LLM. Swap backends without changing a single line of code.' },
                { title: 'Ready to Monetize', desc: 'Publish your skills and keep 70% of every installation. We handle the rest.' }
              ].map((step, i) => (
                <div key={i} className="flex flex-col items-center text-center">
                  <div className="w-12 h-12 bg-indigo-600/10 border border-indigo-500/20 rounded-2xl flex items-center justify-center mb-8 text-indigo-400">
                    <Check className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-medium text-white mb-4">{step.title}</h3>
                  <p className="text-zinc-400 leading-relaxed">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SINGLE TESTIMONIAL */}
        <section className="py-32">
          <div className="container px-6 mx-auto">
            <div className="max-w-4xl mx-auto bg-zinc-900 border border-zinc-800 rounded-[2rem] p-12 md:p-20 text-center">
              <blockquote className="text-2xl md:text-3xl text-white font-medium leading-tight mb-12 italic">
                "{mainTestimonial.quote}"
              </blockquote>
              <div className="flex flex-col items-center">
                <img src={mainTestimonial.avatar} alt={mainTestimonial.name} className="w-16 h-16 rounded-full mb-4 border border-zinc-800" />
                <div className="font-semibold text-white">{mainTestimonial.name}</div>
                <div className="text-zinc-500 font-medium">@{mainTestimonial.handle}</div>
              </div>
            </div>
          </div>
        </section>

        {/* FINAL CTA */}
        <section className="py-32">
          <div className="container px-6 mx-auto text-center">
            <div className="max-w-2xl mx-auto space-y-12">
              <h2 className="text-4xl md:text-5xl font-semibold tracking-tight text-white">Start building the future of autonomous agents</h2>
              <Button asChild size="lg" className="h-14 px-12 bg-white text-black hover:bg-zinc-200 rounded-full font-semibold transition-all duration-300">
                <Link href="/onboarding">Join 2,400+ Developers</Link>
              </Button>
            </div>
          </div>
        </section>

      </main>
    </div>
  );
}
