import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Heyama Cloud',
  description: 'Heyama DEV Exam – Object Collection Manager',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-slate-50 min-h-screen text-slate-900 font-sans antialiased">
        <div className="flex flex-col min-h-screen">
          <header className="sticky top-0 z-40 w-full border-b bg-white/80 backdrop-blur-md">
            <div className="container mx-auto max-w-7xl px-4 h-16 flex items-center justify-between">
              <div className="flex items-center gap-2.5 group cursor-pointer">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center shadow-indigo-200 shadow-lg group-hover:scale-105 transition-transform">
                  <span className="text-white text-sm font-bold">H</span>
                </div>
                <div>
                  <h1 className="font-bold text-xl tracking-tight text-slate-800">Heyama<span className="text-indigo-600">Cloud</span></h1>
                  <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider -mt-1">Object Manager</p>
                </div>
              </div>
              <nav className="hidden md:flex items-center gap-6">
                <a href="#" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">Dashboard</a>
              </nav>
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-full bg-slate-200 border border-slate-300" />
              </div>
            </div>
          </header>
          <main className="flex-1 container mx-auto max-w-7xl px-4 py-8">
            {children}
          </main>
          <footer className="border-t bg-white py-6">
            <div className="container mx-auto max-w-7xl px-4 text-center">
              <p className="text-sm text-slate-400">© {new Date().getFullYear()} Heyama Cloud. Built for performance.</p>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
