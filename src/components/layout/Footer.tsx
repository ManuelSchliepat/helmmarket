import Link from "next/link";
import { ShieldCheck, Zap } from "lucide-react";

export function Footer() {
  const year = new Date().getFullYear();
  
  return (
    <footer className="w-full py-20 bg-[#09090b] border-t border-gray-800/50 text-gray-500 relative">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20">
          <div className="flex flex-col gap-6 max-w-xs">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-600/20 group-hover:scale-110 transition-transform duration-500">
                <Zap className="w-6 h-6 text-white fill-current" />
              </div>
              <span className="font-black text-2xl text-white tracking-tighter">Helm Market</span>
            </Link>
            <p className="text-sm font-medium leading-relaxed">
              The App Store for AI Agent Skills. Built on typed, sandboxed protocols for the modern autonomous web.
            </p>
            <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] bg-gray-900 w-fit px-4 py-2 rounded-full border border-gray-800">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-emerald-500">Systems Operational</span>
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <span className="font-black text-white uppercase text-[10px] tracking-widest">Platform</span>
            <div className="flex flex-col gap-4 text-sm font-bold">
              <Link href="/skills" className="hover:text-white transition-colors">Marketplace</Link>
              <Link href="/publish" className="hover:text-white transition-colors">Publish Skill</Link>
              <Link href="/dashboard" className="hover:text-white transition-colors">Developer Console</Link>
              <Link href="#" className="hover:text-white transition-colors">API Reference</Link>
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <span className="font-black text-white uppercase text-[10px] tracking-widest">Resources</span>
            <div className="flex flex-col gap-4 text-sm font-bold">
              <Link href="#" className="hover:text-white transition-colors">Documentation</Link>
              <Link href="#" className="hover:text-white transition-colors">Changelog</Link>
              <Link href="#" className="hover:text-white transition-colors">Status Page</Link>
              <Link href="#" className="hover:text-white transition-colors">Help Center</Link>
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <span className="font-black text-white uppercase text-[10px] tracking-widest">Connect</span>
            <div className="flex flex-col gap-4 text-sm font-bold">
              <Link href="#" className="hover:text-white transition-colors">Twitter / X</Link>
              <Link href="#" className="hover:text-white transition-colors">GitHub</Link>
              <Link href="#" className="hover:text-white transition-colors">Discord Community</Link>
              <Link href="#" className="hover:text-white transition-colors">Contact Sales</Link>
            </div>
          </div>
        </div>

        <div className="pt-10 border-t border-gray-800/50 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-6 text-[11px] font-bold uppercase tracking-widest">
            <p>© 2024 Helm Market by Skilld.</p>
            <Link href="#" className="hover:text-white">Privacy</Link>
            <Link href="#" className="hover:text-white">Terms</Link>
            <Link href="#" className="hover:text-white">Cookies</Link>
          </div>
          <div className="flex items-center gap-2 text-xs font-bold text-gray-600 uppercase tracking-widest">
            <ShieldCheck className="w-4 h-4" />
            <span>SSL SECURED • AES-256 ENCRYPTION</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
