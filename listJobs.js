// listJobs.js
const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function listJobs() {
  const snapshot = await db.collection("jobs").get();
  if (snapshot.empty) {
    console.log("⚠️ No jobs found in Firestore.");
    return;
  }

  console.log("✅ Jobs in Firestore:");
  snapshot.forEach(doc => {
    console.log(doc.id, "=>", doc.data());
  });
}

listJobs();