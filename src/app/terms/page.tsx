import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Footer } from '@/components/layout/Footer';

export const metadata = {
    title: 'Terms of Service | TrekBuddy',
    description: 'Terms of Service for TrekBuddy Puducherry travel companion.'
};

export default function TermsPage() {
    return (
        <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950">
            <div className="container mx-auto px-4 max-w-4xl py-12 md:py-20 flex-1">
                <Link href="/" className="inline-flex items-center text-sm font-semibold text-cyan-600 hover:text-cyan-700 dark:text-cyan-400 dark:hover:text-cyan-300 mb-8 transition-colors">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Home
                </Link>
                
                <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 md:p-12 shadow-sm border border-slate-200 dark:border-slate-800">
                    <h1 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white mb-6">Terms of Service</h1>
                    <p className="text-sm text-slate-500 mb-10">Last updated: {new Date().toLocaleDateString()}</p>

                    <div className="space-y-8 text-slate-600 dark:text-slate-300 leading-relaxed max-w-none prose dark:prose-invert prose-cyan">
                        <section>
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">1. Acceptance of Terms</h2>
                            <p>
                                By accessing or using TrekBuddy ("the Service"), you agree to be bound by these Terms of Service. 
                                If you disagree with any part of the terms, then you may not access the Service.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">2. Description of Service</h2>
                            <p>
                                TrekBuddy provides an AI-powered travel companion, itinerary planner, and local guide specifically 
                                tailored for tourism in Puducherry, India. The service includes, but is not limited to, interactive maps, 
                                generated guides, transit schedules, and recommendations.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">3. Accuracy of Information</h2>
                            <p>
                                While we strive to provide accurate and up-to-date information regarding transit, places, and events, 
                                TrekBuddy relies partly on AI generation and historical data. We do not guarantee the absolute accuracy 
                                of times, prices, or availability. Users should verify critical details (like transit timings or venue 
                                closures) independently.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">4. User Accounts</h2>
                            <p>
                                When you create an account with us, you must provide information that is accurate, complete, and current 
                                at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate 
                                termination of your account on our Service. You are responsible for safeguarding the password that you 
                                use to access the Service.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">5. Intellectual Property</h2>
                            <p>
                                The Service and its original content (excluding User Content), features, and functionality are and will 
                                remain the exclusive property of TrekBuddy and its licensors. Our trademarks and trade dress may not be 
                                used in connection with any product or service without the prior written consent of TrekBuddy. Any 
                                user-generated trips or reviews become part of the platform's non-exclusive data pool to improve AI routing.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">6. Limitation of Liability</h2>
                            <p>
                                In no event shall TrekBuddy, nor its directors, employees, partners, agents, suppliers, or affiliates, 
                                be liable for any indirect, incidental, special, consequential or punitive damages, including without 
                                limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your 
                                travel experiences or use of the application.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">7. Contact Information</h2>
                            <p>
                                If you have any questions about these Terms, please contact us at support@trekbuddy.app.
                            </p>
                        </section>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}
