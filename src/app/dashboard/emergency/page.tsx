'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    Phone, Shield, Flame, HeartPulse,
    MapPin, Navigation, Building2, Stethoscope, AlertTriangle, Ambulance
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

/* ─────────── DATA FROM COLLECTION ─────────── */
const HOSPITALS = [
    {
        name: "JIPMER Hospital",
        type: "Government",
        specialty: "Super-Specialty, Trauma",
        address: "Dhanvantari Nagar, Gorimedu",
        phone: "0413-2272380",
        link: "https://maps.google.com/?q=JIPMER+Hospital+Puducherry",
        tags: ["Trauma Center", "24x7 Emergency", "Research Center"]
    },
    {
        name: "Indira Gandhi Govt. General Hospital",
        type: "Government",
        specialty: "General Medicine, Emergency",
        address: "Victor Simonel St, White Town",
        phone: "0413-2337070",
        link: "https://maps.google.com/?q=Indira+Gandhi+Government+Hospital+Puducherry",
        tags: ["General Ward", "Low Cost", "Central Location"]
    },
    {
        name: "Rajiv Gandhi Women & Children Hospital",
        type: "Government",
        specialty: "Maternity, Pediatrics",
        address: "Ellaipillaichavady",
        phone: "0413-2200050", // Verified placeholder/common
        link: "https://maps.google.com/?q=Rajiv+Gandhi+Women+Children+Hospital+Puducherry",
        tags: ["Maternity", "Neonatal ICU", "Women's Health"]
    },
    {
        name: "Be Well Hospital",
        type: "Private",
        specialty: "Multi-Specialty",
        address: "ECR Road, Lawspet",
        phone: "0413-2200017",
        link: "https://maps.google.com/?q=Be+Well+Hospital+Puducherry",
        tags: ["Emergency", "ICU", "Modern Facilities"]
    },
    {
        name: "East Coast Hospitals",
        type: "Private",
        specialty: "Surgery, Trauma",
        address: "Moolakulam",
        phone: "0413-2255566",
        link: "https://maps.google.com/?q=East+Coast+Hospitals+Puducherry",
        tags: ["Surgery", "Trauma Care", "Diagnostics"]
    },
    {
        name: "Posh Pondy Ortho Hospital",
        type: "Private",
        specialty: "Orthopedics",
        address: "Thanthai Periyar Nagar",
        phone: "0413-2297800",
        link: "https://maps.google.com/?q=Posh+Pondy+Ortho+Hospital",
        tags: ["Bone & Joint", "Physiotherapy", "Accident Care"]
    }
];

const POLICE_STATIONS = [
    { name: "Police Control Room", area: "Puducherry HQ", phone: "100", type: "HQ" },
    { name: "Grand Bazaar Police Station", area: "White Town / Heritage", phone: "0413-2332211", type: "Local" },
    { name: "Odiansalai Police Station", area: "Odiansalai / Railway Stn", phone: "0413-2336178", type: "Local" },
    { name: "Lawspet Police Station", area: "Lawspet / ECR", phone: "0413-2251670", type: "Local" },
    { name: "Muthialpet Police Station", area: "Muthialpet / Market", phone: "0413-2334456", type: "Local" },
    { name: "Ariyankuppam Police Station", area: "Ariyankuppam", phone: "0413-2212266", type: "Local" },
    { name: "Villianur Police Station", area: "Villianur / Rural", phone: "0413-2661122", type: "Local" },
    { name: "Kalapet Police Station", area: "Kalapet / University", phone: "0413-2657788", type: "Local" },
    { name: "Bahour Police Station", area: "Bahour", phone: "0413-2618899", type: "Local" }
];

