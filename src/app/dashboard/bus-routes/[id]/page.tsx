'use client';

import Link from 'next/link';
import { use } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Clock, MapPin, IndianRupee } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// Mock Data
const ROUTE_DATA = {
    id: '1A',
    name: 'New Bus Stand to Gorimedu',
    startPoint: 'New Bus Stand',
    endPoint: 'Gorimedu',
    stops: [
        'New Bus Stand',
        'Orleanpet',
        'Nellithope',
        'Indira Gandhi Square',
        'Kathirkamam',
        'Shanmugapuram',
        'Mettupalayam',
        'Gorimedu'
    ],
    firstBus: '05:30 AM',
    lastBus: '10:30 PM',
    frequency: 'Every 10 mins',
    fare: '₹5 - ₹15'
};

interface PageProps {
    params: Promise<{ id: string }>;
}

export default function BusRouteDetailPage({ params }: PageProps) {
    const { id } = use(params);

    // In real app, fetch route details
    const route = { ...ROUTE_DATA, id };

    return (
        <div className="container py-8 max-w-3xl">
            <div className="mb-6">
                <Button variant="ghost" className="gap-2 pl-0 hover:pl-2 transition-all" asChild>
                    <Link href="/dashboard/bus-routes">
                        <ArrowLeft className="w-4 h-4" /> Back to Routes
                    </Link>
                </Button>
            </div>

            <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-8">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <Badge className="text-lg px-3 py-1 bg-primary">{route.id}</Badge>
                        <h1 className="text-2xl font-bold">{route.name}</h1>
                    </div>
                    <p className="text-muted-foreground flex items-center gap-2">
                        <MapPin className="w-4 h-4" /> {route.startPoint} <span className="text-xs">to</span> {route.endPoint}
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <Card>
                    <CardContent className="flex flex-col items-center justify-center p-6 text-center">
                        <Clock className="w-8 h-8 text-primary mb-2" />
                        <span className="text-sm text-muted-foreground">Frequency</span>
                        <span className="font-bold">{route.frequency}</span>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="flex flex-col items-center justify-center p-6 text-center">
                        <Clock className="w-8 h-8 text-secondary mb-2" />
                        <span className="text-sm text-muted-foreground">Operating Hours</span>
                        <span className="font-bold">{route.firstBus} - {route.lastBus}</span>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="flex flex-col items-center justify-center p-6 text-center">
                        <IndianRupee className="w-8 h-8 text-green-600 mb-2" />
                        <span className="text-sm text-muted-foreground">Fare Range</span>
                        <span className="font-bold">{route.fare}</span>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Route Stops</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="relative border-l-2 border-muted ml-3 space-y-8 my-4">
                        {route.stops.map((stop, index) => (
                            <div key={index} className="relative pl-8">
                                <span className={`absolute -left-[9px] top-1 w-4 h-4 rounded-full border-2 ${index === 0 || index === route.stops.length - 1
                                    ? 'bg-primary border-primary'
                                    : 'bg-background border-muted-foreground'
                                    }`} />
                                <h3 className={`text-lg ${index === 0 || index === route.stops.length - 1
                                    ? 'font-bold text-foreground'
                                    : 'font-medium text-muted-foreground'
                                    }`}>
                                    {stop}
                                </h3>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
