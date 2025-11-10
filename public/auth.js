// auth.js - Simple authentication system
class AuthSystem {
    constructor() {
        this.currentUser = null;
        this.users = JSON.parse(localStorage.getItem('jobpitalityUsers')) || [];
        this.enrollments = JSON.parse(localStorage.getItem('jobpitalityEnrollments')) || [];
        
        // Initialize with a demo user if none exists
        if (this.users.length === 0) {
            this.initializeDemoUser();
        }
        
        this.loadCurrentUser();
    }

    initializeDemoUser() {
        const demoUser = {
            id: this.generateId(),
            email: "demo@jobpitality.com",
            password: "demo123",
            name: "Demo User",
            joinedAt: new Date().toISOString()
        };
        this.users.push(demoUser);
        this.saveData();
        console.log('Demo user created:', demoUser);
    }

    loadCurrentUser() {
        const savedUser = localStorage.getItem('jobpitalityCurrentUser');
        if (savedUser) {
            try {
                this.currentUser = JSON.parse(savedUser);
                this.updateUIForLoggedInUser();
            } catch (e) {
                console.error('Error loading user:', e);
                this.currentUser = null;
            }
        }
    }

    register(email, password, name) {
        console.log('Register attempt:', { email, name });
        
        // Basic validation
        if (!email || !password || !name) {
            return { success: false, message: 'All fields are required' };
        }

        // Check if user already exists
        if (this.users.find(user => user.email === email)) {
            return { success: false, message: 'User already exists with this email' };
        }

        const newUser = {
            id: this.generateId(),
            email: email.trim(),
            password: password, // In real app, hash this!
            name: name.trim(),
            joinedAt: new Date().toISOString()
        };

        this.users.push(newUser);
        this.currentUser = newUser;
        localStorage.setItem('jobpitalityCurrentUser', JSON.stringify(newUser));
        this.saveData();
        this.updateUIForLoggedInUser();

        console.log('Registration successful:', newUser);
        return { success: true, user: newUser };
    }

    login(email, password) {
        console.log('Login attempt:', { email });
        
        // Basic validation
        if (!email || !password) {
            return { success: false, message: 'Email and password are required' };
        }

        const user = this.users.find(u => 
            u.email.toLowerCase() === email.toLowerCase().trim() && 
            u.password === password
        );
        
        if (user) {
            this.currentUser = user;
            localStorage.setItem('jobpitalityCurrentUser', JSON.stringify(user));
            this.updateUIForLoggedInUser();
            console.log('Login successful:', user);
            return { success: true, user };
        }
        
        console.log('Login failed - user not found or wrong password');
        return { success: false, message: 'Invalid email or password' };
    }

    logout() {
        this.currentUser = null;
        localStorage.removeItem('jobpitalityCurrentUser');
        this.updateUIForLoggedOutUser();
        window.location.reload();
    }

    enrollUser(courseId) {
        if (!this.currentUser) {
            console.log('Cannot enroll - no user logged in');
            return false;
        }

        // Check if already enrolled
        if (this.getUserEnrollments().some(e => e.courseId === courseId)) {
            console.log('User already enrolled in course:', courseId);
            return false;
        }

        const enrollment = {
            id: this.generateId(),
            userId: this.currentUser.id,
            courseId: courseId,
            enrolledAt: new Date().toISOString(),
            progress: 0,
            lastAccessed: new Date().toISOString(),
            completed: false
        };

        this.enrollments.push(enrollment);
        this.saveData();
        console.log('Enrollment successful:', enrollment);
        return true;
    }

    getUserEnrollments() {
        if (!this.currentUser) return [];
        return this.enrollments.filter(e => e.userId === this.currentUser.id);
    }

    getAllEnrollments() {
        return this.enrollments;
    }

    getEnrolledUsers(courseId) {
        const courseEnrollments = this.enrollments.filter(e => e.courseId === courseId);
        return courseEnrollments.map(enrollment => {
            const user = this.users.find(u => u.id === enrollment.userId);
            return {
                ...enrollment,
                user: user ? { name: user.name, email: user.email } : null
            };
        });
    }

    updateProgress(courseId, progress) {
        if (!this.currentUser) return false;

        const enrollment = this.enrollments.find(
            e => e.userId === this.currentUser.id && e.courseId === courseId
        );

        if (enrollment) {
            enrollment.progress = Math.min(100, Math.max(0, progress));
            enrollment.lastAccessed = new Date().toISOString();
            if (enrollment.progress >= 100) enrollment.completed = true;
            this.saveData();
            return true;
        }
        return false;
    }

    updateUIForLoggedInUser() {
        const nav = document.querySelector('.navbar-nav');
        const authButtons = document.getElementById('authButtons');
        
        if (nav && this.currentUser && authButtons) {
            // Hide auth buttons
            authButtons.style.display = 'none';
            
            // Add user dropdown
            const userHtml = `
                <li class="nav-item dropdown">
                    <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown">
                        <i class="fas fa-user me-1"></i>${this.currentUser.name}
                    </a>
                    <ul class="dropdown-menu">
                        <li><a class="dropdown-item" href="profile.html">My Profile</a></li>
                        <li><a class="dropdown-item" href="mylearning.html">My Learning</a></li>
                        <li><hr class="dropdown-divider"></li>
                        <li><a class="dropdown-item" href="#" onclick="auth.logout()">Logout</a></li>
                    </ul>
                </li>
            `;
            
            // Remove existing user dropdown if any
            const existingDropdown = nav.querySelector('.nav-item.dropdown');
            if (existingDropdown) existingDropdown.remove();
            
            // Add new user dropdown
            nav.insertAdjacentHTML('beforeend', userHtml);
        }
    }

    updateUIForLoggedOutUser() {
        const nav = document.querySelector('.navbar-nav');
        const authButtons = document.getElementById('authButtons');
        const dropdown = nav.querySelector('.nav-item.dropdown');
        
        if (dropdown) dropdown.remove();
        if (authButtons) authButtons.style.display = 'block';
    }

    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    saveData() {
        localStorage.setItem('jobpitalityUsers', JSON.stringify(this.users));
        localStorage.setItem('jobpitalityEnrollments', JSON.stringify(this.enrollments));
        if (this.currentUser) {
            localStorage.setItem('jobpitalityCurrentUser', JSON.stringify(this.currentUser));
        }
    }

    // Debug method to see current state
    debug() {
        console.log('Users:', this.users);
        console.log('Enrollments:', this.enrollments);
        console.log('Current User:', this.currentUser);
    }
}

const auth = new AuthSystem();

// Add debug method to window for testing
window.debugAuth = () => auth.debug();