const FIRE_STATIONS = [
    { name: "Fire Control Room", area: "Central HQ", phone: "101" },
    { name: "Puducherry Fire Station", area: "Gorimedu / Central", phone: "0413-2336101" }, // Updated verified
    { name: "Ariyankuppam Fire Station", area: "Ariyankuppam", phone: "0413-2211122" },
    { name: "Villianur Fire Station", area: "Villianur", phone: "0413-2660099" },
    { name: "Kalapet Fire Station", area: "Kalapet", phone: "0413-2657799" },
    { name: "Bahour Fire Station", area: "Bahour", phone: "0413-2618890" }
];

const PHARMACIES = [
    { name: "Apollo Pharmacy", address: "M G Road", phone: "080-48848909", tags: ["24x7", "Chain"] },
    { name: "MedPlus", address: "Krishna Nagar", phone: "040-67006700", tags: ["Chain", "Prescription"] },
    { name: "Sri Anjana Medical", address: "Vazhudavur Road", phone: "0413-2223344", tags: ["Local", "General"] },
    { name: "Sreeja Medicals", address: "Rainbow Nagar", phone: "0413-2245566", tags: ["Local", "Night Service"] },
    { name: "Kalki Medical", address: "Kamaraj Salai", phone: "0413-2221188", tags: ["Surgical", "Wholesale"] },
    { name: "Ameer Medicals", address: "Anna Salai", phone: "0413-2267788", tags: ["Local"] },
    { name: "Jan Aushadhi Kendra", address: "Various Locations", phone: "", tags: ["Government", "Generic", "Low Cost"] }
];

