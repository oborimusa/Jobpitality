const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json");

// Initialize Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

// ---- Mock Data ---- //
const users = {
  user001: { name: "Dahiru Obori", email: "dahiru@example.com", role: "admin", phone: "+2348127706378", location: "Osogbo, Nigeria", createdAt: new Date("2025-09-28T10:00:00Z") },
  user002: { name: "Mary Johnson", email: "mary.j@example.com", role: "employer", phone: "+233201234567", location: "Accra, Ghana", companyName: "Sankofa Resorts", createdAt: new Date("2025-09-29T09:30:00Z") },
  user003: { name: "Ahmed Bello", email: "ahmedb@example.com", role: "jobseeker", phone: "+254701112233", location: "Nairobi, Kenya", createdAt: new Date("2025-09-30T08:45:00Z") },
};

const jobs = {
  job001: { title: "Head Chef", description: "Lead the kitchen team, manage inventory, and ensure high-quality meals.", location: "Accra, Ghana", type: "Full-time", experience: "7+ years", postedBy: "user002", status: "open", createdAt: new Date("2025-09-29T11:00:00Z") },
  job002: { title: "Front Office Manager", description: "Manage front office operations, guest services, and staff scheduling.", location: "Lagos, Nigeria", type: "Full-time", experience: "3+ years", postedBy: "user002", status: "open", createdAt: new Date("2025-09-29T13:15:00Z") },
  job003: { title: "Sous Chef", description: "Assist Head Chef, manage kitchen operations, and maintain hygiene standards.", location: "Nairobi, Kenya", type: "Contract", experience: "2+ years", postedBy: "user002", status: "closed", createdAt: new Date("2025-09-30T07:20:00Z") },
};

const applications = {
  app001: { jobId: "job001", applicantId: "user003", coverLetter: "I have over 8 years of experience in African cuisine.", resumeUrl: "https://storage.googleapis.com/jobpitality/resumes/ahmed.pdf", status: "pending", appliedAt: new Date("2025-09-30T10:30:00Z") },
  app002: { jobId: "job002", applicantId: "user003", coverLetter: "Strong front-office background with international hotels.", resumeUrl: "https://storage.googleapis.com/jobpitality/resumes/ahmed.pdf", status: "shortlisted", appliedAt: new Date("2025-09-30T11:00:00Z") },
};

const partners = {
  partner001: { name: "4T Luxury", logoUrl: "https://jobpitality.com/logos/4t.png", website: "https://4tluxury.com", country: "Nigeria", createdAt: new Date("2025-09-20T12:00:00Z") },
  partner002: { name: "Pronto Hospitality", logoUrl: "https://jobpitality.com/logos/pronto.png", website: "https://pronto.com", country: "Ghana", createdAt: new Date("2025-09-21T14:30:00Z") },
};

const adminConfigs = {
  default: { maintenanceMode: false, featuredJobs: ["job001","job002"], featuredPartners: ["partner001"], createdAt: new Date("2025-09-28T08:00:00Z") },
};

// ---- Seeder Function ---- //
async function seedCollection(collectionName, data) {
  const batch = db.batch();
  Object.entries(data).forEach(([key, value]) => {
    const ref = db.collection(collectionName).doc(key);
    batch.set(ref, value);
  });
  await batch.commit();
  console.log(`✅ Seeded ${collectionName}`);
}

async function runSeeder() {
  try {
    console.log("Starting Firestore seeder...");
    await seedCollection("users", users);
    await seedCollection("jobs", jobs);
    await seedCollection("applications", applications);
    await seedCollection("partners", partners);
    await seedCollection("adminConfigs", adminConfigs);
    console.log("🎉 All collections seeded successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding data:", error);
    process.exit(1);
  }
}

runSeeder();