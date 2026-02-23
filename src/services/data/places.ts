
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
        image: "/assets/beaches/paradise beach.jpeg",
        tags: ["Boating", "Island", "Swimming"], timeSlot: "Morning",
        bestTime: "Morning", openTime: "8:00 AM – 5:00 PM"
    },
    {
        id: 'b3', name: "Serenity Beach", category: "beaches",
        description: "Popular surfing spot with a long pier. Swimming allowed with caution. Moderate safety.",
        location: "Kottakuppam", rating: 4.6,
        image: "/assets/beaches/serenity beach.jpg",
        tags: ["Surfing", "Cafes", "Popular"], timeSlot: "Evening",
        bestTime: "Evening", openTime: "5:00 AM – 8:00 PM"
    },
    {
        id: 'b4', name: "Auroville Beach", category: "beaches",
        description: "Quiet beach with rocky shoreline. Swimming not advised due to low safety/no lifeguards.",
        location: "Auroville", rating: 4.2,
        image: "/assets/beaches/auroville beach.jpg",
        tags: ["Quiet", "Rocky", "Cliffs"], timeSlot: "Morning",
        bestTime: "Morning", openTime: "5:00 AM – 7:00 PM"
    },
    {
        id: 'b5', name: "Reppo Beach", category: "beaches",
        description: "Quiet and less crowded beach near Kalapet. Perfect as a sunset point.",
        location: "Kalapet", rating: 4.5,
        image: "/assets/beaches/reppo beach.jfif",
        tags: ["Quiet", "Sunset", "Hidden Gem"], timeSlot: "Evening",
        bestTime: "Evening", openTime: "6:00 AM – 6:00 PM"
    },
    {
        id: 'b6', name: "Veerampattinam Beach", category: "beaches",
        description: "Famous fishing village beach with seasonal boating. Home to a large coastal community.",
        location: "Veerampattinam", rating: 4.4,
        image: "/assets/beaches/edan beach.jfif",
        tags: ["Fishing Village", "Boating", "Local"], timeSlot: "Morning",
        bestTime: "Morning", openTime: "24 Hours"
    },
    {
        id: 'b7', name: "Chunnambar Backwater", category: "beaches",
        description: "Backwater recreation hub offering boating, kayaking, and ferry services to Paradise Beach.",
        location: "Chunnambar", rating: 4.3,
        image: "/assets/beaches/chunnabar backwater.jfif",
        tags: ["Backwater", "Kayaking", "Ferry"], timeSlot: "Afternoon",
        bestTime: "9 AM - 4 PM", openTime: "9:00 AM – 5:00 PM", entryFee: "Entry Fee Applicable"
    },
    {
        id: 'b8', name: "Quiet Healing Centre Beach", category: "beaches",
        description: "A spiritual calm zone ideal for meditation. Low safety for swimming.",
        location: "Chinna Mudaliyar Chavady", rating: 4.5,
        image: "/assets/beaches/quite healing center beach.jfif",
        tags: ["Meditation", "Peace", "Secluded"], timeSlot: "Morning",
        bestTime: "Early Morning", openTime: "5:00 AM – 6:00 PM"
    },

    // --- HERITAGE (unchanged) ---
    {
        id: 'h1', name: "White Town Walks", category: "heritage",
        description: "Wander through the French Quarter with its colonial villas, yellow walls, and tree-lined streets.",
        location: "White Town", rating: 4.9,
        image: "/assets/spot/white town walks.jfif",
        tags: ["Architecture", "Walking", "Photography"], timeSlot: "Afternoon",
        bestTime: "3:00 PM - 6:00 PM", openTime: "24 Hours"
    },
    {
        id: 'h2', name: "Puducherry Museum", category: "heritage",
        description: "Discover the region's history, from Roman trade artifacts to French colonial memorabilia.",
        location: "St. Louis Street", rating: 4.2,
        image: "/assets/spot/museum.jfif",
        tags: ["History", "Indoor", "Museum"], timeSlot: "Afternoon",
        bestTime: "10:00 AM - 5:00 PM", openTime: "10AM - 5PM (Mon Closed)", entryFee: "₹10"
    },
    {
        id: 'h3', name: "Aayi Mandapam", category: "heritage",
        description: "A brilliant white monument in Bharathi Park built to commemorate a 16th-century courtesan.",
        location: "Bharathi Park", rating: 4.4,
        image: "/assets/spot/aayi mandapam.jfif",
        tags: ["Monument", "Park", "Relax"], timeSlot: "Evening",
        bestTime: "4:00 PM - 8:00 PM", openTime: "6:00 AM - 9:00 PM", entryFee: "Free"
    },
    {
        id: 'h4', name: "French War Memorial", category: "heritage",
        description: "A stylish memorial dedicated to residents of French India who died for the country during World War I.",
        location: "Goubert Avenue", rating: 4.6,
        image: "/assets/spot/french wa rmemorial.jfif",
        tags: ["Memorial", "History", "Solemn"], timeSlot: "Evening",
        bestTime: "Evening", openTime: "10:00 AM - 5:00 PM", entryFee: "Free"
    },
    {
        id: 'h5', name: "Bharathi Park", category: "heritage",
        description: "A lush green park in the heart of White Town, named after the Tamil poet Subramania Bharathi. Features the iconic Aayi Mandapam monument, musical fountains, and beautiful flower beds. A popular gathering spot for locals and tourists alike.",
        location: "White Town", rating: 4.5,
        image: "/assets/spot/barathi park.jfif",
        tags: ["Park", "Heritage", "Relaxation"], timeSlot: "Evening",
        bestTime: "4:00 PM - 7:00 PM", openTime: "6:00 AM - 9:00 PM", entryFee: "Free"
    },
    {
        id: 'h6', name: "Arikamedu Archaeological Site", category: "heritage",
        description: "An ancient Roman trade settlement dating back to the 2nd century BC. This archaeological site reveals Puducherry's deep connection with the Roman Empire through pottery, beads, and trading artifacts discovered during excavations.",
        location: "Arikamedu, 7 km from Puducherry", rating: 4.3,
        image: "/assets/spot/museum.jfif",
        tags: ["Archaeology", "Roman", "History"], timeSlot: "Morning",
        bestTime: "Morning", openTime: "9:00 AM - 5:00 PM", entryFee: "Free"
    },
    {
        id: 'h7', name: "Kargil War Memorial", category: "heritage",
        description: "A solemn memorial dedicated to the brave soldiers from Puducherry who sacrificed their lives during the 1999 Kargil War. Features a beautifully maintained garden, war memorabilia, and an eternal flame paying homage to the fallen heroes.",
        location: "Beach Road, near Dupleix Statue", rating: 4.5,
        image: "/assets/spot/french wa rmemorial.jfif",
        tags: ["Memorial", "War", "Tribute"], timeSlot: "Evening",
        bestTime: "Evening", openTime: "9:00 AM - 6:00 PM", entryFee: "Free"
    },
    {
        id: 'h8', name: "Raj Niwas", category: "heritage",
        description: "The official residence of the Lieutenant Governor of Puducherry, formerly known as the Governor's Palace. Built in the 18th century French colonial style, this grand mansion features elegant architecture, manicured gardens, and reflects the rich Franco-Tamil heritage.",
        location: "White Town, Beach Road", rating: 4.6,
        image: "/assets/spot/white town walks 2.jfif",
        tags: ["Palace", "Colonial", "Architecture"], timeSlot: "Afternoon",
        bestTime: "Morning", openTime: "View from outside (restricted entry)", entryFee: "Not open to public"
    },


    // SPIRITUAL (Ashrams)
    {
        id: 's2', name: "Sri Aurobindo Ashram", category: "spiritual",
        description: "A spiritual community and ashram founded by Sri Aurobindo and The Mother. A place of deep silence.",
        location: "Marine Street", rating: 4.7,
        image: "/assets/spot/aayi mandapam.jfif",
        tags: ["Meditation", "Silence", "Flowers"], timeSlot: "Morning",
        bestTime: "8:00 AM - 12:00 PM", openTime: "8:00 AM - 12:00 PM, 2:00 PM - 6:00 PM", entryFee: "Free"
    },
    {
        id: 's3', name: "Matrimandir", category: "spiritual",
        description: "The soul of Auroville. A massive golden sphere dedicated to human unity and meditation.",
        location: "Auroville", rating: 5.0,
        image: "/assets/spot/aayi mandapam 2.jfif",
        tags: ["Auroville", "Meditation", "Must-Visit"], timeSlot: "Morning",
        bestTime: "Booking Required", openTime: "Viewing Point: 9AM - 5PM", entryFee: "Free (Booking needed)"
    },

    // TEMPLES
    {
        id: 't1', name: "Manakula Vinayagar Temple", category: "temples",
        description: "Ancient Ganesha temple predating French rule. Famous for its golden chariot and temple elephant.",
        location: "White Town", rating: 4.9,
        image: "/assets/spot/aayi mandapam 2.jfif",
        tags: ["Ganesha", "Ancient", "Divine"], timeSlot: "Morning",
        bestTime: "Early Morning", openTime: "5:30 AM – 12:30 PM, 4:00 PM – 9:00 PM", entryFee: "Free"
    },
    {
        id: 't2', name: "Varadaraja Perumal Temple", category: "temples",
        description: "Historic Divya Desam temple dedicated to Lord Vishnu, featuring Dravidian architecture.",
        location: "Heritage Town", rating: 4.8,
        image: "/assets/spot/temple.jfif",
        tags: ["Vishnu", "Dravidian", "History"], timeSlot: "Evening",
        bestTime: "Evening Aarti", openTime: "6:00 AM – 11:30 AM, 4:30 PM – 8:30 PM", entryFee: "Free"
    },
    {
        id: 't3', name: "Vedapureeswarar Temple", category: "temples",
        description: "Dedicated to Lord Shiva, this ancient Saiva shrine was destroyed by the French in 1748 and rebuilt.",
        location: "Heritage Town", rating: 4.7,
        image: "/assets/spot/white town walks 3.jfif",
        tags: ["Shiva", "Powerful", "Rebuilt"], timeSlot: "Morning",
        bestTime: "Pradosham", openTime: "6:00 AM – 12:00 PM, 4:00 PM – 8:30 PM", entryFee: "Free"
    },
    {
        id: 't4', name: "Thirukaameeswarar Temple", category: "temples",
        description: "Renowned ancient temple in Villiyanur, famous for education-related prayers.",
        location: "Villiyanur", rating: 4.6,
        image: "/assets/spot/white town walks 2.jfif",
        tags: ["Villiyanur", "Education", "Rural"], timeSlot: "Evening",
        bestTime: "Morning", openTime: "6:00 AM – 12:00 PM, 4:00 PM – 8:00 PM", entryFee: "Free"
    },
    {
        id: 't5', name: "Sengazhuneer Amman Temple", category: "temples",
        description: "Popular local goddess temple in Veerampattinam coastal village.",
        location: "Veerampattinam", rating: 4.5,
        image: "/assets/beaches/edan beach.jfif",
        tags: ["Amman", "Folk", "Coastal"], timeSlot: "Morning",
        bestTime: "Friday", openTime: "6:00 AM – 11:00 AM, 4:00 PM – 8:00 PM", entryFee: "Free"
    },
    {
        id: 't6', name: "Ayyanar Temple", category: "temples",
        description: "Village guardian deity temple located in Lawspet.",
        location: "Lawspet", rating: 4.4,
        image: "/assets/spot/botanical garden.jfif",
        tags: ["Ayyanar", "Guardian", "Local"], timeSlot: "Evening",
        bestTime: "Evening", openTime: "6:00 AM – 10:00 AM, 5:00 PM – 8:00 PM", entryFee: "Free"
    },
    {
        id: 't7', name: "Kamakshi Amman Temple", category: "temples",
        description: "A revered Hindu temple dedicated to Goddess Kamakshi, a form of Parvati. Located near the beach, this temple is known for its vibrant festivals, intricate gopuram, and daily rituals that draw devotees from across the region.",
        location: "Villianur Main Road", rating: 4.6,
        image: "/assets/spot/aayi mandapam.jfif",
        tags: ["Amman", "Goddess", "Festivals"], timeSlot: "Morning",
        bestTime: "Friday & Pournami", openTime: "6:00 AM – 12:00 PM, 4:00 PM – 8:30 PM", entryFee: "Free"
    },
    {
        id: 't8', name: "Arulmigu Kanniga Parameswari Temple", category: "temples",
        description: "An ancient temple dedicated to Goddess Kanniga Parameswari, believed to be over 500 years old. Located in the fishing village of Kuruchikuppam, this temple is known for its annual chariot festival and the deep devotion of the local coastal community.",
        location: "Kuruchikuppam", rating: 4.5,
        image: "/assets/spot/temple.jfif",
        tags: ["Goddess", "Ancient", "Chariot Festival"], timeSlot: "Morning",
        bestTime: "Morning Pooja", openTime: "6:00 AM – 12:00 PM, 4:00 PM – 8:00 PM", entryFee: "Free"
    },

    {
        id: 'c1', name: "Sacred Heart Basilica", category: "churches",
        description: "A stunning example of Gothic revival architecture with rare stained glass panels depicting the life of Christ.",
        location: "Subbayah Salai", rating: 4.8,
        image: "/assets/spot/museum.jfif",
        tags: ["Basilica", "Gothic", "Stained Glass"], timeSlot: "Evening",
        bestTime: "Evening Mass", openTime: "6:00 AM – 7:00 PM", entryFee: "Free"
    },
    {
        id: 'c2', name: "Immaculate Conception Cathedral", category: "churches",
        description: "The 300-year-old mother church of the Roman Catholic Archdiocese, known locally as Samba Kovil.",
        location: "Mission Street", rating: 4.6,
        image: "/assets/spot/white town walks 3.jfif",
        tags: ["Cathedral", "History", "Blue-Gold"], timeSlot: "Morning",
        bestTime: "Sunday Morning", openTime: "6:00 AM – 6:30 PM", entryFee: "Free"
    },
    {
        id: 'c3', name: "Our Lady of Angels Church", category: "churches",
        description: "A beautiful French colonial era church in White Town facing the Bay of Bengal.",
        location: "White Town", rating: 4.7,
        image: "/assets/spot/french wa rmemorial.jfif",
        tags: ["French", "Pink", "Sea View"], timeSlot: "Afternoon",
        bestTime: "Sunset", openTime: "6:30 AM – 6:30 PM", entryFee: "Free"
    },
    {
        id: 'c4', name: "St. Andrew’s Church", category: "churches",
        description: "One of the oldest Presbyterian churches in the region.",
        location: "Church Street", rating: 4.4,
        image: "/assets/spot/white town walks.jfif",
        tags: ["Protestant", "Serene", "Old"], timeSlot: "Morning",
        bestTime: "Sunday Service", openTime: "6:00 AM – 6:00 PM", entryFee: "Free"
    },

    // MOSQUES & JAIN
    {
        id: 'm1', name: "Muthialpet Mosque", category: "mosques",
        description: "A prominent Sunni mosque serving the Muthialpet community.",
        location: "Muthialpet", rating: 4.5,
        image: "/assets/spot/white town walks 2.jfif",
        tags: ["Mosque", "Sunni", "Prayer"], timeSlot: "Evening",
        bestTime: "Friday", openTime: "5:00 AM – 9:00 PM", entryFee: "Free"
    },
    {
        id: 'j1', name: "Puducherry Jain Temple", category: "temples",
        description: "Main Svetambara Jain temple serving the local Jain community.",
        location: "Heritage Town", rating: 4.5,
        image: "/assets/spot/temple.jfif",
        tags: ["Jain", "Peace", "White"], timeSlot: "Morning",
        bestTime: "Morning", openTime: "6:00 AM – 11:00 AM, 5:00 PM – 8:00 PM", entryFee: "Free"
    },

    // --- FOOD & CAFES (unchanged) ---
    {
        id: 'f1', name: "Cafe des Arts", category: "restaurants",
        description: "A quirky, vintage cafe serving delicious crepes and baguettes in a colonial setting.",
        location: "Suffren Street", rating: 4.6,
        image: "/assets/spot/casablanca.jfif",
        tags: ["Cafe", "French", "Vintage"], timeSlot: "Afternoon",
        bestTime: "Lunch", openTime: "8:30 AM - 7:00 PM (Tue Closed)", entryFee: "₹500 for two"
    },
    {
        id: 'f2', name: "Coromandel Cafe", category: "restaurants",
        description: "Upscale dining in a beautifully restored heritage mansion with a lush garden courtyard.",
        location: "Romain Rolland St", rating: 4.8,
        image: "/assets/stay/coromandel heritage.jfif",
        tags: ["Fine Dining", "Heritage", "Cocktails"], timeSlot: "Evening",
        bestTime: "Dinner", openTime: "8:30 AM - 10:30 PM", entryFee: "₹1200 for two"
    },
    {
        id: 'f3', name: "Baker Street", category: "restaurants",
        description: "The most famous French bakery in Pondicherry, known for its authentic croissants, pastries, and artisanal breads. A must-visit destination for breakfast or high tea lovers looking for a true taste of France.",
        location: "Bussy Street", rating: 4.7,
        image: "/assets/spot/sunday market.jfif",
        tags: ["Bakery", "French", "Pastries"], timeSlot: "Morning",
        bestTime: "Early Morning", openTime: "7:00 AM - 9:30 PM", entryFee: "₹400 for two"
    },
    {
        id: 'f4', name: "Le Cafe", category: "restaurants",
        description: "The only 24/7 seafront cafe in Pondicherry. Simple food, unbeatable views.",
        location: "Beach Road", rating: 4.3,
        image: "/assets/beaches/promenade beach.jpg",
        tags: ["Sea View", "24/7", "Coffee"], timeSlot: "Evening",
        bestTime: "Midnight or Sunrise", openTime: "24 Hours", entryFee: "₹300 for two"
    },
    {
        id: 'f5', name: "Villa Shanti", category: "restaurants",
        description: "Elegant courtyard dining offering a mix of Indian and Continental flavors.",
        location: "Suffren Street", rating: 4.7,
        image: "/assets/stay/villa shanti.webp",
        tags: ["Dinner", "Romantic", "Multi-cuisine"], timeSlot: "Evening",
        bestTime: "Dinner", openTime: "12:00 PM - 10:30 PM", entryFee: "₹1500 for two"
    },

    // --- NATURE (unchanged) ---
    {
        id: 'n1', name: "Botanical Gardens", category: "parks",
        description: "Established in 1826, this garden features exotic trees, a toy train, and a musical fountain.",
        location: "Near Bus Stand", rating: 4.1,
        image: "/assets/spot/botanical garden.jfif",
        tags: ["Garden", "Nature", "Family"], timeSlot: "Afternoon",
        bestTime: "4:00 PM - 6:00 PM", openTime: "10:00 AM - 5:00 PM", entryFee: "₹20"
    },
    {
        id: 'n2', name: "Ousteri Lake", category: "nature",
        description: "A vast man-made lake and bird sanctuary. Great for boat rides and sunset watching.",
        location: "Osudu", rating: 4.4,
        image: "/assets/adventure/ousteri lake.jfif",
        tags: ["Lake", "Birds", "Boating"], timeSlot: "Evening",
        bestTime: "Sunset", openTime: "9:00 AM - 5:00 PM", entryFee: "Free (Boating extra)"
    },
    {
        id: 'n3', name: "Pichavaram Mangroves", category: "nature",
        description: "One of the world's largest mangrove forests. Take a boat ride through the narrow canals.",
        location: "Chidambaram (Day Trip)", rating: 4.8,
        image: "/assets/activity/mangrove kayaking.jfif",
        tags: ["Mangroves", "Boating", "Day Trip"], timeSlot: "Morning",
        bestTime: "Morning", openTime: "8:00 AM - 5:00 PM", entryFee: "₹200 (Boat)"
    },

    // --- ADVENTURE (unchanged) ---
    {
        id: 'a1', name: "Scuba Diving", category: "adventure",
        description: "Explore the coral reefs and underwater marine life of the Bay of Bengal.",
        location: "Eden Beach / Harbour", rating: 4.9,
        image: "/assets/adventure/chunnambar kayaking.jfif",
        tags: ["Diving", "Underwater", "Thrilling"], timeSlot: "Morning",
        bestTime: "Morning", openTime: "Booking Required", entryFee: "₹5000+"
    },
    {
        id: 'a2', name: "Surfing Lessons", category: "adventure",
        description: "Learn to surf the waves at Serenity Beach with certified instructors.",
        location: "Serenity Beach", rating: 4.8,
        image: "/assets/adventure/beach surfing.jfif",
        tags: ["Surfing", "Active", "Water"], timeSlot: "Morning",
        bestTime: "Morning", openTime: "7:00 AM - 11:00 AM", entryFee: "₹1500/session"
    },
    {
        id: 'a3', name: "Midnight Cycling", category: "adventure",
        description: "Experience the charm of White Town at night on a guided cycling tour.",
        location: "White Town", rating: 4.7,
        image: "/assets/activity/beach cycling.jfif",
        tags: ["Cycling", "Night", "Tour"], timeSlot: "Evening",
        bestTime: "Night", openTime: "Booking Required", entryFee: "₹800/person"
    },

    // --- SHOPPING (unchanged) ---
    {
        id: 'sh1', name: "Sunday Market", category: "shopping",
        description: "A bustling street market on M.G. Road selling books, clothes, and trinkets at bargain prices.",
        location: "M.G. Road", rating: 4.2,
        image: "/assets/spot/sunday market.jfif",
        tags: ["Street Market", "Cheap", "Crowd"], timeSlot: "Evening",
        bestTime: "Sunday Evening", openTime: "Sunday Only", entryFee: "Free"
    },
    {
        id: 'sh2', name: "Casablanca", category: "shopping",
        description: "A premium department store offering branded clothes, souvenirs, and home decor.",
        location: "Mission Street", rating: 4.5,
        image: "/assets/spot/casablanca.jfif",
        tags: ["Mall", "Shopping", "AC"], timeSlot: "Afternoon",
        bestTime: "Daytime", openTime: "10:00 AM - 10:00 PM", entryFee: "Free"
    },
    {
        id: 'sh3', name: "Cluny Embroidery Centre", category: "shopping",
        description: "A colonial building where you can buy delicate hand-embroidered linens made by local women.",
        location: "White Town", rating: 4.6,
        image: "/assets/spot/white town walks.jfif",
        tags: ["Handmade", "Charity", "Souvenirs"], timeSlot: "Afternoon",
        bestTime: "Daytime", openTime: "9:00 AM - 5:00 PM", entryFee: "Free"
    },

    // --- ACCOMMODATIONS (From Hotels.xlsx) ---

    // HOTELS & RESORTS
    {
        id: 'hot1', name: "Hotel Annamalai International", category: "hotels",
        description: "Comfortable stay in White Town with deluxe and suite rooms. Check-in 12 PM / Check-out 11 AM.",
        location: "White Town", rating: 4.2,
        image: "/assets/stay/hotel annamalai.jfif",
        tags: ["Deluxe", "Suite", "White Town"], timeSlot: "Afternoon",
        bestTime: "Year-round", openTime: "24 Hours", entryFee: "₹3500–6000/night"
    },
    {
        id: 'hot2', name: "Hotel Atithi", category: "hotels",
        description: "Budget-friendly hotel with AC and Non-AC rooms in Heritage Town.",
        location: "Heritage Town", rating: 4.0,
        image: "/assets/stay/hotel atithi.jfif",
        tags: ["Budget", "AC", "Heritage"], timeSlot: "Afternoon",
        bestTime: "Year-round", openTime: "24 Hours", entryFee: "₹2500–4500/night"
    },
    {
        id: 'hot3', name: "Le Pondy", category: "hotels",
        description: "Luxury resort featuring cottages and villas with premium amenities. Check-in 2 PM / Check-out 12 PM.",
        location: "Pudukuppam", rating: 4.5,
        image: "/assets/stay/le pondy.jfif",
        tags: ["Luxury", "Resort", "Villas"], timeSlot: "Afternoon",
        bestTime: "Year-round", openTime: "24 Hours", entryFee: "₹7000–12000/night"
    },
    {
        id: 'hot4', name: "Ginger Pondicherry", category: "hotels",
        description: "Reliable chain hotel with standard rooms and modern amenities.",
        location: "Karuvadikuppam", rating: 4.1,
        image: "/assets/stay/ginger hotel.jfif",
        tags: ["Chain Hotel", "Standard", "Modern"], timeSlot: "Afternoon",
        bestTime: "Year-round", openTime: "24 Hours", entryFee: "₹2800–4000/night"
    },
    {
        id: 'hot5', name: "Accord Puducherry", category: "hotels",
        description: "Upscale hotel with executive rooms and suites, offering premium business facilities.",
        location: "Ellaipillaichavady", rating: 4.6,
        image: "/assets/stay/accord.jfif",
        tags: ["Upscale", "Business", "Executive"], timeSlot: "Afternoon",
        bestTime: "Year-round", openTime: "24 Hours", entryFee: "₹5000–8000/night"
    },
    {
        id: 'hot6', name: "The Windflower", category: "hotels",
        description: "Luxury boutique resort with elegantly designed rooms and spa services.",
        location: "Manavely", rating: 4.4,
        image: "/assets/stay/wildflower.jpg",
        tags: ["Boutique", "Spa", "Luxury"], timeSlot: "Afternoon",
        bestTime: "Year-round", openTime: "24 Hours", entryFee: "₹9000–14000/night"
    },
    {
        id: 'hot7', name: "Ocean Spray", category: "hotels",
        description: "Beach resort with villa accommodations. Enjoy sea views and tranquility. Check-in 2 PM / Check-out 11 AM.",
        location: "Manjakuppam", rating: 4.3,
        image: "/assets/stay/ocean spray.jfif",
        tags: ["Beach Resort", "Villas", "Sea View"], timeSlot: "Morning",
        bestTime: "Year-round", openTime: "24 Hours", entryFee: "₹7000–13000/night"
    },
    {
        id: 'hot8', name: "Paradise Lagoon", category: "hotels",
        description: "Scenic resort with cottage-style accommodations. Check-in 1 PM / Check-out 11 AM.",
        location: "Pooranankuppam", rating: 4.2,
        image: "/assets/stay/paradise lagoon.jfif",
        tags: ["Cottages", "Scenic", "Resort"], timeSlot: "Afternoon",
        bestTime: "Year-round", openTime: "24 Hours", entryFee: "₹6000–10000/night"
    },

    // HERITAGE & BOUTIQUE STAYS
    {
        id: 'hot9', name: "Villa Shanti", category: "hotels",
        description: "Boutique heritage hotel in a restored colonial building with deluxe rooms.",
        location: "White Town", rating: 4.7,
        image: "/assets/stay/villa shanti.webp",
        tags: ["Heritage", "Boutique", "Colonial"], timeSlot: "Afternoon",
        bestTime: "Year-round", openTime: "24 Hours", entryFee: "₹5500–7500/night"
    },
    {
        id: 'hot10', name: "La Maison Charu", category: "hotels",
        description: "Charming heritage property with traditional French-Tamil architecture.",
        location: "White Town", rating: 4.5,
        image: "/assets/stay/la maison charu.webp",
        tags: ["Heritage", "French", "Charm"], timeSlot: "Afternoon",
        bestTime: "Year-round", openTime: "24 Hours", entryFee: "₹4500–6500/night"
    },

    // BUDGET STAYS
    {
        id: 'hot11', name: "Anandha Inn", category: "hotels",
        description: "Budget-friendly accommodation on MG Road with basic amenities.",
        location: "MG Road", rating: 3.9,
        image: "/assets/stay/anandha inn.jpg",
        tags: ["Budget", "MG Road", "Basic"], timeSlot: "Afternoon",
        bestTime: "Year-round", openTime: "24 Hours", entryFee: "₹1800–3000/night"
    },

    // PG ACCOMMODATIONS
    {
        id: 'pg1', name: "Sri Balaji PG", category: "pg",
        description: "Comfortable PG accommodation with single and shared room options. Flexible check-in.",
        location: "T.C Koot Road", rating: 4.0,
        image: "/assets/stay/hotel atithi.jfif",
        tags: ["PG", "Single", "Shared"], timeSlot: "Afternoon",
        bestTime: "Year-round", openTime: "Flexible", entryFee: "₹4500–7000/month"
    },
    {
        id: 'pg2', name: "Green Homes PG", category: "pg",
        description: "Affordable shared accommodation for students and working professionals.",
        location: "Edayanchavadi", rating: 3.9,
        image: "/assets/stay/ginger hotel.jfif",
        tags: ["PG", "Shared", "Affordable"], timeSlot: "Afternoon",
        bestTime: "Year-round", openTime: "Flexible", entryFee: "₹5000–6500/month"
    },
    {
        id: 'pg3', name: "Auro PG Stay", category: "pg",
        description: "Quality PG accommodation near Auroville with single room options.",
        location: "Auroville", rating: 4.1,
        image: "/assets/stay/villa shanti.webp",
        tags: ["PG", "Auroville", "Single"], timeSlot: "Afternoon",
        bestTime: "Year-round", openTime: "Flexible", entryFee: "₹6000–8000/month"
    },
    {
        id: 'pg4', name: "Student Nest", category: "pg",
        description: "Student-focused PG accommodation with essential amenities.",
        location: "Puducherry", rating: 3.8,
        image: "/assets/stay/hotel annamalai.jfif",
        tags: ["PG", "Students", "Budget"], timeSlot: "Afternoon",
        bestTime: "Year-round", openTime: "Flexible", entryFee: "₹4000–6000/month"
    }
];


