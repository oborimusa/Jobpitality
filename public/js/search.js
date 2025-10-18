
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("searchForm");
  const resultsContainer = document.getElementById("resultsContainer");
  const noResults = document.getElementById("no-results");

  // Example jobs data
  const jobs = [
    { title: "Accountant", location: "Ayekale, Osogbo", company: "4T Luxury Hotel", link: "application-form.html" },
    { title: "Front Desk Officer", location: "Ilorin, Kwara", company: "De Peace Hotel", link: "application-form.html" },
    { title: "Chef", location: "Abuja, Nigeria", company: "Royal Cuisine", link: "application-form.html" },
    { title: "Manager", location: "Lagos, Nigeria", company: "BlueSky Hotels", link: "application-form.html" }
  ];

  // Handle form submit
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const title = document.getElementById("qTitle").value.toLowerCase();
    const location = document.getElementById("qLocation").value.toLowerCase();

    // Filter jobs
    const filteredJobs = jobs.filter(
      (job) =>
        (title === "" || job.title.toLowerCase().includes(title)) &&
        (location === "" || job.location.toLowerCase().includes(location))
    );

    // Clear old results
    resultsContainer.innerHTML = "";
    noResults.classList.add("d-none");

    if (filteredJobs.length > 0) {
      filteredJobs.forEach((job) => {
        resultsContainer.innerHTML += `
          <div class="col-md-4 mb-4">
            <div class="card shadow-sm h-100">
              <div class="card-body">
                <h5 class="job-title">${job.title}</h5>
                <p><strong>Location:</strong> ${job.location}</p>
                <p><strong>Company:</strong> ${job.company}</p>
                <a href="${job.link}" class="btn btn-outline-primary">Apply Now</a>
              </div>
            </div>
          </div>
        `;
      });
    } else {
      noResults.classList.remove("d-none");
    }
  });
});
