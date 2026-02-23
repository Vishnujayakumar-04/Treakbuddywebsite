import { collection, doc, writeBatch, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export const MOCK_EVENTS = [
    // Music
    { id: 'ev1', category: 'music', title: 'Immersive Flumie Workshop with Bear Love and Shion Buschner', date: 'Fri, 06 Mar, 2026 - 05:00 PM', location: 'Kottakarai, Irumbai B.O, Auroville', interested: '33+ Interested', image: '/assets/activity/cycling pondicherry.jfif', type: 'active' },
    { id: 'ev2', category: 'music', title: 'Planetary Sound Symphony with Jens Zygar', date: 'Mon, 16 Mar, 2026 - 09:00 AM', location: 'Auroville, India 605111', interested: '22+ Interested', image: '/assets/activity/surfing lesson.jfif', type: 'active' },
    { id: 'ev3', category: 'music', title: 'Carnatic Classical Evening by TM Krishna', date: 'Sat, 14 Mar, 2026 - 06:00 PM', location: 'Pondicherry Rock Beach', interested: '150+ Interested', image: '/assets/beaches/promenade beach.jpg', type: 'active' },
    { id: 'ev4', category: 'music', title: 'Planetary Sound Symphony • Cosmic Octave Performance Workshop', date: 'Sun, 15 Mar • 10:00 AM', location: 'Auroville, pondicherry', interested: '87+ Interested', image: '/assets/spot/french wa rmemorial.jfif', type: 'nearby' },
    { id: 'ev5', category: 'music', title: 'Acoustic Sunset by local band "Sea Breeze"', date: 'Sun, 23 Feb Onwards', location: 'Promenade Beach, Pondicherry', interested: '200+ Interested', image: '/assets/beaches/serenity beach.jpg', type: 'trending' },

    // Concerts
    { id: 'ev6', category: 'concerts', title: 'Live Tribute to Coldplay by "Yellow"', date: 'Sat, 07 Mar, 2026 - 08:00 PM', location: 'Le Cafe Seaview, Pondicherry', interested: '450+ Interested', image: '/assets/activity/mangrove kayaking.jfif', type: 'active' },
    { id: 'ev7', category: 'concerts', title: 'Symphony Orchestra Night', date: 'Fri, 13 Mar, 2026 - 07:00 PM', location: 'Pondicherry Marina', interested: '120+ Interested', image: '/assets/activity/cycling pondicherry 2.jfif', type: 'active' },
    { id: 'ev8', category: 'concerts', title: 'EDM Pre-party at Auroville', date: 'Sat, 21 Mar • 10:00 PM', location: 'Auroville Forest Area', interested: '300+ Interested', image: '/assets/activity/surfing lesson 2.jfif', type: 'nearby' },
    { id: 'ev9', category: 'concerts', title: 'Bollywood Gala Live Concert', date: 'Sun, 01 Mar Onwards', location: 'ECR Grounds, Pondicherry', interested: '1.2k+ Interested', image: '/assets/activity/cycling car.jfif', type: 'trending' },

    // Festivals
    { id: 'ev10', category: 'festivals', title: 'The 13th AUROVILLE TANGO FESTIVAL 2026 > INDIA !', date: 'Wed, 11 Mar, 2026 - 10:00 AM', location: 'Auroville : The Future Of World In India', interested: '122+ Interested', image: '/assets/spot/botanical garden.jfif', type: 'active' },
    { id: 'ev11', category: 'festivals', title: 'Pondicherry French Food Festival', date: 'Sat, 14 Mar, 2026 - 11:00 AM', location: 'Alliance Francaise, Pondicherry', interested: '2k+ Interested', image: '/assets/stay/villa shanti.webp', type: 'active' },
    { id: 'ev12', category: 'festivals', title: 'Auroville International Yoga Festival', date: 'Sun, 22 Mar • 06:00 AM', location: 'Matrimandir Gardens, Auroville', interested: '890+ Interested', image: '/assets/spot/museum.jfif', type: 'nearby' },

    // Dance
    { id: 'ev13', category: 'dance', title: 'Bharatanatyam Recital - "Divine Moves"', date: 'Fri, 06 Mar, 2026 - 06:30 PM', location: 'Aurobindo Ashram Hall', interested: '150+ Interested', image: '/assets/spot/aayi mandapam.jfif', type: 'active' },
    { id: 'ev14', category: 'dance', title: 'Salsa & Bachata Weekend Bootcamp', date: 'Sat, 07 Mar, 2026 - 04:00 PM', location: 'White Town Dance Studio', interested: '80+ Interested', image: '/assets/stay/hotel atithi.jfif', type: 'active' },
    { id: 'ev15', category: 'dance', title: 'Hip-Hop Dance Battle 2026', date: 'Sun, 29 Mar Onwards', location: 'Pondicherry University', interested: '300+ Interested', image: '/assets/activity/cycling pondicherry.jfif', type: 'trending' },

    // Health
    { id: 'ev16', category: 'health-wellness', title: 'Aerial yoga workshop for beginners', date: 'Sun, 23 Feb Onwards', location: 'Health Club, Pondicherry', interested: '105+ Interested', image: '/assets/activity/mangrove kayaking 2.jfif', type: 'active' },
    { id: 'ev17', category: 'health-wellness', title: 'ISSP Module 1: Principles and Concepts of Therapeutic Music & Sound Work', date: 'Mon, 09 Mar, 2026 - 09:30 AM', location: 'Kottakarai, Irumbai B.O, Auroville', interested: '50+ Interested', image: '/assets/activity/surfing lesson.jfif', type: 'active' },
    { id: 'ev18', category: 'health-wellness', title: '8 days pilgrimage tour and yoga retreat', date: 'Tue, 24 Feb Onwards', location: 'Thavathiru Yoga, Pondicherry', interested: 'New', image: '/assets/beaches/auroville beach.jpg', type: 'active' },
    { id: 'ev21', category: 'health-wellness', title: 'Vipassana Meditation Intro Session', date: 'Wed, 18 Mar • 07:00 AM', location: 'Auroville Global Retreat Center', interested: '250+ Interested', image: '/assets/spot/museum.jfif', type: 'nearby' },
    { id: 'ev22', category: 'health-wellness', title: 'Sunrise Beach Meditation Walk', date: 'Sun, 01 Mar Onwards', location: 'Serenity Beach, Pondicherry', interested: '400+ Interested', image: '/assets/beaches/promenade beach.jpg', type: 'trending' },

    // Theatre
    { id: 'ev23', category: 'theatre', title: 'English Play: "A Midsummer Night\'s Dream"', date: 'Fri, 20 Mar, 2026 - 07:00 PM', location: 'Jawaharlal Nehru Auditorium', interested: '350+ Interested', image: '/assets/spot/white town walks.jfif', type: 'active' },
    { id: 'ev24', category: 'theatre', title: 'Regional Tamil Modern Drama Showcase', date: 'Sat, 21 Mar, 2026 - 05:00 PM', location: 'Puducherry Art Academy', interested: '180+ Interested', image: '/assets/spot/botanical garden.jfif', type: 'active' },
    { id: 'ev25', category: 'theatre', title: 'Auroville Theater Experimental Showcase', date: 'Sun, 22 Mar • 06:00 PM', location: 'Auroville Main Stage', interested: '120+ Interested', image: '/assets/spot/french wa rmemorial.jfif', type: 'nearby' },
    { id: 'ev26', category: 'theatre', title: 'Improv Comedy Night: French Connection', date: 'Wed, 25 Mar Onwards', location: 'Café Des Arts, White Town', interested: '90+ Interested', image: '/assets/stay/villa shanti.webp', type: 'trending' },

    // Adventure
    { id: 'ev27', category: 'adventure', title: 'PADI Scuba Diving Open Water Certification', date: 'Sat, 07 Mar, 2026 - 06:00 AM', location: 'Temple Adventures Dive Center', interested: '75+ Interested', image: '/assets/activity/surfing lesson.jfif', type: 'active' },
    { id: 'ev28', category: 'adventure', title: 'Surfing Lessons for Beginners', date: 'Sun, 08 Mar, 2026 - 08:00 AM', location: 'Kallialay Surf School, Serenity Beach', interested: '230+ Interested', image: '/assets/activity/surfing lesson 2.jfif', type: 'active' },
    { id: 'ev29', category: 'adventure', title: 'Mangrove Kayaking Expedition', date: 'Tue, 10 Mar, 2026 - 04:00 PM', location: 'Pichavaram Mangrove Forest', interested: '110+ Interested', image: '/assets/activity/mangrove kayaking.jfif', type: 'active' },
    { id: 'ev30', category: 'adventure', title: 'Rock Climbing at Auroville Forest', date: 'Sat, 14 Mar • 07:00 AM', location: 'Auroville Boulders', interested: '40+ Interested', image: '/assets/activity/cycling pondicherry.jfif', type: 'nearby' },
    { id: 'ev31', category: 'adventure', title: 'Sunset Paddleboarding Tour', date: 'Fri, 13 Mar Onwards', location: 'Chunnambar Boat House', interested: '300+ Interested', image: '/assets/activity/cycling pondicherry 2.jfif', type: 'trending' },
];

export async function seedEventData() {
    try {
        const eventsRef = collection(db, 'events');
        const batch = writeBatch(db);

        MOCK_EVENTS.forEach((event) => {
            const docRef = doc(eventsRef, event.id);
            batch.set(docRef, {
                ...event,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
            });
        });

        await batch.commit();
        console.log('Events seeded successfully!');
    } catch (error) {
        console.error('Error seeding events:', error);
        throw error;
    }
}
