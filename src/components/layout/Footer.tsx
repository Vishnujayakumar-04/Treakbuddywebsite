'use client';

import Link from 'next/link';

import { usePathname } from 'next/navigation';

export function Footer() {
    const pathname = usePathname();
    const isAuthPage = ['/login', '/signup', '/forgot-password'].includes(pathname);

    if (isAuthPage) return null;

    return (
        <footer className="border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-600 dark:text-slate-400">
            <div className="container mx-auto px-4 max-w-7xl py-10 md:py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    <div className="space-y-4">
                        <Link href="/" className="flex items-center gap-2 group">
                            <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white font-bold shadow-lg shadow-cyan-500/20 group-hover:shadow-cyan-500/40 transition-all">
                                TB
                            </div>
                            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300">
                                TrekBuddy
                            </span>
                        </Link>
                        <p className="text-xs leading-relaxed max-w-xs text-slate-500 dark:text-slate-400 opacity-90">
                            Your intelligent companion for exploring the French Riviera of the East.
                            Crafted with ❤️ for Puducherry tourism.
                        </p>
                    </div>

                    <div>
                        <h4 className="font-semibold text-slate-900 dark:text-white mb-4 tracking-wide text-xs uppercase opacity-90">Explore</h4>
                        <ul className="space-y-3 text-xs">
                            <li><Link href="/dashboard/categories" className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-cyan-500 opacity-0 hover:opacity-100 transition-opacity" />Destinations</Link></li>
                            <li><Link href="/dashboard/planner" className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-cyan-500 opacity-0 hover:opacity-100 transition-opacity" />Trip Planner</Link></li>
                            <li><Link href="/dashboard/transit" className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-cyan-500 opacity-0 hover:opacity-100 transition-opacity" />Local Transport</Link></li>
                            <li><Link href="/dashboard/chat" className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-cyan-500 opacity-0 hover:opacity-100 transition-opacity" />AI Guide</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-semibold text-slate-900 dark:text-white mb-4 tracking-wide text-xs uppercase opacity-90">Company</h4>
                        <ul className="space-y-3 text-xs">
                            <li><Link href="/about" className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">About Us</Link></li>
                            <li><Link href="/blog" className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">Travel Blog</Link></li>
                            <li><Link href="/privacy" className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">Privacy Policy</Link></li>
                            <li><Link href="/terms" className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">Terms of Service</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-semibold text-slate-900 dark:text-white mb-4 tracking-wide text-xs uppercase opacity-90">Socials</h4>
                        <div className="flex space-x-3">
                            <a href="#" className="h-9 w-9 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center hover:bg-cyan-50 dark:hover:bg-cyan-900/30 hover:text-cyan-600 dark:hover:text-cyan-400 transition-all">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772 4.902 4.902 0 011.772-1.153c.636-.247 1.363-.416 2.427-.465 1.067-.047 1.407-.06 4.123-.06h.08v.002zm0-2c-2.643 0-2.987.012-4.043.06-1.064.049-1.791.218-2.427.465a6.08 6.08 0 00-2.229 1.258 6.08 6.08 0 00-1.258 2.229c-.247.636-.416 1.363-.465 2.427-.048 1.067-.06 1.407-.06 4.123v.08c0 2.643.012 2.987.06 4.043.049 1.064.218 1.791.465 2.427.247.644.593 1.229 1.018 1.732a6.08 6.08 0 002.229 1.258c.636.247 1.363.416 2.427.465 1.067.049 1.407.06 4.123.06h.08c2.643 0 2.987-.012 4.043-.06 1.064-.049 1.791-.218 2.427-.465a6.08 6.08 0 002.229-1.258 6.08 6.08 0 001.258-2.229c.247-.636.416-1.363.465-2.427.048-1.067.06-1.407.06-4.123v-.08c0-2.643-.012-2.987-.06-4.043-.049-1.064-.218-1.791-.465-2.427a6.08 6.08 0 00-1.258-2.229 6.08 6.08 0 00-2.229-1.258c-.636-.247-1.363-.416-2.427-.465-1.067-.049-1.407-.06-4.123-.06h-.08v.001zm-3.373 6.643h6.745v6.75h-6.745v-6.75zm5.51-5.51a1.233 1.233 0 100 2.466 1.233 1.233 0 000-2.466z" clipRule="evenodd" /></svg>
                            </a>
                            <a href="#" className="h-9 w-9 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center hover:bg-cyan-50 dark:hover:bg-cyan-900/30 hover:text-cyan-600 dark:hover:text-cyan-400 transition-all">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" /></svg>
                            </a>
                            <a href="#" className="h-9 w-9 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center hover:bg-cyan-50 dark:hover:bg-cyan-900/30 hover:text-cyan-600 dark:hover:text-cyan-400 transition-all">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd" /></svg>
                            </a>
                        </div>
                    </div>
                </div>

                <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-800 flex flex-col md:flex-row justify-between items-center text-xs gap-4 opacity-80 hover:opacity-100 transition-opacity">
                    <p>&copy; {new Date().getFullYear()} TrekBuddy. Made with Next.js</p>
                    <div className="flex gap-6">
                        <Link href="/privacy" className="hover:text-cyan-600 transition-colors">Privacy</Link>
                        <Link href="/terms" className="hover:text-cyan-600 transition-colors">Terms</Link>
                        <Link href="/sitemap" className="hover:text-cyan-600 transition-colors">Sitemap</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