import hotelsData from '../../data/hotels.json';
import restaurantsData from '../../data/restaurants.json';
import pubsData from '../../data/pubs.json';
import adventureData from '../../data/adventure.json';
import templesData from '../../data/temples.json';
import emergencyData from '../../data/emergency.json';
import natureData from '../../data/nature.json';

import { resolveLocalImage, resolveLocalGallery } from './localImages';

const mappedHotels: Place[] = (Array.isArray(hotelsData) ? hotelsData : []).map((h: any, i) => {
    const name = h.name || h['Hotel Name'] || h['Hotel'] || 'Unknown Hotel';
    return {
        id: h.id || `hotel-${i}`,
        name,
        category: 'hotels',
        description: h.description || h.specialFeatures || h.Notes || 'Comfortable stay',
        location: h.location || h.address || h.Area || 'Puducherry',
        rating: h.rating || 4.2,
        image: resolveLocalImage(name, h.image || (h.images && h.images[0]) || '/assets/stay/hotel annamalai.jfif'),
        tags: h.facilities?.slice(0, 3) || [],
        timeSlot: 'Afternoon',
        bestTime: 'Year-round',
        openTime: h.checkIn ? `${h.checkIn} - ${h.checkOut}` : '24 Hours',
        entryFee: h.priceRange || h.entryFee || 'Contact for price',
        gallery: resolveLocalGallery(name, h.images || [])
    };
});

