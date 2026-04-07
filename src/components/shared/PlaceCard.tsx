'use client';

import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Star, MapPin } from 'lucide-react';

interface PlaceCardProps {
    id: string;
    name: string;
    category: string;
    rating: number;
    location: string;
    image: string;
}

export function PlaceCard({ id, name, category, rating, location, image }: PlaceCardProps) {
    return (
        <Card className="overflow-hidden group hover:shadow-lg transition-all duration-300">
            <div className="relative h-48 overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    src={image}
                    alt={name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <Badge className="absolute top-3 right-3 bg-white/90 text-black shadow-sm pointer-events-none">
                    {category}
                </Badge>
            </div>
            <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-lg line-clamp-1">{name}</h3>
                    <div className="flex items-center bg-yellow-100 text-yellow-800 px-1.5 py-0.5 rounded text-xs font-bold">
                        <Star className="w-3 h-3 fill-yellow-600 mr-1" />
                        {rating}
                    </div>
                </div>

                <div className="flex items-center text-muted-foreground text-sm mb-4">
                    <MapPin className="w-3 h-3 mr-1" />
                    <span className="line-clamp-1">{location}</span>
                </div>

                <Button asChild className="w-full">
                    <Link href={`/dashboard/places/${id}`}>View Details</Link>
                </Button>
            </CardContent>
        </Card>
    );
}
