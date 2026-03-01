'use client'

import Link from "next/link";
import Image from "next/image";
import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n-context";

export function Header() {
  const { t } = useI18n();

  return (
    <header className="fixed top-0 left-0 right-0 z-[100] h-16 border-b border-zinc-800/50 bg-black/50 backdrop-blur-xl">
      <div className="container px-6 mx-auto h-full flex items-center justify-between">
        <Link className="flex items-center gap-2.5 transition-opacity hover:opacity-90" href="/">
          <Image 
            src="/logo-mark.svg" 
            alt="Helm Market Logo" 
            width={24} 
            height={24} 
            className="rounded shadow-sm"
          />
          <span className="font-semibold text-lg text-white tracking-tight">Helm Market</span>
        </Link>
        
        <nav className="hidden md:flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
          <Link className="text-sm font-medium text-zinc-400 hover:text-white transition-colors" href="/skills">
            {t('marketplace')}
          </Link>
          <Link className="text-sm font-medium text-zinc-400 hover:text-white transition-colors" href="/onboarding">
            {t('developers')}
          </Link>
          <Link className="text-sm font-medium text-zinc-400 hover:text-white transition-colors" href="/docs/quickstart">
            {t('docs')}
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          <SignedOut>
            <SignInButton mode="modal">
              <Button size="sm" className="bg-white text-black hover:bg-zinc-200 h-9 px-4 rounded-full font-medium text-sm transition-all active:scale-95">
                {t('signIn')}
              </Button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <Link href="/settings" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors mr-2">
              {t('settings')}
            </Link>
            <Link href="/agent-console" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors mr-2">
              Agent Console
            </Link>
            <Link href="/dashboard" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors mr-2">
              {t('console')}
            </Link>
            <UserButton 
              afterSignOutUrl="/" 
              appearance={{ 
                elements: { 
                  avatarBox: "w-8 h-8 rounded-full border border-zinc-800",
                  userButtonPopoverCard: "bg-zinc-900 border border-zinc-800 rounded-xl"
                } 
              }} 
            />
          </SignedIn>
        </div>
      </div>
    </header>
  );
}
