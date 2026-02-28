'use client'

import Link from "next/link";
import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Zap, ChevronRight } from "lucide-react";

export function Header() {
  return (
    <header className="px-6 lg:px-10 h-20 flex items-center border-b border-gray-800/50 bg-[#09090b]/80 backdrop-blur-xl sticky top-0 z-50">
      <Link className="flex items-center justify-center gap-3 group" href="/">
        <div className="w-10 h-10 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-600/20 group-hover:scale-110 transition-transform duration-500">
          <Zap className="w-6 h-6 text-white fill-current" />
        </div>
        <span className="font-black text-2xl text-white tracking-tighter">Helm Market</span>
      </Link>
      
      <nav className="ml-16 hidden lg:flex items-center gap-8">
        <Link className="text-sm font-bold text-gray-400 hover:text-white transition-colors" href="/skills">
          Marketplace
        </Link>
        <Link className="text-sm font-bold text-gray-400 hover:text-white transition-colors" href="/onboarding">
          For Developers
        </Link>
        <Link className="text-sm font-bold text-gray-400 hover:text-white transition-colors" href="#">
          Documentation
        </Link>
      </nav>

      <div className="ml-auto flex items-center gap-4">
        <SignedOut>
          <SignInButton mode="modal">
            <Button size="sm" className="bg-white text-black hover:bg-gray-200 h-11 px-6 rounded-xl font-black text-xs uppercase tracking-widest shadow-xl transition-all active:scale-95">
              Join Community
            </Button>
          </SignInButton>
        </SignedOut>
        <SignedIn>
          <Button variant="ghost" asChild className="hidden sm:flex text-gray-400 hover:text-white hover:bg-gray-800/50 font-bold rounded-xl mr-2">
            <Link href="/dashboard" className="flex items-center gap-2">
              Console <ChevronRight className="w-4 h-4" />
            </Link>
          </Button>
          <UserButton 
            afterSignOutUrl="/" 
            appearance={{ 
              elements: { 
                avatarBox: "w-10 h-10 rounded-xl ring-2 ring-indigo-500/20 shadow-lg shadow-indigo-500/10",
                userButtonPopoverCard: "bg-[#0c0c0e] border border-gray-800 rounded-2xl p-2 shadow-2xl"
              } 
            }} 
          />
        </SignedIn>
      </div>
    </header>
  );
}
