import Image from 'next/image';

export function EmptyState() {
    return (
        <div className="flex flex-col md:flex-row items-center justify-center gap-6 py-12 md:py-16">
            <div className="w-[150px] md:w-[200px] grayscale opacity-80">
                <Image
                    src="https://images.unsplash.com/photo-1588600878108-578307a3cc9d?w=400&fit=crop&q=60"
                    alt="No events"
                    width={200}
                    height={200}
                    className="object-contain mix-blend-multiply dark:mix-blend-screen"
                    unoptimized
                />
            </div>
            <div className="text-center md:text-left">
                <p className="text-gray-500 dark:text-gray-400 text-sm mb-1">
                    Oops! No active events here at the moment
                </p>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                    Be the first to know when something new comes up!
                </h3>
                <button className="border-2 border-blue-500 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-full px-6 py-2 font-bold text-sm transition-colors">
                    Notify Me!
                </button>
            </div>
        </div>
    );
}
