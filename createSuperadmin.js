// createSuperadmin.js
const admin = require("firebase-admin");
const serviceAccount = require("./jobpitality-1cfb2-firebase-adminsdk-fbsvc-a2411ccca7.json"); // 👈 replace with your actual file name

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();
const auth = admin.auth();

async function createSuperAdmin() {
  const email = "superadmin@jobpitality.com";
  const password = "Superadmin123!";
  const displayName = "Jobpitality Super Admin";

  try {
    // Create or get user
    let userRecord;
    try {
      userRecord = await auth.createUser({ email, password, displayName });
      console.log(`✅ Created Superadmin account: ${userRecord.uid}`);
    } catch (error) {
      if (error.code === "auth/email-already-exists") {
        userRecord = await auth.getUserByEmail(email);
        console.log("ℹ️ Superadmin already exists, using existing account.");
      } else {
        throw error;
      }
    }

    // Add to Firestore
    await db.collection("users").doc(userRecord.uid).set(
      {
        email,
        name: displayName,
        role: "superadmin",
        companyName: "Jobpitality",
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        isActive: true,
      },
      { merge: true }
    );

    console.log("✅ Superadmin role successfully assigned.");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error creating superadmin:", error.message);
    process.exit(1);
  }
}

createSuperAdmin();
