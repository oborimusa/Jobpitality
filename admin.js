// admin.js
const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json");

// 🔹 Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

// 🔹 List first 10 users (just for checking)
async function listUsers() {
  const result = await admin.auth().listUsers(10);
  result.users.forEach(user => {
    console.log("User:", user.email, "| UID:", user.uid);
  });
}

// 🔹 Function to set role by UID
async function setUserRole(uid, role) {
  try {
    await db.collection("users").doc(uid).set(
      { role: role },
      { merge: true } // don’t overwrite existing data
    );
    console.log(`✅ Role "${role}" assigned to UID: ${uid}`);
  } catch (err) {
    console.error("❌ Error setting role:", err);
  }
}

// 🔹 Function to set role by Email
async function setUserRoleByEmail(email, role) {
  try {
    const user = await admin.auth().getUserByEmail(email);
    const uid = user.uid;

    await setUserRole(uid, role);
    console.log(`✅ Role "${role}" assigned to Email: ${email} (UID: ${uid})`);
  } catch (err) {
    console.error("❌ Error setting role by email:", err);
  }
}

// Example usage (replace with real emails)
async function run() {
  await listUsers();

  // Uncomment one of these when you’re ready:
    await setUserRole("IS6dJkhgHDVcksRqt0CH6elEGkJ3", "superadmin");
  // await setUserRoleByEmail("someone@example.com", "superadmin");
}

run();