// Wait for the document to be fully loaded before executing
document.addEventListener('DOMContentLoaded', function() {
    // Get reference to the search button
    const searchButton = document.querySelector('.btn.btn-dark.border-0.w-100');
    
    // Get references to form inputs
    const keywordInput = document.querySelector('.col-md-4 input[type="text"]');
    const categorySelect = document.querySelector('.col-md-4:nth-child(2) select');
    const locationSelect = document.querySelector('.col-md-4:nth-child(3) select');
    
    // Create a container for search results if it doesn't exist yet
    let resultsContainer = document.getElementById('search-results');
    if (!resultsContainer) {
        resultsContainer = document.createElement('div');
        resultsContainer.id = 'search-results';
        
        // Add the results container after the search form
        const searchForm = document.querySelector('.container-fluid.bg-primary');
        searchForm.parentNode.insertBefore(resultsContainer, searchForm.nextSibling);
    }
    
    // Add event listener to the search button
    searchButton.addEventListener('click', function() {
        performSearch();
    });
    
    // Function to handle the search
    function performSearch() {
        // Get values from inputs
        const keyword = keywordInput.value.trim();
        const category = categorySelect.options[categorySelect.selectedIndex].text;
        const location = locationSelect.options[locationSelect.selectedIndex].text;
        
        // Check if keyword is provided
        if (keyword === '') {
            displayMessage('Please enter a keyword or position to search', 'warning');
            return;
        }
        
        // Show loading indicator
        resultsContainer.innerHTML = '<div class="container mt-4"><div class="alert alert-info">Searching...</div></div>';
        
        // Simulate server delay (in a real application, this would be an API call)
        setTimeout(function() {
            // Generate search results based on parameters
            const results = generateResults(keyword, category, location);
            
            // Display the results
            displayResults(results);
        }, 800);
    }
    
    // Function to generate mock search results
    function generateResults(keyword, category, location) {
        // Mock database of jobs
        const allJobs = [
            {
                title: 'Chef',
                category: 'Back-of-House Staff',
                location: 'Ilorin',
                description: 'Experienced chef needed for a luxurious hotel',
                requirements: '3+ years experience, culinary degree preferred',
                salary: '₦100,000 - ₦150,000 monthly'
            },

            {
                title: 'Chef (with administrative skills)',
                category: 'Back-of-House Staff',
                location: 'Ilorin',
                description: 'Experienced chef needed for high-volume restaurant',
                requirements: '3+ years experience, culinary degree preferred',
                salary: '₦150,000 - ₦200,000 monthly'
            },

            {
                title: 'Waitress',
                category: 'Front-of-House Staff',
                location: 'Ilorin',
                description: 'Experienced waitress needed for high-volume restaurant',
                requirements: '1+ years experience, excellent customer service skills',
                salary: '₦50,000 - ₦55,000 monthly'
            },

            {
                title: 'Kitchen Assistant',
                category: 'Back-of-House Staff',
                location: 'Basin, Ilorin',
                description: 'Kitchen assistant needed for high-volume restaurant',
                requirements: 'Must be willing to work from 1:00pm to 11:00pm the last customer closes.',
                salary: '₦45,000 monthly'
            },

            {
                title: 'Sous Chef',
                category: 'Back-of-House Staff',
                location: 'Abuja',
                description: 'Support head chef in daily kitchen operations',
                requirements: '2+ years experience in professional kitchen',
                salary: '₦200,000 - ₦250,000 monthly'
            },
            {
                title: 'Line Cook',
                category: 'Back-of-House Staff',
                location: 'Ilorin',
                description: 'Prepare food items according to recipes',
                requirements: '1+ year cooking experience',
                salary: '₦150,000 - ₦180,000 monthly'
            },
            {
                title: 'Restaurant Manager',
                category: 'Management and Administrative Staff',
                location: 'Ilorin',
                description: 'Oversee all restaurant operations and staff',
                requirements: '5+ years in restaurant management',
                salary: '₦100,000 - ₦150,000 monthly'
            },
            {
                title: 'Marketing Coordinator',
                category: 'Sales and Marketing Staff',
                location: 'Osogbo',
                description: 'Develop and implement marketing strategies',
                requirements: 'Degree in Marketing or related field',
                salary: '₦80,000 - ₦100,000 monthly'
            },
            {
                title: 'Maintenance Technician',
                category: 'Maintenance and Technical Staff',
                location: 'Ekiti',
                description: 'Handle equipment repairs and maintenance',
                requirements: 'Technical certification and 2+ years experience',
                salary: '₦80,000 - ₦90,000 monthly'
            },
            {
                title: 'Security Officer',
                category: 'Security and Safety Staff',
                location: 'Ilorin',
                description: 'Ensure safety of premises and personnel',
                requirements: 'Security training and valid certification',
                salary: '₦60,000 - ₦80,000 monthly'
            },
            {
                title: 'Event Staff',
                category: 'Ad-hoc Staff',
                location: 'Abuja',
                description: 'Support special events and functions',
                requirements: 'Flexible schedule, customer service skills',
                salary: '₦5,000 - ₦8,000 per day'
            },

              {
                title: 'Accountant',
                category: 'Management and Administrative Staff',
                location: 'Ibadan',
                description: 'Minimum of one year experience in any F&B, restaurant or supermarket company.',
                requirements: 'Experience in Microsoft Excel and other Microsoft office',
                salary: '₦60,000 - ₦90,000 per day'
            },

            {
                title: 'Store officer',
                category: 'Management and Administrative Staff',
                location: 'Ibadan',
                description: 'Minimum of 1 year experience in F&B, supermarket, hotels or restaurant company..',
                requirements: 'Excellent Microsoft office usage,',
                salary: '₦60,000 - ₦70,000 per day'
            }
        ];
        
        // Filter results
        return allJobs.filter(job => {
            // Match keyword in title or description (case insensitive)
            const keywordMatch = keyword === '' || 
                               job.title.toLowerCase().includes(keyword.toLowerCase()) || 
                               job.description.toLowerCase().includes(keyword.toLowerCase());
            
            // Match category if not the default value
            const categoryMatch = job.category === category;
            
            // Match location if not the default value
            const locationMatch = job.location === location;
            
            // Item matches if all conditions are true
            return keywordMatch && categoryMatch && locationMatch;
        });
    }
    
    function displayResults(results) {
        if (results.length === 0) {
            displayMessage('No matching positions found. Please try different search criteria.', 'info');
            return;
        }
        
        // Create results HTML
        let resultsHTML = `
            <div class="container mt-4">
                <div id="status-message"></div>
                <h3 class="mb-4">Found ${results.length} Position${results.length > 1 ? 's' : ''}</h3>
                <div class="row g-4">
        `;
        
        // Add each job to the results
        results.forEach(job => {
            resultsHTML += `
                <div class="col-lg-4 col-md-6 wow fadeInUp" data-wow-delay="0.1s">
                    <div class="card border-0 shadow-sm mb-4">
                        <div class="card-body p-4">
                            <div class="mb-3">
                                <span class="badge bg-primary mb-2">${job.category}</span>
                                <span class="badge bg-secondary mb-2">${job.location}</span>
                            </div>
                            <h5 class="card-title mb-3">${job.title}</h5>
                            <p class="card-text mb-2">${job.description}</p>
                            <p class="small text-muted mb-2"><strong>Requirements:</strong> ${job.requirements}</p>
                            <p class="text-primary fw-bold mb-3">${job.salary}</p>
                            <!-- Link "Apply Now" to application-form.html -->
                            <a href="application-form.html" class="btn btn-primary">Apply Now</a>
                        </div>
                    </div>
                </div>
            `;
        });
        
        resultsHTML += `
                </div>
            </div>
        `;
        
        // Display results
        resultsContainer.innerHTML = resultsHTML;
        
        // Scroll to results
        resultsContainer.scrollIntoView({ behavior: 'smooth' });
        
        // Show success message at the top without replacing the content
        const statusMessage = document.getElementById('status-message');
        if (statusMessage) {
            statusMessage.innerHTML = `<div class="alert alert-success">${results.length} position${results.length > 1 ? 's' : ''} found.</div>`;
            
            // Make success message disappear after 5 seconds without removing other content
            setTimeout(() => {
                const alertElement = statusMessage.querySelector('.alert');
                if (alertElement) {
                    alertElement.style.transition = 'opacity 1s';
                    alertElement.style.opacity = '0';
                    setTimeout(() => {
                        if (statusMessage.contains(alertElement)) {
                            statusMessage.innerHTML = '';
                        }
                    }, 1000);
                }
            }, 5000);
        }
    }
});