import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const theatres = [
  {
    "name": "PVR Cinemas - Providence Mall",
    "category": "theatre",
    "location": "Providence Mall, Puducherry",
    "type": "Multiplex",
    "rating": 4.6,
    "image": "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?q=80&w=400&fit=crop",
    "features": ["AC", "Food Court", "Parking"]
  },
  {
    "name": "Jeeva Rukmani Cinemas",
    "category": "theatre",
    "location": "Anna Salai, Puducherry",
    "type": "Multiplex",
    "rating": 4.3,
    "image": "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=400&fit=crop",
    "features": ["Dolby Sound", "Parking"]
  },
  {
    "name": "Rathna Theatre",
    "category": "theatre",
    "location": "MG Road, Puducherry",
    "type": "Single Screen",
    "rating": 4.1,
    "image": "https://images.unsplash.com/photo-1595769816263-9b910be24d5f?q=80&w=400&fit=crop",
    "features": ["Affordable", "Local Favorite"]
  },
  {
    "name": "Balaji Theatre 70MM",
    "category": "theatre",
    "location": "Reddiarpalayam, Puducherry",
    "type": "Single Screen",
    "rating": 4.0,
    "image": "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=400&fit=crop",
    "features": ["Budget Friendly"]
  },
  {
    "name": "Shanmuga Cinemas",
    "category": "theatre",
    "location": "Lawspet, Puducherry",
    "type": "Multiplex",
    "rating": 4.2,
    "image": "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?q=80&w=400&fit=crop",
    "features": ["AC", "Snacks"]
  },
  {
    "name": "Ashok Theatre",
    "category": "theatre",
    "location": "Villiyanur, Puducherry",
    "type": "Single Screen",
    "rating": 3.9,
    "image": "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?q=80&w=400&fit=crop",
    "features": ["Budget"]
  }
];

async function seed() {
  console.log("Starting seeding of theatres...");
  let count = 0;
  for (const t of theatres) {
    try {
      await addDoc(collection(db, 'places'), t);
      console.log(`Added: ${t.name}`);
      count++;
    } catch (error) {
      console.error(`Failed to add ${t.name}:`, error);
    }
  }
  console.log(`Seeding complete. Inserted ${count} theatres.`);
  process.exit(0);
}

seed();