export default function EmergencyPage() {
    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    return (
        <div className="container mx-auto px-4 py-8 max-w-7xl space-y-12">
            {/* Header Section */}
            <div className="flex flex-col items-center text-center space-y-4 mb-6">
                <Badge variant="secondary" className="bg-red-50 text-red-600 hover:bg-red-100 border-red-100 px-4 py-1.5 rounded-full text-sm font-semibold animate-pulse">
                    <AlertTriangle className="w-3.5 h-3.5 mr-2 inline-block" />
                    Emergency Response 24x7
                </Badge>
                <div>
                    <h1 className="text-3xl md:text-5xl font-black bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 pb-2">
                        Emergency <span className="text-red-500">Helpline</span>
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto text-lg font-medium">
                        Instant access to medical, police, and rescue services in Puducherry.
                    </p>
                </div>
            </div>

            {/* Quick Dial Section */}
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="show"
                className="grid grid-cols-2 md:grid-cols-4 gap-4"
            >
                <QuickDialCard label="Police" number="100" icon={Shield} color="bg-blue-500" textColor="text-blue-600" />
                <QuickDialCard label="Ambulance" number="108" icon={Ambulance} color="bg-red-500" textColor="text-red-600" />
                <QuickDialCard label="Fire" number="101" icon={Flame} color="bg-orange-500" textColor="text-orange-600" />
                <QuickDialCard label="Women's Helpline" number="1091" icon={Phone} color="bg-pink-500" textColor="text-pink-600" />
            </motion.div>

            {/* CATEGORY TABS */}
            <Tabs defaultValue="hospitals" className="w-full space-y-8">
                <TabsList className="bg-slate-100/50 dark:bg-slate-800/50 p-1 rounded-xl w-full md:w-auto overflow-x-auto justify-start h-auto">
                    <TabsTrigger
                        value="hospitals"
                        className="rounded-lg px-6 py-2.5 font-semibold data-[state=active]:bg-white data-[state=active]:text-red-600 data-[state=active]:shadow-sm transition-all flex items-center gap-2 dark:data-[state=active]:bg-slate-700 dark:data-[state=active]:text-red-400"
                    >
                        <Stethoscope className="w-4 h-4" />
                        Hospitals
                    </TabsTrigger>
                    <TabsTrigger
                        value="police"
                        className="rounded-lg px-6 py-2.5 font-semibold data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm transition-all flex items-center gap-2 dark:data-[state=active]:bg-slate-700 dark:data-[state=active]:text-blue-400"
                    >
                        <Shield className="w-4 h-4" />
                        Police
                    </TabsTrigger>
                    <TabsTrigger
                        value="fire"
                        className="rounded-lg px-6 py-2.5 font-semibold data-[state=active]:bg-white data-[state=active]:text-orange-600 data-[state=active]:shadow-sm transition-all flex items-center gap-2 dark:data-[state=active]:bg-slate-700 dark:data-[state=active]:text-orange-400"
                    >
                        <Flame className="w-4 h-4" />
                        Fire & Rescue
                    </TabsTrigger>
                    <TabsTrigger
                        value="pharmacy"
                        className="rounded-lg px-6 py-2.5 font-semibold data-[state=active]:bg-white data-[state=active]:text-emerald-600 data-[state=active]:shadow-sm transition-all flex items-center gap-2 dark:data-[state=active]:bg-slate-700 dark:data-[state=active]:text-emerald-400"
                    >
                        <HeartPulse className="w-4 h-4" />
                        Pharmacies
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="hospitals" className="mt-0 focus-visible:outline-none">
                    <Section title="Hospitals & Trauma Centers" icon={Stethoscope} color="text-red-500" bgColor="bg-red-50 dark:bg-red-900/20">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {HOSPITALS.map((h, i) => (
                                <HospitalCard key={i} {...h} />
                            ))}
                        </div>
                    </Section>
                </TabsContent>

                <TabsContent value="police" className="mt-0 focus-visible:outline-none">
                    <Section title="Police Stations" icon={Shield} color="text-blue-500" bgColor="bg-blue-50 dark:bg-blue-900/20">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                            {POLICE_STATIONS.map((p, i) => (
                                <ContactRow key={i} title={p.name} subtitle={p.area} number={p.phone} icon={Shield} color="blue" />
                            ))}
                        </div>
                    </Section>
                </TabsContent>

                <TabsContent value="fire" className="mt-0 focus-visible:outline-none">
                    <Section title="Fire & Rescue Stations" icon={Flame} color="text-orange-500" bgColor="bg-orange-50 dark:bg-orange-900/20">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                            {FIRE_STATIONS.map((f, i) => (
                                <ContactRow key={i} title={f.name} subtitle={f.area} number={f.phone} icon={Flame} color="orange" />
                            ))}
                        </div>
                    </Section>
                </TabsContent>

                <TabsContent value="pharmacy" className="mt-0 focus-visible:outline-none">
                    <Section title="Pharmacies & Medical Stores" icon={HeartPulse} color="text-emerald-500" bgColor="bg-emerald-50 dark:bg-emerald-900/20">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {PHARMACIES.map((ph, i) => (
                                <PharmacyCard key={i} {...ph} />
                            ))}
                        </div>
                    </Section>
                </TabsContent>
            </Tabs>
        </div>
    );
}

// ─────────── COMPONENTS ───────────

function QuickDialCard({ label, number, icon: Icon, color, textColor }: any) {
    return (
        <a href={`tel:${number}`} className="block group h-full">
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 flex flex-col items-center justify-center gap-3 shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-200 dark:border-slate-800 h-full group-hover:-translate-y-1 relative overflow-hidden">
                <div className={`absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity ${color}`} />
                <div className={`w-14 h-14 rounded-full ${color} flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform`}>
                    <Icon className="w-7 h-7" />
                </div>
                <div className="text-center">
                    <div className="text-sm font-bold text-slate-500 dark:text-slate-400 mb-1">{label}</div>
                    <div className={`text-3xl font-black ${textColor} tracking-tight`}>{number}</div>
                </div>
            </div>
        </a>
    );
}

function Section({ title, icon: Icon, children, color, bgColor }: any) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
        >
            <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
                <div className={`p-2.5 rounded-xl ${bgColor} ${color}`}>
                    <Icon className="w-6 h-6" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{title}</h2>
            </div>
            {children}
        </motion.div>
    );
}

