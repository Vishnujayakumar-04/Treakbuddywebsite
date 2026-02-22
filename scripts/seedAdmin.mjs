/**
 * TrekBuddy Admin Seed Script
 * Creates/updates the admin user document in Firestore with role: "admin"
 * Run with: node scripts/seedAdmin.mjs
 */

import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, setDoc, serverTimestamp } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyCRVuHFtiY8h4269v1a-T4nHMKLhsC-t_0",
    authDomain: "trekbuddy-72b01.firebaseapp.com",
    projectId: "trekbuddy-72b01",
    storageBucket: "trekbuddy-72b01.firebasestorage.app",
    messagingSenderId: "512827597054",
    appId: "1:512827597054:web:a01e3ff2f07534446c85af",
};

const ADMIN_UID = "tUXgOQy51aaKLcEw2ynutPMoxGj1";
const ADMIN_EMAIL = "admin@gmail.com";
const ADMIN_PASS = "123456";

console.log("🚀 TrekBuddy Admin Seed Script");
console.log("================================");

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

try {
    // Step 1: Sign in as the admin user
    console.log(`\n🔐 Signing in as ${ADMIN_EMAIL}...`);
    const cred = await signInWithEmailAndPassword(auth, ADMIN_EMAIL, ADMIN_PASS);
    console.log(`✅ Signed in. UID: ${cred.user.uid}`);

    // Step 2: Write the admin document to Firestore
    console.log(`\n📝 Writing admin document to Firestore...`);
    const userRef = doc(db, 'users', ADMIN_UID);

    await setDoc(userRef, {
        uid: ADMIN_UID,
        email: ADMIN_EMAIL,
        displayName: "Admin",
        role: "admin",
        savedPlaces: [],
        visitedPlaces: [],
        preferences: {
            language: "en",
            theme: "dark",
        },
        createdAt: new Date().toISOString(),
    }, { merge: true }); // merge: true so it doesn't overwrite existing fields

    console.log(`\n✅ SUCCESS! Admin document created in Firestore.`);
    console.log(`\n   Collection : users`);
    console.log(`   Document   : ${ADMIN_UID}`);
    console.log(`   role       : admin`);
    console.log(`\n🎉 You can now log in at: http://localhost:3000/admin/login`);
    console.log(`   Email    : ${ADMIN_EMAIL}`);
    console.log(`   Password : ${ADMIN_PASS}`);

} catch (err) {
    console.error(`\n❌ Error: ${err.message}`);
    if (err.code) console.error(`   Code: ${err.code}`);

    if (err.code === 'auth/invalid-credential') {
        console.error('\n   → Check that the email/password is correct in Firebase Authentication.');
    } else if (err.code === 'permission-denied') {
        console.error('\n   → Firestore rules blocked the write. Try temporarily setting rules to allow authenticated writes.');
    }
    process.exit(1);
}

process.exit(0);
