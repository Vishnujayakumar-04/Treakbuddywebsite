import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Footer } from '@/components/layout/Footer';

export const metadata = {
    title: 'Privacy Policy | TrekBuddy',
    description: 'Privacy Policy for TrekBuddy Puducherry travel companion.'
};

export default function PrivacyPage() {
    return (
        <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950">
            <div className="container mx-auto px-4 max-w-4xl py-12 md:py-20 flex-1">
                <Link href="/" className="inline-flex items-center text-sm font-semibold text-cyan-600 hover:text-cyan-700 dark:text-cyan-400 dark:hover:text-cyan-300 mb-8 transition-colors">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Home
                </Link>
                
                <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 md:p-12 shadow-sm border border-slate-200 dark:border-slate-800">
                    <h1 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white mb-6">Privacy Policy</h1>
                    <p className="text-sm text-slate-500 mb-10">Last updated: {new Date().toLocaleDateString()}</p>

                    <div className="space-y-8 text-slate-600 dark:text-slate-300 leading-relaxed max-w-none prose dark:prose-invert prose-cyan">
                        <section>
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">1. Introduction</h2>
                            <p>
                                Welcome to TrekBuddy. We respect your privacy and are committed to protecting your personal data. 
                                This privacy policy will inform you as to how we look after your personal data when you visit our 
                                website and tell you about your privacy rights.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">2. The Data We Collect</h2>
                            <p>We may collect, use, store and transfer different kinds of personal data about you which we have grouped together as follows:</p>
                            <ul className="list-disc pl-6 space-y-2 mt-4">
                                <li><strong>Identity Data</strong> includes first name, last name, username, or similar identifier.</li>
                                <li><strong>Contact Data</strong> includes email address and telephone numbers.</li>
                                <li><strong>Technical Data</strong> includes internet protocol (IP) address, your login data, browser type and version, time zone setting, and operating system.</li>
                                <li><strong>Profile Data</strong> includes your username and password, your interests, preferences, and feedback.</li>
                                <li><strong>Usage Data</strong> includes information about how you use our website, products and services.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">3. How We Use Your Data</h2>
                            <p>
                                We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:
                            </p>
                            <ul className="list-disc pl-6 space-y-2 mt-4">
                                <li>Where we need to perform the contract we are about to enter into or have entered into with you (e.g., providing travel itineraries).</li>
                                <li>Where it is necessary for our legitimate interests and your interests and fundamental rights do not override those interests.</li>
                                <li>Where we need to comply with a legal obligation.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">4. Data Security</h2>
                            <p>
                                We have put in place appropriate security measures to prevent your personal data from being accidentally lost, 
                                used or accessed in an unauthorized way, altered, or disclosed. In addition, we limit access to your personal data 
                                to those employees, agents, contractors, and other third parties who have a business need to know.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">5. Third-Party Links & AI Services</h2>
                            <p>
                                This website may include links to third-party websites, plug-ins, and applications. Our AI itinerary generation 
                                relies on the Groq API. Your prompts and general travel preferences may be processed by these systems to generate 
                                results, but we do not send personally identifiable information to third-party LLMs.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">6. Contact Us</h2>
                            <p>
                                If you have any questions about this privacy policy or our privacy practices, please contact us at privacy@trekbuddy.app.
                            </p>
                        </section>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}
