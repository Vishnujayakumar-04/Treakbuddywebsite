
import { Place } from './types';
export type { Place };
import { IMPORTED_PLACES } from './mapped_data';

const MANUAL_PLACES: Place[] = [
    // --- BEACHES (Updated from Beaches.xlsx) ---
    {
        id: 'b1', name: "Promenade Beach", category: "beaches",
        description: "Historic French-era beachfront. Famous for sunrise walks. Swimming is not allowed.",
        location: "White Town", rating: 4.7,
        image: "/images/places/b1/1.jpg",
        gallery: [
            "/images/places/b1/1.jpg",
            "/images/places/b1/2.jpg",
            "/images/places/b1/3.jpg",
            "/images/places/b1/4.jpg",
            "/images/places/b1/5.jpg"
        ],
        tags: ["Sunrise", "No Swimming", "Walking"], timeSlot: "Morning",
        bestTime: "Early Morning", openTime: "24x7"
    },
    {
        id: 'b2', name: "Paradise Beach", category: "beaches",
        description: "Pristine island beach accessible only by boat. Famous for golden sands and water sports.",
        location: "Chunnambar", rating: 4.8,
        image: "https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=800&auto=format&fit=crop&q=80", // Beach aerial
        tags: ["Boating", "Island", "Swimming"], timeSlot: "Morning",
        bestTime: "Morning", openTime: "8:00 AM – 5:00 PM"
    },
    {
        id: 'b3', name: "Serenity Beach", category: "beaches",
        description: "Popular surfing spot with a long pier. Swimming allowed with caution. Moderate safety.",
        location: "Kottakuppam", rating: 4.6,
        image: "https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=800&auto=format&fit=crop&q=80", // Sandy beach with surfing
        tags: ["Surfing", "Cafes", "Popular"], timeSlot: "Evening",
        bestTime: "Evening", openTime: "5:00 AM – 8:00 PM"
    },
    {
        id: 'b4', name: "Auroville Beach", category: "beaches",
        description: "Quiet beach with rocky shoreline. Swimming not advised due to low safety/no lifeguards.",
        location: "Auroville", rating: 4.2,
        image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80", // Tropical beach
        tags: ["Quiet", "Rocky", "Cliffs"], timeSlot: "Morning",
        bestTime: "Morning", openTime: "5:00 AM – 7:00 PM"
    },
    {
        id: 'b5', name: "Reppo Beach", category: "beaches",
        description: "Quiet and less crowded beach near Kalapet. Perfect as a sunset point.",
        location: "Kalapet", rating: 4.5,
        image: "https://images.unsplash.com/photo-1473116763249-2faaef81ccda?w=800&auto=format&fit=crop&q=80", // Sunset beach
        tags: ["Quiet", "Sunset", "Hidden Gem"], timeSlot: "Evening",
        bestTime: "Evening", openTime: "6:00 AM – 6:00 PM"
    },
    {
        id: 'b6', name: "Veerampattinam Beach", category: "beaches",
        description: "Famous fishing village beach with seasonal boating. Home to a large coastal community.",
        location: "Veerampattinam", rating: 4.4,
        image: "https://images.unsplash.com/photo-1534008897995-27a23e859048?w=800&auto=format&fit=crop&q=80", // Fishing boats
        tags: ["Fishing Village", "Boating", "Local"], timeSlot: "Morning",
        bestTime: "Morning", openTime: "24 Hours"
    },
    {
        id: 'b7', name: "Chunnambar Backwater", category: "beaches",
        description: "Backwater recreation hub offering boating, kayaking, and ferry services to Paradise Beach.",
        location: "Chunnambar", rating: 4.3,
        image: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800&auto=format&fit=crop&q=80", // Backwater
        tags: ["Backwater", "Kayaking", "Ferry"], timeSlot: "Afternoon",
        bestTime: "9 AM - 4 PM", openTime: "9:00 AM – 5:00 PM", entryFee: "Entry Fee Applicable"
    },
    {
        id: 'b8', name: "Quiet Healing Centre Beach", category: "beaches",
        description: "A spiritual calm zone ideal for meditation. Low safety for swimming.",
        location: "Chinna Mudaliyar Chavady", rating: 4.5,
        image: "https://images.unsplash.com/photo-1506953823976-52e1fdc0149a?w=800&auto=format&fit=crop&q=80", // Meditation beach
        tags: ["Meditation", "Peace", "Secluded"], timeSlot: "Morning",
        bestTime: "Early Morning", openTime: "5:00 AM – 6:00 PM"
    },

    // --- HERITAGE (unchanged) ---
    {
        id: 'h1', name: "White Town Walks", category: "heritage",
        description: "Wander through the French Quarter with its colonial villas, yellow walls, and tree-lined streets.",
        location: "White Town", rating: 4.9,
        image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&auto=format&fit=crop&q=80", // Colonial villa
        tags: ["Architecture", "Walking", "Photography"], timeSlot: "Afternoon",
        bestTime: "3:00 PM - 6:00 PM", openTime: "24 Hours"
    },
    {
        id: 'h2', name: "Puducherry Museum", category: "heritage",
        description: "Discover the region's history, from Roman trade artifacts to French colonial memorabilia.",
        location: "St. Louis Street", rating: 4.2,
        image: "https://images.unsplash.com/photo-1566127444510-a8dc77cda928?w=800&auto=format&fit=crop&q=80", // Museum interior
        tags: ["History", "Indoor", "Museum"], timeSlot: "Afternoon",
        bestTime: "10:00 AM - 5:00 PM", openTime: "10AM - 5PM (Mon Closed)", entryFee: "₹10"
    },
    {
        id: 'h3', name: "Aayi Mandapam", category: "heritage",
        description: "A brilliant white monument in Bharathi Park built to commemorate a 16th-century courtesan.",
        location: "Bharathi Park", rating: 4.4,
        image: "https://images.unsplash.com/photo-1590680687157-558661845f94?w=800&auto=format&fit=crop&q=80", // White monument
        tags: ["Monument", "Park", "Relax"], timeSlot: "Evening",
        bestTime: "4:00 PM - 8:00 PM", openTime: "6:00 AM - 9:00 PM", entryFee: "Free"
    },
    {
        id: 'h4', name: "French War Memorial", category: "heritage",
        description: "A stylish memorial dedicated to residents of French India who died for the country during World War I.",
        location: "Goubert Avenue", rating: 4.6,
        image: "https://images.unsplash.com/photo-1582510003544-5243789972d0?w=800&auto=format&fit=crop&q=80", // Memorial monument
        tags: ["Memorial", "History", "Solemn"], timeSlot: "Evening",
        bestTime: "Evening", openTime: "10:00 AM - 5:00 PM", entryFee: "Free"
    },
    {
        id: 'h5', name: "Bharathi Park", category: "heritage",
        description: "A lush green park in the heart of White Town, named after the Tamil poet Subramania Bharathi. Features the iconic Aayi Mandapam monument, musical fountains, and beautiful flower beds. A popular gathering spot for locals and tourists alike.",
        location: "White Town", rating: 4.5,
        image: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=800&auto=format&fit=crop&q=80", // Green park
        tags: ["Park", "Heritage", "Relaxation"], timeSlot: "Evening",
        bestTime: "4:00 PM - 7:00 PM", openTime: "6:00 AM - 9:00 PM", entryFee: "Free"
    },
    {
        id: 'h6', name: "Arikamedu Archaeological Site", category: "heritage",
        description: "An ancient Roman trade settlement dating back to the 2nd century BC. This archaeological site reveals Puducherry's deep connection with the Roman Empire through pottery, beads, and trading artifacts discovered during excavations.",
        location: "Arikamedu, 7 km from Puducherry", rating: 4.3,
        image: "https://images.unsplash.com/photo-1518012312832-96aea3c91144?w=800&auto=format&fit=crop&q=80", // Archaeological ruins
        tags: ["Archaeology", "Roman", "History"], timeSlot: "Morning",
        bestTime: "Morning", openTime: "9:00 AM - 5:00 PM", entryFee: "Free"
    },
    {
        id: 'h7', name: "Kargil War Memorial", category: "heritage",
        description: "A solemn memorial dedicated to the brave soldiers from Puducherry who sacrificed their lives during the 1999 Kargil War. Features a beautifully maintained garden, war memorabilia, and an eternal flame paying homage to the fallen heroes.",
        location: "Beach Road, near Dupleix Statue", rating: 4.5,
        image: "https://images.unsplash.com/photo-1590680687157-558661845f94?w=800&auto=format&fit=crop&q=80", // War memorial
        tags: ["Memorial", "War", "Tribute"], timeSlot: "Evening",
        bestTime: "Evening", openTime: "9:00 AM - 6:00 PM", entryFee: "Free"
    },
    {
        id: 'h8', name: "Raj Niwas", category: "heritage",
        description: "The official residence of the Lieutenant Governor of Puducherry, formerly known as the Governor's Palace. Built in the 18th century French colonial style, this grand mansion features elegant architecture, manicured gardens, and reflects the rich Franco-Tamil heritage.",
        location: "White Town, Beach Road", rating: 4.6,
        image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&auto=format&fit=crop&q=80", // Governor palace
        tags: ["Palace", "Colonial", "Architecture"], timeSlot: "Afternoon",
        bestTime: "Morning", openTime: "View from outside (restricted entry)", entryFee: "Not open to public"
    },


    // SPIRITUAL (Ashrams)
    {
        id: 's2', name: "Sri Aurobindo Ashram", category: "spiritual",
        description: "A spiritual community and ashram founded by Sri Aurobindo and The Mother. A place of deep silence.",
        location: "Marine Street", rating: 4.7,
        image: "https://images.unsplash.com/photo-1545389336-cf090694435e?w=800&auto=format&fit=crop&q=80", // Meditation ashram
        tags: ["Meditation", "Silence", "Flowers"], timeSlot: "Morning",
        bestTime: "8:00 AM - 12:00 PM", openTime: "8:00 AM - 12:00 PM, 2:00 PM - 6:00 PM", entryFee: "Free"
    },
    {
        id: 's3', name: "Matrimandir", category: "spiritual",
        description: "The soul of Auroville. A massive golden sphere dedicated to human unity and meditation.",
        location: "Auroville", rating: 5.0,
        image: "https://images.unsplash.com/photo-1623083984360-15bd8434cc85?w=800&auto=format&fit=crop&q=80", // Golden dome
        tags: ["Auroville", "Meditation", "Must-Visit"], timeSlot: "Morning",
        bestTime: "Booking Required", openTime: "Viewing Point: 9AM - 5PM", entryFee: "Free (Booking needed)"
    },

    // TEMPLES
    {
        id: 't1', name: "Manakula Vinayagar Temple", category: "temples",
        description: "Ancient Ganesha temple predating French rule. Famous for its golden chariot and temple elephant.",
        location: "White Town", rating: 4.9,
        image: "https://images.unsplash.com/photo-1582510003544-5243789972d0?w=800&auto=format&fit=crop&q=80", // Hindu temple
        tags: ["Ganesha", "Ancient", "Divine"], timeSlot: "Morning",
        bestTime: "Early Morning", openTime: "5:30 AM – 12:30 PM, 4:00 PM – 9:00 PM", entryFee: "Free"
    },
    {
        id: 't2', name: "Varadaraja Perumal Temple", category: "temples",
        description: "Historic Divya Desam temple dedicated to Lord Vishnu, featuring Dravidian architecture.",
        location: "Heritage Town", rating: 4.8,
        image: "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800&auto=format&fit=crop&q=80", // Dravidian temple
        tags: ["Vishnu", "Dravidian", "History"], timeSlot: "Evening",
        bestTime: "Evening Aarti", openTime: "6:00 AM – 11:30 AM, 4:30 PM – 8:30 PM", entryFee: "Free"
    },
    {
        id: 't3', name: "Vedapureeswarar Temple", category: "temples",
        description: "Dedicated to Lord Shiva, this ancient Saiva shrine was destroyed by the French in 1748 and rebuilt.",
        location: "Heritage Town", rating: 4.7,
        image: "https://images.unsplash.com/photo-1548013146-72479768bada?w=800&auto=format&fit=crop&q=80", // Indian temple tower
        tags: ["Shiva", "Powerful", "Rebuilt"], timeSlot: "Morning",
        bestTime: "Pradosham", openTime: "6:00 AM – 12:00 PM, 4:00 PM – 8:30 PM", entryFee: "Free"
    },
    {
        id: 't4', name: "Thirukaameeswarar Temple", category: "temples",
        description: "Renowned ancient temple in Villiyanur, famous for education-related prayers.",
        location: "Villiyanur", rating: 4.6,
        image: "https://images.unsplash.com/photo-1582556263595-6541f6f6f964?w=800&auto=format&fit=crop&q=80", // South Indian temple gopuram
        tags: ["Villiyanur", "Education", "Rural"], timeSlot: "Evening",
        bestTime: "Morning", openTime: "6:00 AM – 12:00 PM, 4:00 PM – 8:00 PM", entryFee: "Free"
    },
    {
        id: 't5', name: "Sengazhuneer Amman Temple", category: "temples",
        description: "Popular local goddess temple in Veerampattinam coastal village.",
        location: "Veerampattinam", rating: 4.5,
        image: "https://images.unsplash.com/photo-1582556263595-6541f6f6f964?w=800&auto=format&fit=crop&q=80", // Temple architecture
        tags: ["Amman", "Folk", "Coastal"], timeSlot: "Morning",
        bestTime: "Friday", openTime: "6:00 AM – 11:00 AM, 4:00 PM – 8:00 PM", entryFee: "Free"
    },
    {
        id: 't6', name: "Ayyanar Temple", category: "temples",
        description: "Village guardian deity temple located in Lawspet.",
        location: "Lawspet", rating: 4.4,
        image: "https://images.unsplash.com/photo-1582556263595-6541f6f6f964?w=800&auto=format&fit=crop&q=80", // Temple deity
        tags: ["Ayyanar", "Guardian", "Local"], timeSlot: "Evening",
        bestTime: "Evening", openTime: "6:00 AM – 10:00 AM, 5:00 PM – 8:00 PM", entryFee: "Free"
    },
    {
        id: 't7', name: "Kamakshi Amman Temple", category: "temples",
        description: "A revered Hindu temple dedicated to Goddess Kamakshi, a form of Parvati. Located near the beach, this temple is known for its vibrant festivals, intricate gopuram, and daily rituals that draw devotees from across the region.",
        location: "Villianur Main Road", rating: 4.6,
        image: "https://images.unsplash.com/photo-1582556263595-6541f6f6f964?w=800&auto=format&fit=crop&q=80", // Goddess temple
        tags: ["Amman", "Goddess", "Festivals"], timeSlot: "Morning",
        bestTime: "Friday & Pournami", openTime: "6:00 AM – 12:00 PM, 4:00 PM – 8:30 PM", entryFee: "Free"
    },
    {
        id: 't8', name: "Arulmigu Kanniga Parameswari Temple", category: "temples",
        description: "An ancient temple dedicated to Goddess Kanniga Parameswari, believed to be over 500 years old. Located in the fishing village of Kuruchikuppam, this temple is known for its annual chariot festival and the deep devotion of the local coastal community.",
        location: "Kuruchikuppam", rating: 4.5,
        image: "https://images.unsplash.com/photo-1582556263595-6541f6f6f964?w=800&auto=format&fit=crop&q=80", // Dravidian temple
        tags: ["Goddess", "Ancient", "Chariot Festival"], timeSlot: "Morning",
        bestTime: "Morning Pooja", openTime: "6:00 AM – 12:00 PM, 4:00 PM – 8:00 PM", entryFee: "Free"
    },

    {
        id: 'c1', name: "Sacred Heart Basilica", category: "churches",
        description: "A stunning example of Gothic revival architecture with rare stained glass panels depicting the life of Christ.",
        location: "Subbayah Salai", rating: 4.8,
        image: "https://images.unsplash.com/photo-1548625361-987747e70e3c?w=800&auto=format&fit=crop&q=80", // Gothic basilica
        tags: ["Basilica", "Gothic", "Stained Glass"], timeSlot: "Evening",
        bestTime: "Evening Mass", openTime: "6:00 AM – 7:00 PM", entryFee: "Free"
    },
    {
        id: 'c2', name: "Immaculate Conception Cathedral", category: "churches",
        description: "The 300-year-old mother church of the Roman Catholic Archdiocese, known locally as Samba Kovil.",
        location: "Mission Street", rating: 4.6,
        image: "https://images.unsplash.com/photo-1575402095034-7a0ad32152a5?w=800&auto=format&fit=crop&q=80", // Cathedral interior
        tags: ["Cathedral", "History", "Blue-Gold"], timeSlot: "Morning",
        bestTime: "Sunday Morning", openTime: "6:00 AM – 6:30 PM", entryFee: "Free"
    },
    {
        id: 'c3', name: "Our Lady of Angels Church", category: "churches",
        description: "A beautiful French colonial era church in White Town facing the Bay of Bengal.",
        location: "White Town", rating: 4.7,
        image: "https://images.unsplash.com/photo-1438232992991-995b7058bbb3?w=800&auto=format&fit=crop&q=80", // Colonial church
        tags: ["French", "Pink", "Sea View"], timeSlot: "Afternoon",
        bestTime: "Sunset", openTime: "6:30 AM – 6:30 PM", entryFee: "Free"
    },
    {
        id: 'c4', name: "St. Andrew’s Church", category: "churches",
        description: "One of the oldest Presbyterian churches in the region.",
        location: "Church Street", rating: 4.4,
        image: "https://images.unsplash.com/photo-1438232992991-995b7058bbb3?w=800&auto=format&fit=crop&q=80", // Classic church architecture
        tags: ["Protestant", "Serene", "Old"], timeSlot: "Morning",
        bestTime: "Sunday Service", openTime: "6:00 AM – 6:00 PM", entryFee: "Free"
    },

    // MOSQUES & JAIN
    {
        id: 'm1', name: "Muthialpet Mosque", category: "mosques",
        description: "A prominent Sunni mosque serving the Muthialpet community.",
        location: "Muthialpet", rating: 4.5,
        image: "https://images.unsplash.com/photo-1564121211835-e88c852648ab?w=800&auto=format&fit=crop&q=80", // Mosque architecture
        tags: ["Mosque", "Sunni", "Prayer"], timeSlot: "Evening",
        bestTime: "Friday", openTime: "5:00 AM – 9:00 PM", entryFee: "Free"
    },
    {
        id: 'j1', name: "Puducherry Jain Temple", category: "temples",
        description: "Main Svetambara Jain temple serving the local Jain community.",
        location: "Heritage Town", rating: 4.5,
        image: "https://images.unsplash.com/photo-1605634288019-3c7784651336?w=800&auto=format&fit=crop&q=80", // Jain temple
        tags: ["Jain", "Peace", "White"], timeSlot: "Morning",
        bestTime: "Morning", openTime: "6:00 AM – 11:00 AM, 5:00 PM – 8:00 PM", entryFee: "Free"
    },

    // --- FOOD & CAFES (unchanged) ---
    {
        id: 'f1', name: "Cafe des Arts", category: "restaurants",
        description: "A quirky, vintage cafe serving delicious crepes and baguettes in a colonial setting.",
        location: "Suffren Street", rating: 4.6,
        image: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800&auto=format&fit=crop&q=80", // Coffee cup in artsy cafe
        tags: ["Cafe", "French", "Vintage"], timeSlot: "Afternoon",
        bestTime: "Lunch", openTime: "8:30 AM - 7:00 PM (Tue Closed)", entryFee: "₹500 for two"
    },
    {
        id: 'f2', name: "Coromandel Cafe", category: "restaurants",
        description: "Upscale dining in a beautifully restored heritage mansion with a lush garden courtyard.",
        location: "Romain Rolland St", rating: 4.8,
        image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&auto=format&fit=crop&q=80", // Elegant restaurant interior
        tags: ["Fine Dining", "Heritage", "Cocktails"], timeSlot: "Evening",
        bestTime: "Dinner", openTime: "8:30 AM - 10:30 PM", entryFee: "₹1200 for two"
    },
    {
        id: 'f3', name: "Baker Street", category: "restaurants",
        description: "Famous for authentic French croissants, quiches, and pastries. A concept store for foodies.",
        location: "Bussy Street", rating: 4.5,
        image: "https://images.unsplash.com/photo-1555507036-ab1f40388085?w=800&auto=format&fit=crop&q=80", // Fresh pastries
        tags: ["Bakery", "Breakfast", "Pastries"], timeSlot: "Morning",
        bestTime: "Breakfast", openTime: "7:00 AM - 10:00 PM", entryFee: "₹400 for two"
    },
    {
        id: 'f4', name: "Le Cafe", category: "restaurants",
        description: "The only 24/7 seafront cafe in Pondicherry. Simple food, unbeatable views.",
        location: "Beach Road", rating: 4.3,
        image: "https://images.unsplash.com/photo-1521017432531-fbd92d768814?w=800&auto=format&fit=crop&q=80", // Ocean view cafe
        tags: ["Sea View", "24/7", "Coffee"], timeSlot: "Evening",
        bestTime: "Midnight or Sunrise", openTime: "24 Hours", entryFee: "₹300 for two"
    },
    {
        id: 'f5', name: "Villa Shanti", category: "restaurants",
        description: "Elegant courtyard dining offering a mix of Indian and Continental flavors.",
        location: "Suffren Street", rating: 4.7,
        image: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=800&auto=format&fit=crop&q=80", // Cocktail/dining
        tags: ["Dinner", "Romantic", "Multi-cuisine"], timeSlot: "Evening",
        bestTime: "Dinner", openTime: "12:00 PM - 10:30 PM", entryFee: "₹1500 for two"
    },

    // --- NATURE (unchanged) ---
    {
        id: 'n1', name: "Botanical Gardens", category: "parks",
        description: "Established in 1826, this garden features exotic trees, a toy train, and a musical fountain.",
        location: "Near Bus Stand", rating: 4.1,
        image: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=800&auto=format&fit=crop&q=80", // Botanical garden
        tags: ["Garden", "Nature", "Family"], timeSlot: "Afternoon",
        bestTime: "4:00 PM - 6:00 PM", openTime: "10:00 AM - 5:00 PM", entryFee: "₹20"
    },
    {
        id: 'n2', name: "Ousteri Lake", category: "nature",
        description: "A vast man-made lake and bird sanctuary. Great for boat rides and sunset watching.",
        location: "Osudu", rating: 4.4,
        image: "https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=800&auto=format&fit=crop&q=80", // Lake/waterscape
        tags: ["Lake", "Birds", "Boating"], timeSlot: "Evening",
        bestTime: "Sunset", openTime: "9:00 AM - 5:00 PM", entryFee: "Free (Boating extra)"
    },
    {
        id: 'n3', name: "Pichavaram Mangroves", category: "nature",
        description: "One of the world's largest mangrove forests. Take a boat ride through the narrow canals.",
        location: "Chidambaram (Day Trip)", rating: 4.8,
        image: "https://images.unsplash.com/photo-1529315895786-9a25b16f3c15?w=800&auto=format&fit=crop&q=80", // Dense green mangroves
        tags: ["Mangroves", "Boating", "Day Trip"], timeSlot: "Morning",
        bestTime: "Morning", openTime: "8:00 AM - 5:00 PM", entryFee: "₹200 (Boat)"
    },

    // --- ADVENTURE (unchanged) ---
    {
        id: 'a1', name: "Scuba Diving", category: "adventure",
        description: "Explore the coral reefs and underwater marine life of the Bay of Bengal.",
        location: "Eden Beach / Harbour", rating: 4.9,
        image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&auto=format&fit=crop&q=80", // Scuba diving underwater
        tags: ["Diving", "Underwater", "Thrilling"], timeSlot: "Morning",
        bestTime: "Morning", openTime: "Booking Required", entryFee: "₹5000+"
    },
    {
        id: 'a2', name: "Surfing Lessons", category: "adventure",
        description: "Learn to surf the waves at Serenity Beach with certified instructors.",
        location: "Serenity Beach", rating: 4.8,
        image: "https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=800&auto=format&fit=crop&q=80", // Surfing wave
        tags: ["Surfing", "Active", "Water"], timeSlot: "Morning",
        bestTime: "Morning", openTime: "7:00 AM - 11:00 AM", entryFee: "₹1500/session"
    },
    {
        id: 'a3', name: "Midnight Cycling", category: "adventure",
        description: "Experience the charm of White Town at night on a guided cycling tour.",
        location: "White Town", rating: 4.7,
        image: "https://images.unsplash.com/photo-1534150534220-43d7de08779b?w=800&auto=format&fit=crop&q=80", // Night cycling
        tags: ["Cycling", "Night", "Tour"], timeSlot: "Evening",
        bestTime: "Night", openTime: "Booking Required", entryFee: "₹800/person"
    },

    // --- SHOPPING (unchanged) ---
    {
        id: 'sh1', name: "Sunday Market", category: "shopping",
        description: "A bustling street market on M.G. Road selling books, clothes, and trinkets at bargain prices.",
        location: "M.G. Road", rating: 4.2,
        image: "https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=800&auto=format&fit=crop&q=80", // Market shopping
        tags: ["Street Market", "Cheap", "Crowd"], timeSlot: "Evening",
        bestTime: "Sunday Evening", openTime: "Sunday Only", entryFee: "Free"
    },
    {
        id: 'sh2', name: "Casablanca", category: "shopping",
        description: "A premium department store offering branded clothes, souvenirs, and home decor.",
        location: "Mission Street", rating: 4.5,
        image: "https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=800&auto=format&fit=crop&q=80", // Clothing store
        tags: ["Mall", "Shopping", "AC"], timeSlot: "Afternoon",
        bestTime: "Daytime", openTime: "10:00 AM - 10:00 PM", entryFee: "Free"
    },
    {
        id: 'sh3', name: "Cluny Embroidery Centre", category: "shopping",
        description: "A colonial building where you can buy delicate hand-embroidered linens made by local women.",
        location: "White Town", rating: 4.6,
        image: "https://images.unsplash.com/photo-1619623725615-512c1b483e0c?w=800&auto=format&fit=crop&q=80", // Handmade textiles
        tags: ["Handmade", "Charity", "Souvenirs"], timeSlot: "Afternoon",
        bestTime: "Daytime", openTime: "9:00 AM - 5:00 PM", entryFee: "Free"
    },

    // --- ACCOMMODATIONS (From Hotels.xlsx) ---

    // HOTELS & RESORTS
    {
        id: 'hot1', name: "Hotel Annamalai International", category: "hotels",
        description: "Comfortable stay in White Town with deluxe and suite rooms. Check-in 12 PM / Check-out 11 AM.",
        location: "White Town", rating: 4.2,
        image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&auto=format&fit=crop&q=80", // Hotel pool
        tags: ["Deluxe", "Suite", "White Town"], timeSlot: "Afternoon",
        bestTime: "Year-round", openTime: "24 Hours", entryFee: "₹3500–6000/night"
    },
    {
        id: 'hot2', name: "Hotel Atithi", category: "hotels",
        description: "Budget-friendly hotel with AC and Non-AC rooms in Heritage Town.",
        location: "Heritage Town", rating: 4.0,
        image: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&auto=format&fit=crop&q=80", // Hotel room
        tags: ["Budget", "AC", "Heritage"], timeSlot: "Afternoon",
        bestTime: "Year-round", openTime: "24 Hours", entryFee: "₹2500–4500/night"
    },
    {
        id: 'hot3', name: "Le Pondy", category: "hotels",
        description: "Luxury resort featuring cottages and villas with premium amenities. Check-in 2 PM / Check-out 12 PM.",
        location: "Pudukuppam", rating: 4.5,
        image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&auto=format&fit=crop&q=60",
        tags: ["Luxury", "Resort", "Villas"], timeSlot: "Afternoon",
        bestTime: "Year-round", openTime: "24 Hours", entryFee: "₹7000–12000/night"
    },
    {
        id: 'hot4', name: "Ginger Pondicherry", category: "hotels",
        description: "Reliable chain hotel with standard rooms and modern amenities.",
        location: "Karuvadikuppam", rating: 4.1,
        image: "https://images.unsplash.com/photo-1596436889106-be35e843f974?w=800&auto=format&fit=crop&q=60",
        tags: ["Chain Hotel", "Standard", "Modern"], timeSlot: "Afternoon",
        bestTime: "Year-round", openTime: "24 Hours", entryFee: "₹2800–4000/night"
    },
    {
        id: 'hot5', name: "Accord Puducherry", category: "hotels",
        description: "Upscale hotel with executive rooms and suites, offering premium business facilities.",
        location: "Ellaipillaichavady", rating: 4.6,
        image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&auto=format&fit=crop&q=60",
        tags: ["Upscale", "Business", "Executive"], timeSlot: "Afternoon",
        bestTime: "Year-round", openTime: "24 Hours", entryFee: "₹5000–8000/night"
    },
    {
        id: 'hot6', name: "The Windflower", category: "hotels",
        description: "Luxury boutique resort with elegantly designed rooms and spa services.",
        location: "Manavely", rating: 4.4,
        image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&auto=format&fit=crop&q=60",
        tags: ["Boutique", "Spa", "Luxury"], timeSlot: "Afternoon",
        bestTime: "Year-round", openTime: "24 Hours", entryFee: "₹9000–14000/night"
    },
    {
        id: 'hot7', name: "Ocean Spray", category: "hotels",
        description: "Beach resort with villa accommodations. Enjoy sea views and tranquility. Check-in 2 PM / Check-out 11 AM.",
        location: "Manjakuppam", rating: 4.3,
        image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&auto=format&fit=crop&q=60",
        tags: ["Beach Resort", "Villas", "Sea View"], timeSlot: "Morning",
        bestTime: "Year-round", openTime: "24 Hours", entryFee: "₹7000–13000/night"
    },
    {
        id: 'hot8', name: "Paradise Lagoon", category: "hotels",
        description: "Scenic resort with cottage-style accommodations. Check-in 1 PM / Check-out 11 AM.",
        location: "Pooranankuppam", rating: 4.2,
        image: "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=800&auto=format&fit=crop&q=60",
        tags: ["Cottages", "Scenic", "Resort"], timeSlot: "Afternoon",
        bestTime: "Year-round", openTime: "24 Hours", entryFee: "₹6000–10000/night"
    },

    // HERITAGE & BOUTIQUE STAYS
    {
        id: 'hot9', name: "Villa Shanti", category: "hotels",
        description: "Boutique heritage hotel in a restored colonial building with deluxe rooms.",
        location: "White Town", rating: 4.7,
        image: "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800&auto=format&fit=crop&q=60",
        tags: ["Heritage", "Boutique", "Colonial"], timeSlot: "Afternoon",
        bestTime: "Year-round", openTime: "24 Hours", entryFee: "₹5500–7500/night"
    },
    {
        id: 'hot10', name: "La Maison Charu", category: "hotels",
        description: "Charming heritage property with traditional French-Tamil architecture.",
        location: "White Town", rating: 4.5,
        image: "https://images.unsplash.com/photo-1587985064135-0366536eab42?w=800&auto=format&fit=crop&q=60",
        tags: ["Heritage", "French", "Charm"], timeSlot: "Afternoon",
        bestTime: "Year-round", openTime: "24 Hours", entryFee: "₹4500–6500/night"
    },

    // BUDGET STAYS
    {
        id: 'hot11', name: "Anandha Inn", category: "hotels",
        description: "Budget-friendly accommodation on MG Road with basic amenities.",
        location: "MG Road", rating: 3.9,
        image: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&auto=format&fit=crop&q=60",
        tags: ["Budget", "MG Road", "Basic"], timeSlot: "Afternoon",
        bestTime: "Year-round", openTime: "24 Hours", entryFee: "₹1800–3000/night"
    },

    // PG ACCOMMODATIONS
    {
        id: 'pg1', name: "Sri Balaji PG", category: "pg",
        description: "Comfortable PG accommodation with single and shared room options. Flexible check-in.",
        location: "T.C Koot Road", rating: 4.0,
        image: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800&auto=format&fit=crop&q=60",
        tags: ["PG", "Single", "Shared"], timeSlot: "Afternoon",
        bestTime: "Year-round", openTime: "Flexible", entryFee: "₹4500–7000/month"
    },
    {
        id: 'pg2', name: "Green Homes PG", category: "pg",
        description: "Affordable shared accommodation for students and working professionals.",
        location: "Edayanchavadi", rating: 3.9,
        image: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800&auto=format&fit=crop&q=60",
        tags: ["PG", "Shared", "Affordable"], timeSlot: "Afternoon",
        bestTime: "Year-round", openTime: "Flexible", entryFee: "₹5000–6500/month"
    },
    {
        id: 'pg3', name: "Auro PG Stay", category: "pg",
        description: "Quality PG accommodation near Auroville with single room options.",
        location: "Auroville", rating: 4.1,
        image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&auto=format&fit=crop&q=60",
        tags: ["PG", "Auroville", "Single"], timeSlot: "Afternoon",
        bestTime: "Year-round", openTime: "Flexible", entryFee: "₹6000–8000/month"
    },
    {
        id: 'pg4', name: "Student Nest", category: "pg",
        description: "Student-focused PG accommodation with essential amenities.",
        location: "Puducherry", rating: 3.8,
        image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&auto=format&fit=crop&q=60",
        tags: ["PG", "Students", "Budget"], timeSlot: "Afternoon",
        bestTime: "Year-round", openTime: "Flexible", entryFee: "₹4000–6000/month"
    }
];


