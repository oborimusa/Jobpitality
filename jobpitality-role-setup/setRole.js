import admin from "firebase-admin";
import { readFileSync } from "fs";

const serviceAccount = JSON.parse(
  readFileSync("./serviceAccountKey.json", "utf8")
);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const email = "oborimusa@gmail.com"; // your superadmin email
const role = "superadmin";

async function setCustomUserRole() {
  try {
    const user = await admin.auth().getUserByEmail(email);
    await admin.auth().setCustomUserClaims(user.uid, { role });
    console.log(`✅ Role '${role}' assigned successfully to ${email}`);
  } catch (error) {
    console.error("❌ Error assigning role:", error);
  }
}

setCustomUserRole();