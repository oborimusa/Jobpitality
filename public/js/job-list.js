// job-list.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-app.js";
import { getFirestore, collection, getDocs, query, orderBy } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-firestore.js";

// ✅ Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyBxeiG78oHv8wSLGRK_GAAD_mqvZKJtu30",
  authDomain: "jobpitality-1cfb2.firebaseapp.com",
  projectId: "jobpitality-1cfb2",
  storageBucket: "jobpitality-1cfb2.appspot.com",
  messagingSenderId: "185191165097",
  appId: "1:185191165097:web:e0aeab622e8d89ef9a8db8",
  measurementId: "G-SF5LWDZDKF",
};

// ✅ Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// ✅ Global variable to store loaded jobs
let allJobs = [];

// ✅ Fetch Jobs from Firestore
async function loadJobs() {
  const container = document.getElementById("jobContainer");
  if (!container) {
    console.error("❌ jobContainer element not found.");
    return;
  }

  container.innerHTML = `<p class="text-center text-muted my-5">Loading jobs...</p>`;

  try {
    const q = query(collection(db, "jobs"), orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      container.innerHTML = `<p class="text-center text-muted my-5">No job postings found.</p>`;
      return;
    }

    allJobs = snapshot.docs.map((doc) => doc.data());
    renderJobs(allJobs);
  } catch (err) {
    console.error("Error loading jobs:", err);
    const message =
      err.code === "permission-denied"
        ? "⚠️ Missing Firestore permissions. Please check your Firebase rules."
        : "❌ Failed to load jobs. Please try again later.";
    container.innerHTML = `<p class="text-danger text-center my-5">${message}</p>`;
  }
}

// ✅ Render Jobs
function renderJobs(jobs) {
  const container = document.getElementById("jobContainer");
  container.innerHTML = "";

  if (!jobs.length) {
    container.innerHTML = `<p class="text-center text-muted my-5">No matching jobs found.</p>`;
    return;
  }

  jobs.forEach((job) => {
    const jobCard = `
      <div class="col-12 col-md-6 col-lg-4">
        <div class="card job-card h-100 shadow-sm border-0">
          <div class="card-body d-flex flex-column">
            <h5 class="card-title fw-semibold mb-2">${job.title || "Untitled Job"}</h5>
            <p class="card-text mb-1"><strong>Location:</strong> ${job.location || "Not specified"}</p>
            ${job.type ? `<p class="card-text mb-1"><strong>Type:</strong> ${job.type}</p>` : ""}
            ${job.salary ? `<p class="card-text mb-1"><strong>Salary:</strong> ${job.salary}</p>` : ""}
            <p class="card-text mt-2"><strong>Description:</strong> ${job.description || "No description provided."}</p>
            ${job.requirements ? `<p class="card-text"><strong>Requirements:</strong> ${job.requirements}</p>` : ""}
            <div class="mt-auto">
              <button class="btn btn-primary w-100 mt-3">Apply Now</button>
            </div>
          </div>
        </div>
      </div>
    `;
    container.innerHTML += jobCard;
  });
}

// ✅ Search + Filter
function setupFilters() {
  const searchForm = document.getElementById("searchForm");
  if (!searchForm) return;

  searchForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const titleInput = document.getElementById("searchTitle")?.value.trim().toLowerCase() || "";
    const locationInput = document.getElementById("searchLocation")?.value.trim().toLowerCase() || "";

    const filteredJobs = allJobs.filter((job) => {
      const titleMatch = !titleInput || (job.title && job.title.toLowerCase().includes(titleInput));
      const locationMatch = !locationInput || (job.location && job.location.toLowerCase().includes(locationInput));
      return titleMatch && locationMatch;
    });

    renderJobs(filteredJobs);
  });
}

// ✅ Initialize
document.addEventListener("DOMContentLoaded", () => {
  loadJobs();
  setupFilters();
});