const mappedRestaurants: Place[] = (Array.isArray(restaurantsData) ? restaurantsData : []).map((r: any, i) => {
    const name = r.name || r['Restaurant Name'] || 'Unknown Restaurant';
    return {
        id: r.id || `rest-${i}`,
        name,
        category: 'restaurants',
        description: r.description || r.Description || 'Great place to eat in Puducherry.',
        location: r.location || r.area || r.Location || 'Puducherry',
        rating: r.rating || r.Rating || 4.3,
        image: resolveLocalImage(name, r.image || (r.images && r.images[0]) || '/assets/stay/hotel atithi.jfif'),
        tags: r.cuisine ? [r.cuisine, r.type || ''].filter(Boolean) : [r['Category'], r['Main Cuisine']].filter(Boolean),
        timeSlot: 'Evening',
        bestTime: 'Lunch/Dinner',
        openTime: r.openTime || r['Opening_Time'] ? `${r.openTime || r['Opening_Time']} - ${r.closeTime || r['Closing_Time']}` : 'Check for timings',
        entryFee: r.priceRange || r['Price Range'] || 'Varies',
        gallery: resolveLocalGallery(name, r.images || [])
    };
});

const mappedPubs: Place[] = (Array.isArray(pubsData) ? pubsData : []).map((p: any, i) => {
    const name = p.name || p['Pub Name'] || 'Unknown Pub';
    return {
        id: p.id || `pub-${i}`,
        name,
        category: 'pubs',
        description: p.description || p.Notes || 'Popular nightlife spot.',
        location: p.location || p.area || p.Area || 'Puducherry',
        rating: p.rating || 4.4,
        image: resolveLocalImage(name, p.image || (p.images && p.images[0]) || '/assets/stay/villa shanti.webp'),
        tags: p.features?.slice(0, 3) || [p['Type']],
        timeSlot: 'Evening',
        bestTime: p['Best Days'] || 'Night',
        openTime: p.openTime || p['Opening Time'] ? `${p.openTime || p['Opening Time']} - ${p.closeTime || p['Closing Time']}` : 'Evening onwards',
        entryFee: p.entryFee || p['Entry Fee'] || 'Varies',
        gallery: resolveLocalGallery(name, p.images || [])
    };
});

