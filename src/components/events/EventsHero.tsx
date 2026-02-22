import Image from 'next/image';
import { Plus } from 'lucide-react';

export function EventsHero() {
    return (
        <div className="container max-w-[1280px] mx-auto px-4 py-8">
            <div className="relative w-full h-[400px] md:h-[320px] rounded-3xl overflow-hidden bg-gradient-to-r from-[#0074e4] via-[#3b9df0] to-[#80cbf8]">

                {/* Content */}
                <div className="relative z-20 h-full flex flex-col justify-center px-8 md:px-12 w-full md:w-[60%]">
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                        All Events in Pondicherry
                    </h1>
                    <p className="text-white/95 text-base md:text-lg max-w-xl font-medium leading-relaxed">
                        Discover the best things to do & events in Pondicherry. Explore concerts, meetups, open mics, art shows, music events and a lot more.
                    </p>
                </div>

                {/* Monument Illustration Right Side */}
                {/* Background Pattern Layer */}
                <div className="absolute right-0 bottom-0 h-full w-full md:w-[60%] z-10 opacity-90 mix-blend-luminosity pointer-events-none">
                    {/* We use a relevant generic travel vector or monument image here as placeholder for the India Monuments. */}
                    <Image
                        src="https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=1200&auto=format&fit=crop&q=80"
                        alt="Indian Monuments Silhouette"
                        fill
                        className="object-cover object-bottom opacity-30 mask-image:linear-gradient(to_left,white,transparent)"
                        unoptimized
                    />
                </div>
            </div>
        </div>
    );
}
