document.addEventListener("DOMContentLoaded", () => {
  const positionInput = document.getElementById("positionInput");
  const categorySelect = document.getElementById("categorySelect");
  const locationSelect = document.getElementById("locationSelect");
  const searchBtn = document.getElementById("searchBtn");
  const resultsContainer = document.getElementById("results");

  let jobs = [];

  // Load jobs from CSV
  fetch("jobs.csv")
    .then(response => response.text())
    .then(data => {
      jobs = parseCSV(data);
      displayResults(jobs); // show all jobs initially
    })
    .catch(err => {
      console.error("Error loading CSV:", err);
    });

  // Simple CSV parser
  function parseCSV(str) {
    const lines = str.trim().split("\n");
    const headers = lines[0].split(",");
    return lines.slice(1).map(line => {
      const values = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/); // handles commas in quotes
      let obj = {};
      headers.forEach((h, i) => {
        obj[h.trim()] = values[i] ? values[i].replace(/"/g, "").trim() : "";
      });
      return obj;
    });
  }

  // Search logic
  function searchJobs() {
    const position = positionInput.value.toLowerCase();
    const category = categorySelect.value.toLowerCase();
    const location = locationSelect.value.toLowerCase();

    const filtered = jobs.filter(job => {
      const matchesPosition = position === "" || job.title.toLowerCase().includes(position);
      const matchesCategory = category === "" || job.title.toLowerCase().includes(category);
      const matchesLocation = location === "" || job.location.toLowerCase() === location;
      return matchesPosition && matchesCategory && matchesLocation;
    });

    displayResults(filtered);
  }

  // Render jobs
  function displayResults(list) {
    if (list.length === 0) {
      resultsContainer.innerHTML = `<p class="text-muted">No jobs found.</p>`;
      return;
    }

    resultsContainer.innerHTML = list
      .map(job => `
        <div class="card mb-3 shadow-sm">
          <div class="card-body">
            <h5 class="card-title">${job.title}</h5>
            <p class="card-text">
              <strong>Company:</strong> ${job.company}<br>
              <strong>Location:</strong> ${job.location}<br>
              <strong>Salary:</strong> ${job.salary}
            </p>
            <a href="${job.link}" class="btn btn-sm btn-primary">Apply</a>
          </div>
        </div>
      `)
      .join("");
  }

  // Hook up button
  searchBtn.addEventListener("click", searchJobs);
});