import hotelsData from '../../../../src/data/hotels.json';
import restaurantsData from '../../../../src/data/restaurants.json';
import pubsData from '../../../../src/data/pubs.json';
import adventureData from '../../../../src/data/adventure.json';
import templesData from '../../../../src/data/temples.json';
import emergencyData from '../../../../src/data/emergency.json';
import natureData from '../../../../src/data/nature.json';

const mappedHotels: Place[] = (hotelsData as any[]).map(h => ({
    id: h.id,
    name: h.name,
    category: 'hotels',
    description: typeof h.description === 'string' ? h.description : (h.description?.specialFeatures || 'Comfortable stay'),
    location: h.location || h.address || 'Puducherry',
    rating: h.rating || 4.2,
    image: h.image || (h.images && h.images[0]) || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&auto=format&fit=crop&q=60',
    tags: h.facilities?.slice(0, 3) || [],
    timeSlot: 'Afternoon',
    bestTime: 'Year-round',
    openTime: h.checkIn ? `${h.checkIn} - ${h.checkOut}` : '24 Hours',
    entryFee: h.priceRange || h.entryFee || 'Contact for price',
    gallery: h.images || []
}));

const mappedRestaurants: Place[] = (restaurantsData as any[]).map(r => ({
    id: r.id,
    name: r.name,
    category: 'restaurants',
    description: typeof r.description === 'string' ? r.description : 'Great place to eat in Puducherry.',
    location: r.location || r.area || 'Puducherry',
    rating: r.rating || 4.3,
    image: r.image || (r.images && r.images[0]) || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&auto=format&fit=crop&q=60',
    tags: r.cuisine ? [r.cuisine, r.type || ''].filter(Boolean) : [],
    timeSlot: 'Evening',
    bestTime: 'Lunch/Dinner',
    openTime: r.openTime ? `${r.openTime} - ${r.closeTime}` : 'Check for timings',
    entryFee: r.priceRange || 'Varies',
    gallery: r.images || []
}));

