import Link from "next/link";

export function Footer() {
  const links = [
    { label: 'Marketplace', href: '/skills' },
    { label: 'Publish', href: '/onboarding' },
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Docs', href: '#' },
    { label: 'Twitter', href: '#' },
    { label: 'GitHub', href: '#' }
  ]

  return (
    <footer className="w-full py-24 bg-[#0a0a0a] border-t border-zinc-900/50 text-zinc-500">
      <div className="container px-6 mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start gap-12 mb-24">
          <div className="max-w-xs">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-6 h-6 bg-zinc-800 rounded flex items-center justify-center">
                <div className="w-3 h-3 bg-zinc-400 rounded-sm" />
              </div>
              <span className="font-semibold text-white tracking-tight">Helm Market</span>
            </div>
            <p className="text-sm leading-relaxed">
              The capabilites infrastructure for autonomous agents. Built on open standards.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-16 gap-y-8">
            {links.map(link => (
              <Link key={link.label} href={link.href} className="text-sm font-medium hover:text-white transition-colors">
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center gap-6 pt-12 border-t border-zinc-900 text-xs font-medium uppercase tracking-widest text-zinc-600">
          <p>© 2024 Helm Market by Skilld.</p>
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
              Operational
            </div>
            <Link href="#" className="hover:text-zinc-400 transition-colors">Privacy</Link>
            <Link href="#" className="hover:text-zinc-400 transition-colors">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
