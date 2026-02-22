'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Phone, MapPin, Clock, Star, Car, Shield, CheckCircle2, ExternalLink } from 'lucide-react';
import { getTransitItems, seedTransitData } from '@/services/transitService';
import { TransitItem } from '@/utils/seedTransitData';

interface RentalClientProps {
    id: string;
}

export default function RentalClient({ id }: RentalClientProps) {
    const router = useRouter();
    const [rental, setRental] = useState<TransitItem | null>(null);
    const [similarRentals, setSimilarRentals] = useState<TransitItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [seeding, setSeeding] = useState(false);

    useEffect(() => {
        async function loadData() {
            try {
                const allRentals = await getTransitItems('rentals');
                const current = allRentals.find(r => r.id === id);
                setRental(current || null);

                // Get similar rentals (same subcategory, different shop)
                if (current) {
                    const similar = allRentals
                        .filter(r => r.subCategory === current.subCategory && r.id !== current.id)
                        .slice(0, 3);
                    setSimilarRentals(similar);
                }
            } catch (error) {
                console.error('Error loading rental:', error);
            } finally {
                setLoading(false);
            }
        }
        loadData();
    }, [id]);

    const handleRepairData = async () => {
        setSeeding(true);
        try {
            await seedTransitData();
            window.location.reload();
        } catch (error) {
            console.error("Failed to repair data:", error);
            alert("Failed to update data. Please try refreshing manually.");
        } finally {
            setSeeding(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
            </div>
        );
    }

    if (!rental) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center space-y-4">
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Rental shop not found</h1>
                <p className="text-slate-500 max-w-md text-center">
                    The shop data might be missing or outdated. Try refreshing the database.
                </p>
                <div className="flex gap-4">
                    <Button onClick={() => router.back()} variant="outline">Go Back</Button>
                    <Button onClick={handleRepairData} disabled={seeding}>
                        {seeding ? 'Updating...' : 'Check & Update Data'}
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
            {/* Hero Section */}
            <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-16 relative overflow-hidden">
                <div className="absolute inset-0 bg-black/10"></div>
                <div className="container mx-auto px-4 max-w-5xl relative z-10">
                    <Button
                        onClick={() => router.back()}
                        variant="ghost"
                        className="text-white hover:bg-white/20 mb-6"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Rentals
                    </Button>

                    <Badge className="bg-white/20 text-white border-white/30 mb-4">
                        {rental.subCategory}
                    </Badge>

                    <h1 className="text-4xl md:text-5xl font-bold mb-4">{rental.name}</h1>

                    <div className="flex items-center gap-4 flex-wrap">
                        <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
                            <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                            <span className="font-bold text-lg">{rental.rating}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <MapPin className="w-5 h-5" />
                            <span className="text-sm">{rental.location}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Section */}
            <div className="container mx-auto px-4 max-w-5xl py-8">
                <div className="grid md:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="md:col-span-2 space-y-6">
                        {/* About Section */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-lg border border-slate-200 dark:border-slate-800"
                        >
                            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">About This Shop</h2>
                            <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                                {rental.description}
                            </p>
                            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                                Experience the best {rental.subCategory?.toLowerCase() || 'vehicle'} rental service in Pondicherry.
                                Whether you're exploring White Town, beach hopping, or planning trips to Auroville,
                                we provide well-maintained vehicles with excellent customer service.
                            </p>
                        </motion.div>

                        {/* Available Vehicles */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-lg border border-slate-200 dark:border-slate-800"
                        >
                            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Available Vehicles</h2>
                            <div className="grid sm:grid-cols-2 gap-4">
                                {rental.subCategory === 'Bike' ? (
                                    <>
                                        <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-4">
                                            <h3 className="font-bold text-slate-900 dark:text-white mb-2">Royal Enfield</h3>
                                            <p className="text-sm text-slate-600 dark:text-slate-400">Classic 350, Bullet, Himalayan</p>
                                        </div>
                                        <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-4">
                                            <h3 className="font-bold text-slate-900 dark:text-white mb-2">Sports Bikes</h3>
                                            <p className="text-sm text-slate-600 dark:text-slate-400">Pulsar NS200, Apache RTR, KTM Duke</p>
                                        </div>
                                        <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-4">
                                            <h3 className="font-bold text-slate-900 dark:text-white mb-2">Standard Bikes</h3>
                                            <p className="text-sm text-slate-600 dark:text-slate-400">Pulsar 150, FZ, Gixxer</p>
                                        </div>
                                        <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-4">
                                            <h3 className="font-bold text-slate-900 dark:text-white mb-2">Cruiser Bikes</h3>
                                            <p className="text-sm text-slate-600 dark:text-slate-400">Avenger, Intruder</p>
                                        </div>
                                    </>
                                ) : rental.subCategory === 'Scooty' ? (
                                    <>
                                        <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-4">
                                            <h3 className="font-bold text-slate-900 dark:text-white mb-2">Honda Activa</h3>
                                            <p className="text-sm text-slate-600 dark:text-slate-400">Activa 5G, 6G, 125</p>
                                        </div>
                                        <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-4">
                                            <h3 className="font-bold text-slate-900 dark:text-white mb-2">TVS Scooters</h3>
                                            <p className="text-sm text-slate-600 dark:text-slate-400">Jupiter, Ntorq, Wego</p>
                                        </div>
                                        <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-4">
                                            <h3 className="font-bold text-slate-900 dark:text-white mb-2">Suzuki Access</h3>
                                            <p className="text-sm text-slate-600 dark:text-slate-400">Access 125, Burgman Street</p>
                                        </div>
                                        <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-4">
                                            <h3 className="font-bold text-slate-900 dark:text-white mb-2">Yamaha</h3>
                                            <p className="text-sm text-slate-600 dark:text-slate-400">Ray ZR, Fascino</p>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-4">
                                            <h3 className="font-bold text-slate-900 dark:text-white mb-2">Hatchbacks</h3>
                                            <p className="text-sm text-slate-600 dark:text-slate-400">Swift, i20, Baleno</p>
                                        </div>
                                        <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-4">
                                            <h3 className="font-bold text-slate-900 dark:text-white mb-2">Sedans</h3>
                                            <p className="text-sm text-slate-600 dark:text-slate-400">Dzire, Amaze, City</p>
                                        </div>
                                    </>
                                )}
                            </div>
                        </motion.div>

                        {/* Required Documents */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.15 }}
                            className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-lg border border-slate-200 dark:border-slate-800"
                        >
                            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Required Documents</h2>
                            <div className="space-y-3">
                                <div className="flex items-start gap-3 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
                                    <CheckCircle2 className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                                    <div>
                                        <h3 className="font-semibold text-slate-900 dark:text-white">Valid Driving License</h3>
                                        <p className="text-sm text-slate-600 dark:text-slate-400">Original DL for two-wheelers (non-gear or with gear based on vehicle)</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                                    <CheckCircle2 className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                                    <div>
                                        <h3 className="font-semibold text-slate-900 dark:text-white">Government ID Proof</h3>
                                        <p className="text-sm text-slate-600 dark:text-slate-400">Aadhar Card, Passport, or Voter ID (original + photocopy)</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3 p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg border border-emerald-200 dark:border-emerald-800">
                                    <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                                    <div>
                                        <h3 className="font-semibold text-slate-900 dark:text-white">Security Deposit</h3>
                                        <p className="text-sm text-slate-600 dark:text-slate-400">
                                            {rental.subCategory === 'Car' ? '₹3,000 - ₹8,000' : '₹500 - ₹2,000'} (refundable upon return)
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
                                    <CheckCircle2 className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                                    <div>
                                        <h3 className="font-semibold text-slate-900 dark:text-white">Contact Information</h3>
                                        <p className="text-sm text-slate-600 dark:text-slate-400">Local contact number and emergency contact</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Rental Terms */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-lg border border-slate-200 dark:border-slate-800"
                        >
                            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Rental Terms & Conditions</h2>
                            <div className="space-y-4">
                                <div>
                                    <h3 className="font-semibold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                                        <div className="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 text-sm">1</div>
                                        Fuel Policy
                                    </h3>
                                    <p className="text-sm text-slate-600 dark:text-slate-400 ml-8">
                                        Vehicle is provided with minimal fuel. You pay for the fuel you use. Return with same fuel level to avoid charges.
                                    </p>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                                        <div className="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 text-sm">2</div>
                                        Rental Duration
                                    </h3>
                                    <p className="text-sm text-slate-600 dark:text-slate-400 ml-8">
                                        Minimum 1 day (24 hours). Extra hours charged proportionally. Weekly/monthly packages available at discounted rates.
                                    </p>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                                        <div className="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 text-sm">3</div>
                                        Helmet & Safety
                                    </h3>
                                    <p className="text-sm text-slate-600 dark:text-slate-400 ml-8">
                                        Helmet(s) provided free of charge. Mandatory to wear while riding. Follow all traffic rules.
                                    </p>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                                        <div className="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 text-sm">4</div>
                                        Damage & Theft
                                    </h3>
                                    <p className="text-sm text-slate-600 dark:text-slate-400 ml-8">
                                        Customer responsible for any damage or loss. Report to police immediately in case of theft. Insurance covers major accidents (terms apply).
                                    </p>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                                        <div className="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 text-sm">5</div>
                                        Cancellation Policy
                                    </h3>
                                    <p className="text-sm text-slate-600 dark:text-slate-400 ml-8">
                                        Free cancellation up to 24 hours before pickup. 50% refund within 12 hours. No refund after pickup.
                                    </p>
                                </div>
                            </div>
                        </motion.div>

                        {/* Similar Rentals */}
                        {similarRentals.length > 0 && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-lg border border-slate-200 dark:border-slate-800"
                            >
                                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Similar Shops</h2>
                                <div className="grid sm:grid-cols-3 gap-4">
                                    {similarRentals.map((similar) => (
                                        <button
                                            key={similar.id}
                                            onClick={() => router.push(`/dashboard/transit/rentals/${similar.id}`)}
                                            className="text-left bg-slate-50 dark:bg-slate-800 rounded-xl p-4 hover:shadow-md transition-all"
                                        >
                                            <h3 className="font-bold text-slate-900 dark:text-white mb-2 line-clamp-1">{similar.name}</h3>
                                            <div className="flex items-center gap-1 text-sm text-amber-600 mb-2">
                                                <Star className="w-4 h-4 fill-amber-400" />
                                                <span>{similar.rating}</span>
                                            </div>
                                            <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">{similar.location}</p>
                                        </button>
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Visit Information */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-lg border border-slate-200 dark:border-slate-800 sticky top-6"
                        >
                            <h3 className="font-bold text-slate-900 dark:text-white mb-4">Visit Information</h3>

                            <div className="space-y-4">
                                {/* Timing */}
                                <div>
                                    <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 mb-1">
                                        <Clock className="w-4 h-4" />
                                        <span className="uppercase text-xs font-semibold">Timings</span>
                                    </div>
                                    <p className="text-slate-900 dark:text-white font-medium">
                                        {rental.openHours || (rental.description?.includes('Open 24 hours') ? 'Open 24 Hours' :
                                            rental.description?.includes('Closes') ? rental.description.split('.')[1] || '7:00 AM - 11:00 PM' :
                                                '7:00 AM - 11:00 PM')}
                                    </p>
                                </div>

                                {/* Price */}
                                <div>
                                    <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 mb-1">
                                        <Car className="w-4 h-4" />
                                        <span className="uppercase text-xs font-semibold">Price Range</span>
                                    </div>
                                    <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                                        {rental.price}
                                    </p>
                                </div>

                                {/* Location */}
                                <div>
                                    <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 mb-1">
                                        <MapPin className="w-4 h-4" />
                                        <span className="uppercase text-xs font-semibold">Location</span>
                                    </div>
                                    <p className="text-slate-900 dark:text-white">
                                        {rental.location}
                                    </p>
                                    {rental.mapUrl && (
                                        <a
                                            href={rental.mapUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400 mt-1 hover:underline"
                                        >
                                            View on Map <ExternalLink className="w-3 h-3" />
                                        </a>
                                    )}
                                </div>

                                {/* Actions */}
                                <div className="pt-4 space-y-2">
                                    {rental.bookingUrl && (
                                        <Button
                                            className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:from-emerald-700 hover:to-teal-700 shadow-lg"
                                            asChild
                                        >
                                            <a href={rental.bookingUrl} target="_blank" rel="noopener noreferrer">
                                                <Shield className="w-4 h-4 mr-2" />
                                                Book Online
                                            </a>
                                        </Button>
                                    )}
                                    {rental.contact && (
                                        <Button
                                            variant="outline"
                                            className="w-full"
                                            asChild
                                        >
                                            <a href={`tel:${rental.contact}`}>
                                                <Phone className="w-4 h-4 mr-2" />
                                                Call Now
                                            </a>
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
}