const mappedPubs: Place[] = (pubsData as any[]).map(p => ({
    id: p.id,
    name: p.name,
    category: 'pubs',
    description: typeof p.description === 'string' ? p.description : 'Popular nightlife spot.',
    location: p.location || p.area || 'Puducherry',
    rating: p.rating || 4.4,
    image: p.image || (p.images && p.images[0]) || 'https://images.unsplash.com/photo-1516997121675-4c2d1684aa3e?w=800&auto=format&fit=crop&q=60',
    tags: p.features?.slice(0, 3) || [],
    timeSlot: 'Evening',
    bestTime: 'Night',
    openTime: p.openTime ? `${p.openTime} - ${p.closeTime}` : 'Evening onwards',
    entryFee: p.entryFee || 'Varies',
    gallery: p.images || []
}));

const mappedAdventure: Place[] = (adventureData as any[]).map(a => ({
    id: a.id,
    name: a.name,
    category: 'adventure',
    description: typeof a.description === 'string' ? a.description : 'Adventure activity in Puducherry.',
    location: a.location || 'Puducherry',
    rating: a.rating || 4.5,
    image: a.image || (a.images && a.images[0]) || 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&auto=format&fit=crop&q=60',
    tags: a.activities?.slice(0, 3) || [],
    timeSlot: 'Morning',
    bestTime: 'Daytime',
    openTime: a.timing || a.timings || 'Check availability',
    entryFee: a.price || a.entryFee || 'Varies',
    gallery: a.images || []
}));

