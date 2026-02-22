import Image from 'next/image';
import Link from 'next/link';

interface PopOutCardProps {
    title: string;
    bgColor: string;   // e.g. 'bg-blue-50'
    textColor: string; // e.g. 'text-blue-900'
    imageSrc: string;
    href?: string;
}

export function PopOutCard({ title, bgColor, textColor, imageSrc, href = "#" }: PopOutCardProps) {
    return (
        <Link href={href} className="block group">
            <div className="relative pt-10 h-[170px] w-full mt-4">
                {/* The Color Base Layer */}
                <div className={`absolute bottom-0 left-0 w-full h-[120px] rounded-2xl ${bgColor} transition-all duration-300 group-hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] group-hover:-translate-y-1`} />

                {/* Content Layer */}
                <div className="relative z-10 w-full h-full flex justify-between items-center px-6">

                    {/* Title Text */}
                    <div className="z-20 pt-4 pr-[75px] md:pr-[90px] w-full">
                        <h3 className={`text-[15px] md:text-[18px] lg:text-[20px] font-extrabold leading-tight ${textColor} group-hover:text-blue-600 transition-colors`}>
                            {title}
                        </h3>
                    </div>

                    {/* Pop-out Image container */}
                    <div className="absolute right-3 bottom-0 w-[70px] h-[95px] md:w-[90px] md:h-[120px] z-20 transition-transform duration-300 group-hover:-translate-y-2">
                        <div className="relative w-full h-full rounded-[14px] md:rounded-2xl overflow-hidden shadow-xl border-[3px] md:border-[4px] border-white dark:border-slate-800 bg-gray-100">
                            <Image
                                src={imageSrc}
                                alt={title}
                                fill
                                className="object-cover"
                                unoptimized
                            />
                        </div>
                    </div>

                </div>
            </div>
        </Link>
    );
}