const mappedAdventure: Place[] = (Array.isArray(adventureData) ? adventureData : []).map((a: any, i) => {
    const name = a.name || a['Activity Name'] || 'Unknown Activity';
    return {
        id: a.id || `adv-${i}`,
        name,
        category: 'adventure',
        description: a.description || a.Notes || 'Adventure activity in Puducherry.',
        location: a.location || a.Area || a['Route/Location'] || 'Puducherry',
        rating: a.rating || 4.5,
        image: resolveLocalImage(name, a.image || (a.images && a.images[0]) || '/assets/activity/surfing lesson.jfif'),
        tags: a.activities?.slice(0, 3) || [a['Type']],
        timeSlot: 'Morning',
        bestTime: a.bestTime || a['Best Time'] || 'Daytime',
        openTime: a.timing || a.timings || a['Opening Time'] || 'Check availability',
        entryFee: a.price || a.entryFee || a['Price Range'] || 'Varies',
        gallery: resolveLocalGallery(name, a.images || [])
    };
});

const mappedTemples: Place[] = (Array.isArray(templesData) ? templesData : []).map((t: any, i) => {
    const name = t.name || t['Temple Name'] || 'Unknown Temple';
    return {
        id: t.id || `temp-${i}`,
        name,
        category: t.religion?.toLowerCase() === 'hindu' ? 'temples' : (t.religion?.toLowerCase() === 'christian' ? 'churches' : (t.religion?.toLowerCase() === 'muslim' ? 'mosques' : 'spiritual')),
        description: t.description || t.Notes || 'Religious place in Puducherry.',
        location: t.location || t.Area || 'Puducherry',
        rating: t.rating || 4.7,
        image: resolveLocalImage(name, t.image || (t.images && t.images[0]) || '/assets/spot/temple.jfif'),
        tags: t.religion ? [t.religion] : [],
        timeSlot: 'Morning',
        bestTime: t.bestTime || t['Best Time'] || 'Morning/Evening',
        openTime: t.timing || t.openingTimeWeekdays || 'Check timings',
        entryFee: t.price || t.entryFee || 'Free',
        gallery: resolveLocalGallery(name, t.images || [])
    };
});

