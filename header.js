// header.js - Include this on every page
function updateHeaderForLoggedInUser() {
    const savedUser = localStorage.getItem("jobpitality_user");
    const signInBtn = document.querySelector('.site-header .btn-outline, .nav-cta-emergency');
    
    if (savedUser && signInBtn) {
        try {
            const user = JSON.parse(savedUser);
            const userName = user.firstName || user.name || user.email.split('@')[0];
            
            // Change button to show user name
            signInBtn.innerHTML = `<i class="fas fa-user-circle"></i> ${userName}`;
            signInBtn.href = '/candidates-dashboard/index.html';
            
            // Change style
            signInBtn.classList.remove('btn-outline', 'nav-cta-emergency');
            signInBtn.classList.add('btn-primary');
        } catch(e) {}
    }
}

// Run on every page
document.addEventListener('DOMContentLoaded', updateHeaderForLoggedInUser);