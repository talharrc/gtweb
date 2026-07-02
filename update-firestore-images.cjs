// Script to update imageUrl for all products in Firestore
const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs, updateDoc, doc } = require('firebase/firestore');

const firebaseConfig = {
  apiKey: "AIzaSyC8FnINLWsKzZdk4HD8GHp9BacBqhIQ_R8",
  authDomain: "gen-lang-client-0134025296.firebaseapp.com",
  projectId: "gen-lang-client-0134025296",
  storageBucket: "gen-lang-client-0134025296.firebasestorage.app",
  messagingSenderId: "636475486593",
  appId: "1:636475486593:web:940d9dfcd8aa324ef6b880",
};

// Map of product IDs or slugs to their new banner image URLs
const IMAGE_MAP = {
  'netflix-premium':         '/store/netflix-banner.png',
  'netflix-prime-combo':     '/store/netflix-prime-combo-banner.png',
  'prime-video':             '/store/prime-banner.png',
  'spotify-premium':         '/store/spotify-banner.png',
  'chatgpt-plus':            '/store/chatgpt-banner.png',
  'canva-pro':               '/store/canva-banner.png',
  'disney-hotstar':          '/store/disney-banner.png',
  'apple-itunes-gift-card':  '/store/apple-banner.png',
  'pubg-mobile-uc-topup':    '/store/pubg-banner.png',
};

async function main() {
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);

  const snap = await getDocs(collection(db, 'products'));
  console.log(`Found ${snap.docs.length} products in Firestore`);

  let updated = 0;
  for (const docSnap of snap.docs) {
    const data = docSnap.data();
    const slug = data.slug;
    const newImageUrl = IMAGE_MAP[slug];

    if (newImageUrl) {
      await updateDoc(doc(db, 'products', docSnap.id), { imageUrl: newImageUrl });
      console.log(`✅ Updated: ${data.name} (${slug}) -> ${newImageUrl}`);
      updated++;
    } else {
      console.log(`⚠️  No image mapped for: ${data.name} (slug: "${slug}")`);
    }
  }

  console.log(`\nDone! Updated ${updated}/${snap.docs.length} products.`);
  process.exit(0);
}

main().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
