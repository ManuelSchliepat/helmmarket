'use client'

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { companies, placeholderSkills, testimonials } from "@/lib/placeholder-data";
import { SkillCard } from "@/components/skills/SkillCard";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { useI18n } from "@/lib/i18n-context";

export default function Home() {
  const { t } = useI18n();
  const featuredSkills = placeholderSkills.slice(0, 3);
  const mainTestimonial = testimonials[1];

  return (
    <div className="flex flex-col min-h-screen bg-[#0a0a0a] selection-indigo">
      <main className="flex-1">
        
        {/* HERO SECTION */}
        <section className="relative pt-48 pb-32 overflow-hidden">
          <div className="container px-6 mx-auto relative z-10">
            <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              >
                <h1 className="text-5xl md:text-7xl font-semibold tracking-tight text-white mb-8 leading-[1.1]">
                  {t('heroTitle')} <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-b from-indigo-300 to-indigo-600">{t('heroTitleAccent')}</span>
                </h1>
                <p className="mx-auto max-w-2xl text-lg md:text-xl text-zinc-400 leading-relaxed mb-12">
                  {t('heroSub')}
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Button asChild size="lg" className="h-12 px-8 bg-white text-black hover:bg-zinc-200 rounded-full font-medium transition-all shadow-lg">
                    <Link href="/skills">{t('getStarted')}</Link>
                  </Button>
                  <Button asChild variant="outline" size="lg" className="h-12 px-8 bg-transparent border-zinc-800 hover:border-zinc-600 text-white rounded-full font-medium transition-all">
                    <Link href="/onboarding">{t('sellSkills')}</Link>
                  </Button>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* TRUST LOGOS */}
        <section className="py-24 border-y border-zinc-900/50">
          <div className="container px-6 mx-auto">
            <div className="flex flex-wrap justify-center items-center gap-12 md:gap-20 opacity-30 grayscale contrast-125">
              {companies.map((company) => (
                <div key={company.name} className="text-xl md:text-2xl font-bold text-white tracking-tighter">
                  {company.name}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FEATURED SKILLS */}
        <section className="py-32">
          <div className="container px-6 mx-auto">
            <div className="max-w-xl mb-24">
              <h2 className="text-3xl font-medium text-white mb-6 tracking-tight">{t('verifiedSkills')}</h2>
              <p className="text-zinc-400 text-lg leading-relaxed">
                {t('verifiedSub')}
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredSkills.map((skill, index) => (
                <SkillCard key={skill.id} skill={skill} index={index} />
              ))}
            </div>
            
            <div className="mt-16 flex justify-center">
              <Link href="/skills" className="text-sm font-medium text-zinc-500 hover:text-white flex items-center gap-2 group transition-colors">
                {t('viewAll')} <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </section>

        {/* HOW IT WORKS / FEATURES */}
        <section className="py-32 bg-zinc-900/20 border-y border-zinc-900/50">
          <div className="container px-6 mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
              {[
                { title: t('secureSandbox'), desc: t('secureSandboxSub') },
                { title: t('typeSafe'), desc: t('typeSafeSub') },
                { title: t('providerAgnostic'), desc: t('providerAgnosticSub') }
              ].map((feature, i) => (
                <div key={i} className="flex flex-col">
                  <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-indigo-500 mb-8 shadow-sm">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-medium text-white mb-4 tracking-tight">{feature.title}</h3>
                  <p className="text-zinc-400 leading-relaxed text-sm">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* TESTIMONIAL */}
        <section className="py-32">
          <div className="container px-6 mx-auto text-center">
            <div className="mb-12">
              <img src={mainTestimonial.avatar} alt={mainTestimonial.name} className="w-16 h-16 rounded-full mx-auto border border-zinc-800 mb-6 shadow-xl" />
              <div className="font-medium text-white">{mainTestimonial.name}</div>
              <div className="text-zinc-500 text-sm">@{mainTestimonial.handle}</div>
            </div>
            <blockquote className="text-2xl md:text-4xl text-white font-medium tracking-tight leading-tight italic">
              "{mainTestimonial.quote}"
            </blockquote>
          </div>
        </section>

        {/* FINAL CTA */}
        <section className="py-48">
          <div className="container px-6 mx-auto text-center">
            <h2 className="text-4xl md:text-6xl font-semibold text-white mb-12 tracking-tight">{t('readyToAugment')}</h2>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button asChild size="lg" className="h-14 px-10 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full font-medium transition-all shadow-lg shadow-indigo-600/20">
                <Link href="/skills">{t('getStarted')}</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="h-14 px-10 bg-transparent border-zinc-800 hover:border-zinc-600 text-white rounded-full font-medium transition-all">
                <Link href="/onboarding">{t('sellSkills')}</Link>
              </Button>
            </div>
          </div>
        </section>

      </main>
    </div>
  );
}