const mappedNature: Place[] = (Array.isArray(natureData) ? natureData : []).map((n: any, i) => {
    const name = n.name || n['Name'] || n['name'] || 'Unknown Nature Spot';
    return {
        id: n.id || `nat-${i}`,
        name,
        category: n.category?.toLowerCase() === 'garden' || n.category?.toLowerCase() === 'city park' ? 'parks' : 'nature',
        description: n.description || n.specialFeatures || 'Beautiful nature spot.',
        location: n.location || 'Puducherry',
        rating: n.rating || 4.5,
        image: resolveLocalImage(name, n.image || (n.images && n.images[0]) || '/assets/spot/botanical garden.jfif'),
        tags: n.category ? [n.category] : [n['type']].filter(Boolean),
        timeSlot: 'Afternoon',
        bestTime: n.bestTime || n.best_time || 'Year-round',
        openTime: n.openingTimeWeekdays || n.timing_weekday ? `${n.openingTimeWeekdays || n.timing_weekday}` : 'Daytime',
        entryFee: n.entryFee || n.entry_fee || 'Free',
        gallery: resolveLocalGallery(name, n.images || [])
    };
});

const mappedHospitals: Place[] = (Array.isArray(emergencyData) ? emergencyData : []).map((h: any, i) => {
    const name = h.name || h['Hospital Name'] || 'Unknown Hospital';
    return {
        id: h.id || `hosp-${i}`,
        name,
        category: 'emergency',
        description: h.speciality || h.Speciality || 'Hospital and emergency services.',
        location: h.area || h.Area || 'Puducherry',
        rating: 4.0,
        image: resolveLocalImage(name, '/assets/spot/white town walks.jfif'),
        tags: ['Hospital', h.type || h['Hospital Type'] || ''].filter(Boolean),
        timeSlot: 'Morning',
        bestTime: '24x7',
        openTime: h.timings || h['Weekday Timings'] || '24x7',
        entryFee: 'Varies',
        gallery: resolveLocalGallery(name, [])
    };
});

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