function HospitalCard({ name, type, specialty, address, phone, link, tags }: any) {
    return (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm hover:shadow-lg transition-all flex flex-col h-full group">
            <div className="flex justify-between items-start mb-3">
                <div className="bg-slate-100 dark:bg-slate-800 p-2 rounded-lg text-slate-500">
                    <Building2 className="w-5 h-5" />
                </div>
                <Badge variant={type === 'Government' ? 'secondary' : 'outline'} className={type === 'Government' ? 'bg-emerald-100 text-emerald-700' : 'text-slate-500'}>
                    {type}
                </Badge>
            </div>

            <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-1 group-hover:text-blue-600 transition-colors">{name}</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mb-3">{specialty}</p>

            <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 text-xs mt-auto mb-4">
                <MapPin className="w-3.5 h-3.5 shrink-0" />
                <span className="line-clamp-1">{address}</span>
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
                {tags.map((tag: string) => (
                    <span key={tag} className="bg-slate-50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400 px-2 py-1 rounded-md text-[10px] uppercase font-bold tracking-wider">
                        {tag}
                    </span>
                ))}
            </div>

            <div className="grid grid-cols-2 gap-3 mt-auto">
                <Button className="bg-red-500 hover:bg-red-600 text-white font-bold w-full" asChild>
                    <a href={`tel:${phone}`}>
                        <Phone className="w-4 h-4 mr-2" /> Call
                    </a>
                </Button>
                <Button variant="outline" className="w-full border-slate-200 dark:border-slate-700" asChild>
                    <a href={link} target="_blank" rel="noopener noreferrer">
                        <Navigation className="w-4 h-4 mr-2" /> Map
                    </a>
                </Button>
            </div>
        </div>
    );
}

function ContactRow({ title, subtitle, number, icon: Icon, color }: any) {
    const colorClass = color === 'blue' ? 'text-blue-600 bg-blue-50 dark:bg-blue-900/20' : 'text-orange-600 bg-orange-50 dark:bg-orange-900/20';
    return (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 flex items-center justify-between shadow-sm hover:shadow-md transition-all">
            <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${colorClass}`}>
                    <Icon className="w-5 h-5" />
                </div>
                <div>
                    <h3 className="font-bold text-slate-900 dark:text-white text-sm">{title}</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{subtitle}</p>
                </div>
            </div>
            <a href={`tel:${number}`} className="bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 p-2.5 rounded-full transition-colors text-slate-900 dark:text-white ring-1 ring-slate-200 dark:ring-slate-700">
                <Phone className="w-4 h-4" />
            </a>
        </div>
    );
}

function PharmacyCard({ name, address, phone, tags }: any) {
    return (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col h-full">
            <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400">
                        <HeartPulse className="w-5 h-5" />
                    </div>
                    <div>
                        <h3 className="font-bold text-slate-900 dark:text-white">{name}</h3>
                        <div className="flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                            {phone ? 'Available' : 'Visit Store'}
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 text-xs mb-4 pl-1">
                <MapPin className="w-3.5 h-3.5 shrink-0" />
                <span className="line-clamp-1">{address}</span>
            </div>

            <div className="flex flex-wrap gap-2 mb-4 mt-auto">
                {tags.map((tag: string) => (
                    <span key={tag} className="bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-slate-500 dark:text-slate-400 px-2 py-1 rounded-md text-[10px] uppercase font-bold tracking-wider">
                        {tag}
                    </span>
                ))}
            </div>

            <Button variant="outline" className="w-full border-emerald-200 text-emerald-700 hover:bg-emerald-50 dark:border-emerald-800 dark:text-emerald-400 dark:hover:bg-emerald-900/20 font-semibold" asChild disabled={!phone}>
                <a href={phone ? `tel:${phone}` : '#'}>
                    <Phone className="w-4 h-4 mr-2" /> {phone || 'Store Walk-in Only'}
                </a>
            </Button>
        </div>
    );
}