const mappedTemples: Place[] = (templesData as any[]).map(t => ({
    id: t.id,
    name: t.name,
    category: t.religion?.toLowerCase() === 'hindu' ? 'temples' : (t.religion?.toLowerCase() === 'christian' ? 'churches' : (t.religion?.toLowerCase() === 'muslim' ? 'mosques' : 'spiritual')),
    description: typeof t.description === 'string' ? t.description : 'Religious place in Puducherry.',
    location: t.location || 'Puducherry',
    rating: t.rating || 4.7,
    image: t.image || (t.images && t.images[0]) || 'https://images.unsplash.com/photo-1582510003544-5243789972d0?w=800&auto=format&fit=crop&q=80',
    tags: t.religion ? [t.religion] : [],
    timeSlot: 'Morning',
    bestTime: t.bestTime || 'Morning/Evening',
    openTime: t.timing || t.openingTimeWeekdays || 'Check timings',
    entryFee: t.price || t.entryFee || 'Free',
    gallery: t.images || []
}));

const mappedNature: Place[] = (natureData as any[]).map(n => ({
    id: n.id,
    name: n.name,
    category: n.category?.toLowerCase() === 'garden' || n.category?.toLowerCase() === 'city park' ? 'parks' : 'nature',
    description: typeof n.description === 'string' ? n.description : (n.description?.specialFeatures || 'Beautiful nature spot.'),
    location: n.location || 'Puducherry',
    rating: n.rating || 4.5,
    image: n.image || (n.images && n.images[0]) || 'https://images.unsplash.com/photo-1549643276-fbc2bd380d6b?w=800&auto=format&fit=crop&q=60',
    tags: n.category ? [n.category] : [],
    timeSlot: 'Afternoon',
    bestTime: n.bestTime || 'Year-round',
    openTime: n.openingTimeWeekdays ? `${n.openingTimeWeekdays} - ${n.closingTimeWeekdays}` : 'Daytime',
    entryFee: n.entryFee || 'Free',
    gallery: n.images || []
}));

