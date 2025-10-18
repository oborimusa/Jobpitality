
  // ===== Sample Course Data =====
  const allCourses = [
    {
      id: 'c1',
      title: 'Front Office Essentials',
      category: 'Front Office',
      level: 'Beginner',
      duration: '3 weeks',
      description: 'Reception, guest check-in, phone etiquette.',
      image: 'img/front-office-hero.jpg'    // ✅ correct image path
    },
    {
      id: 'c2',
      title: 'Kitchen Hygiene & Safety',
      category: 'Kitchen',
      level: 'Beginner',
      duration: '2 weeks',
      description: 'Food safety, HACCP basics, cleaning routines.',
      image: 'img/kitchen-hero.jpg'
    },
    {
      id: 'c3',
      title: 'Advanced Culinary Techniques',
      category: 'Food & Beverage',
      level: 'Advanced',
      duration: '8 weeks',
      description: 'Modern plating, sauces, large-batch prep.',
      image: 'img/culinary-hero.jpg'
    },
    // …add the rest
  ];

  // Pretend user enrolments
  let enrolled = [
    { courseId: 'c1', progress: 45, enrolledAt: '2025-09-01' },
    { courseId: 'c5', progress: 12, enrolledAt: '2025-09-12' }
  ];

  // State / Elements
  let shownCourses = 3;
  const coursesGrid        = document.getElementById('coursesGrid');
  const shownCountEl       = document.getElementById('shownCount');
  const enrolledCountEl    = document.getElementById('enrolledCount');
  const overallProgressBar = document.getElementById('overallProgressBar');

  // Helper to find a course
  function findCourse(id) {
    return allCourses.find(c => c.id === id);
  }

  // Helper to check enrolment
  function isEnrolled(id) {
    return enrolled.some(e => e.courseId === id);
  }

  // Escape HTML
  function escapeHtml(str) {
    return str.replace(/[&<>"']/g, m => (
      { '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[m]
    ));
  }

  // ===== Render Courses =====
  function renderCourses(filterFn) {
    coursesGrid.innerHTML = '';
    const list = (filterFn ? allCourses.filter(filterFn) : allCourses)
                  .slice(0, shownCourses);

    shownCountEl.textContent = list.length;

    if (!list.length) {
      coursesGrid.innerHTML =
        '<div class="col-12"><p class="text-muted">No courses match your filters.</p></div>';
      return;
    }

    list.forEach(course => {
      const card = document.createElement('div');
      card.className = 'col-12 col-sm-6 col-md-4';
      card.innerHTML = `
        <div class="card h-100 shadow-sm">
          <img src="${escapeHtml(course.image || 'img/default-course.jpg')}"
               class="card-img-top"
               alt="${escapeHtml(course.title)}"
               style="height:160px; object-fit:cover;">
          <div class="card-body d-flex flex-column">
            <small class="text-muted">
              ${escapeHtml(course.category)} · ${escapeHtml(course.level)}
            </small>
            <h5 class="card-title mt-2">${escapeHtml(course.title)}</h5>
            <p class="card-text text-muted small mb-3">
              ${escapeHtml(course.description)}
            </p>
            <div class="mt-auto d-flex gap-2">
              <button class="btn btn-outline-secondary flex-fill btn-sm"
                      data-id="${course.id}" data-action="details">
                Details
              </button>
              <button class="btn btn-primary flex-fill btn-sm"
                      data-id="${course.id}" data-action="enroll">
                ${isEnrolled(course.id) ? 'Continue' : 'Enroll'}
              </button>
            </div>
          </div>
          <div class="card-footer text-muted small d-flex justify-content-between align-items-center">
            <span>${escapeHtml(course.duration)}</span>
            <span class="badge bg-info text-dark">${escapeHtml(course.level)}</span>
          </div>
        </div>
      `;
      coursesGrid.appendChild(card);
    });
  }

  // ===== Initial Render =====
  document.addEventListener('DOMContentLoaded', () => {
    renderCourses();
  });
