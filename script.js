fetch('seekers.json')
  .then(response => response.json())
  .then(data => {
    const container = document.getElementById('applicant-list');
    data.forEach(seeker => {
      const col = document.createElement('div');
      col.className = 'col-md-4 mb-4';

      col.innerHTML = `
        <div class="card h-100 shadow-sm">
          <div class="card-body">
            <h5 class="card-title">${seeker.name}</h5>
            <h6 class="card-subtitle mb-2 text-muted">${seeker.position}</h6>
            <p class="mb-1"><strong>Experience:</strong> ${seeker.experience}</p>
            <p class="mb-1"><strong>Location:</strong> ${seeker.location}</p>
            <p class="mb-1"><strong>Skills:</strong> ${seeker.skills.join(', ')}</p>
          </div>
        </div>
      `;
      container.appendChild(col);
    });
  })
  .catch(error => {
    document.getElementById('applicant-list').innerHTML = '<p class="text-danger">Unable to load applicants.</p>';
    console.error('Error fetching applicants:', error);
  });