const mappedHospitals: Place[] = (emergencyData.hospitals || []).map((h: any) => ({
    id: h.id,
    name: h.name,
    category: 'emergency',
    description: h.speciality || 'Hospital and emergency services.',
    location: h.area || 'Puducherry',
    rating: 4.0,
    image: 'https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?w=800&auto=format&fit=crop&q=60',
    tags: ['Hospital', h.type || ''].filter(Boolean),
    timeSlot: 'Morning',
    bestTime: '24x7',
    openTime: h.timings || '24x7',
    entryFee: 'Varies',
    gallery: []
}));

export const PLACES_DATA: Place[] = [
    ...MANUAL_PLACES,
    ...IMPORTED_PLACES,
    ...mappedHotels,
    ...mappedRestaurants,
    ...mappedPubs,
    ...mappedAdventure,
    ...mappedTemples,
    ...mappedNature,
    ...mappedHospitals
];

export function getPlacesByCategory(category: string): Place[] {
    const cat = category.toLowerCase();

    if (cat === 'places' || cat === 'all') return PLACES_DATA;

    // Detailed Mappings
    if (cat === 'spiritual') return PLACES_DATA.filter(p => ['spiritual', 'temples', 'churches', 'mosques', 'jain'].includes(p.category));
    if (cat === 'temples') return PLACES_DATA.filter(p => ['temples', 'jain'].includes(p.category));
    if (cat === 'churches') return PLACES_DATA.filter(p => p.category === 'churches');
    if (cat === 'mosques') return PLACES_DATA.filter(p => p.category === 'mosques');

    if (cat === 'heritage') return PLACES_DATA.filter(p => ['heritage', 'history', 'monuments'].includes(p.category));
    if (cat === 'museums') return PLACES_DATA.filter(p => p.tags.includes('Museum') || p.category === 'heritage');

    if (cat === 'nature') return PLACES_DATA.filter(p => ['nature', 'parks', 'lakes'].includes(p.category));
    if (cat === 'parks') return PLACES_DATA.filter(p => p.category === 'parks');
    if (cat === 'beaches') return PLACES_DATA.filter(p => p.category === 'beaches');

    if (cat === 'restaurants') return PLACES_DATA.filter(p => ['restaurants', 'cafes', 'food'].includes(p.category));
    if (cat === 'hotels') return PLACES_DATA.filter(p => ['hotels', 'pg'].includes(p.category));
    if (cat === 'accommodations') return PLACES_DATA.filter(p => ['hotels', 'pg'].includes(p.category));
    if (cat === 'nightlife') return PLACES_DATA.filter(p => ['nightlife', 'pubs'].includes(p.category));
    if (cat === 'emergency') return PLACES_DATA.filter(p => ['emergency', 'hospitals'].includes(p.category));

    return PLACES_DATA.filter(p => p.category === cat);
}

export function getPlaceById(id: string): Place | undefined {
    return PLACES_DATA.find(p => p.id === id);
}

export function getAllPlaces(): Place[] {
    return PLACES_DATA;
}
