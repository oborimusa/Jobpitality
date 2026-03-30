// /js/firebase-init.js

// ========== FIREBASE CONFIGURATION ==========
// REPLACE THESE VALUES with your actual Firebase config
// Get these from: https://console.firebase.google.com > Project Settings > General > Your apps

const firebaseConfig = {
    apiKey: "YOUR_API_KEY_HERE",
    authDomain: "YOUR_AUTH_DOMAIN_HERE",
    projectId: "YOUR_PROJECT_ID_HERE",
    storageBucket: "YOUR_STORAGE_BUCKET_HERE",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID_HERE",
    appId: "YOUR_APP_ID_HERE"
};

// ========== INITIALIZE FIREBASE ==========
// Check if Firebase is already initialized to avoid duplicate errors
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
} else {
    firebase.app(); // use existing app
}

const auth = firebase.auth();
const db = firebase.firestore();

// ========== HELPER FUNCTIONS ==========

// Get current user from localStorage
function getCurrentUser() {
    const savedUser = localStorage.getItem('jobpitality_user');
    if (savedUser) {
        try {
            return JSON.parse(savedUser);
        } catch(e) {
            console.error("Error parsing user:", e);
            return null;
        }
    }
    return null;
}

// Update header UI based on login state
function updateHeaderUI() {
    const user = getCurrentUser();
    
    // Update the main SIGN IN button in header
    const signInBtn = document.querySelector('#signinTrigger, .nav-cta-emergency');
    if (signInBtn && user) {
        const displayName = user.name || user.email?.split('@')[0] || 'User';
        signInBtn.innerHTML = `<i class="fas fa-user-circle"></i> ${displayName}`;
        signInBtn.classList.remove('nav-cta-emergency');
        signInBtn.classList.add('nav-cta');
        
        // Change click behavior to go to dashboard
        const newBtn = signInBtn.cloneNode(true);
        signInBtn.parentNode?.replaceChild(newBtn, signInBtn);
        newBtn.addEventListener('click', (e) => {
            e.preventDefault();
            window.location.href = user.dashboardUrl || '/candidates-dashboard/index.html';
        });
    } else if (signInBtn && !user) {
        // Reset to SIGN IN text
        signInBtn.innerHTML = `<i class="fas fa-sign-in-alt"></i> SIGN IN`;
        signInBtn.classList.add('nav-cta-emergency');
        signInBtn.classList.remove('nav-cta');
        
        // Reset click behavior
        const newBtn = signInBtn.cloneNode(true);
        signInBtn.parentNode?.replaceChild(newBtn, signInBtn);
        newBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const modal = document.getElementById('signinModal');
            if (modal) modal.classList.add('active');
        });
    }
    
    // Update the registration banner SIGN IN button
    const signInCta = document.querySelector('#signinCta');
    if (signInCta && user) {
        signInCta.innerHTML = `<i class="fas fa-user-circle"></i> GO TO DASHBOARD`;
        const newCta = signInCta.cloneNode(true);
        signInCta.parentNode?.replaceChild(newCta, signInCta);
        newCta.addEventListener('click', (e) => {
            e.preventDefault();
            window.location.href = user.dashboardUrl || '/candidates-dashboard/index.html';
        });
    } else if (signInCta && !user) {
        signInCta.innerHTML = `<i class="fas fa-sign-in-alt"></i> SIGN IN`;
        const newCta = signInCta.cloneNode(true);
        signInCta.parentNode?.replaceChild(newCta, signInCta);
        newCta.addEventListener('click', (e) => {
            e.preventDefault();
            const modal = document.getElementById('signinModal');
            if (modal) modal.classList.add('active');
        });
    }
}

// Sign Up function
async function signUpWithEmail(email, password, userData) {
    try {
        // Create user in Firebase Auth
        const userCredential = await auth.createUserWithEmailAndPassword(email, password);
        
        // Update profile with display name
        await userCredential.user.updateProfile({
            displayName: `${userData.firstName} ${userData.lastName}`
        });
        
        // Save user data to Firestore
        await db.collection('users').doc(userCredential.user.uid).set({
            uid: userCredential.user.uid,
            firstName: userData.firstName,
            lastName: userData.lastName,
            email: email,
            phone: userData.phone || '',
            location: userData.location || '',
            userType: 'candidate',
            headline: userData.headline || '',
            bio: userData.bio || '',
            skills: userData.skills || [],
            newsletter: userData.newsletter || false,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        });
        
        // Store in localStorage
        const localUser = {
            id: userCredential.user.uid,
            email: email,
            name: `${userData.firstName} ${userData.lastName}`,
            type: 'candidate',
            dashboardUrl: '/candidates-dashboard/index.html'
        };
        localStorage.setItem('jobpitality_user', JSON.stringify(localUser));
        
        return { success: true, user: localUser };
    } catch (error) {
        console.error("Sign up error:", error);
        return { success: false, message: error.message };
    }
}

// Sign In function
async function signInWithEmail(email, password, userType) {
    try {
        const userCredential = await auth.signInWithEmailAndPassword(email, password);
        
        // Get user data from Firestore
        const userDoc = await db.collection('users').doc(userCredential.user.uid).get();
        
        if (!userDoc.exists) {
            await auth.signOut();
            return { success: false, message: "User data not found" };
        }
        
        const userData = userDoc.data();
        
        // Check if user type matches
        if (userData.userType !== userType) {
            await auth.signOut();
            return { success: false, message: `No ${userType} account found with this email` };
        }
        
        // Store in localStorage
        const localUser = {
            id: userCredential.user.uid,
            email: email,
            name: userData.firstName + ' ' + userData.lastName,
            type: userData.userType,
            dashboardUrl: userData.userType === 'candidate' 
                ? '/candidates-dashboard/index.html' 
                : '/employers-dashboard/index.html'
        };
        localStorage.setItem('jobpitality_user', JSON.stringify(localUser));
        
        updateHeaderUI();
        
        return { success: true, user: localUser };
    } catch (error) {
        console.error("Sign in error:", error);
        return { success: false, message: error.message };
    }
}

// Google Sign In
async function signInWithGoogle() {
    const provider = new firebase.auth.GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });
    
    try {
        const result = await auth.signInWithPopup(provider);
        const user = result.user;
        
        // Check if user exists in Firestore
        const userDoc = await db.collection('users').doc(user.uid).get();
        
        if (!userDoc.exists) {
            // New user - save to Firestore
            await db.collection('users').doc(user.uid).set({
                uid: user.uid,
                firstName: user.displayName?.split(' ')[0] || '',
                lastName: user.displayName?.split(' ')[1] || '',
                email: user.email,
                userType: 'candidate',
                authProvider: 'google',
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            });
        }
        
        const userData = (await db.collection('users').doc(user.uid).get()).data();
        
        const localUser = {
            id: user.uid,
            email: user.email,
            name: user.displayName || user.email.split('@')[0],
            type: userData?.userType || 'candidate',
            dashboardUrl: '/candidates-dashboard/index.html'
        };
        localStorage.setItem('jobpitality_user', JSON.stringify(localUser));
        
        window.location.href = localUser.dashboardUrl;
    } catch (error) {
        console.error("Google sign in error:", error);
        showNotification(error.message, 'error');
    }
}

// Sign Out function
function signOut() {
    auth.signOut().then(() => {
        localStorage.removeItem('jobpitality_user');
        updateHeaderUI();
        window.location.href = '/';
    }).catch((error) => {
        console.error('Sign out error:', error);
        showNotification(error.message, 'error');
    });
}

// Require authentication (redirect if not logged in)
function requireAuth(redirectUrl = '/') {
    const user = getCurrentUser();
    if (!user) {
        window.location.href = redirectUrl;
        return false;
    }
    return true;
}

// Require employer authentication
function requireEmployer() {
    const user = getCurrentUser();
    if (!user) {
        window.location.href = '/';
        return false;
    }
    if (user.type !== 'employer') {
        window.location.href = '/candidates-dashboard/index.html';
        return false;
    }
    return true;
}

// Require candidate authentication
function requireCandidate() {
    const user = getCurrentUser();
    if (!user) {
        window.location.href = '/';
        return false;
    }
    if (user.type !== 'candidate') {
        window.location.href = '/employers-dashboard/index.html';
        return false;
    }
    return true;
}

// Show notification
function showNotification(message, type = 'info') {
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) existingNotification.remove();
    
    const notification = document.createElement('div');
    notification.className = 'notification';
    const icon = type === 'success' ? 'check-circle' : (type === 'error' ? 'exclamation-circle' : 'info-circle');
    notification.style.borderLeftColor = type === 'error' ? '#e63946' : '#ff9e00';
    notification.innerHTML = `
        <div style="display: flex; align-items: center; gap: 0.75rem;">
            <i class="fas fa-${icon}" style="color: #ff9e00;"></i>
            <span>${message}</span>
        </div>
    `;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out forwards';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// ========== LISTEN TO AUTH STATE CHANGES ==========
auth.onAuthStateChanged(async (firebaseUser) => {
    if (firebaseUser) {
        // User is signed in
        try {
            const userDoc = await db.collection('users').doc(firebaseUser.uid).get();
            if (userDoc.exists) {
                const userData = userDoc.data();
                const localUser = {
                    id: firebaseUser.uid,
                    email: firebaseUser.email,
                    name: userData.firstName + ' ' + userData.lastName,
                    type: userData.userType,
                    dashboardUrl: userData.userType === 'candidate' 
                        ? '/candidates-dashboard/index.html' 
                        : '/employers-dashboard/index.html'
                };
                localStorage.setItem('jobpitality_user', JSON.stringify(localUser));
            }
        } catch (error) {
            console.error("Error fetching user data:", error);
        }
    } else {
        // User is signed out
        localStorage.removeItem('jobpitality_user');
    }
    updateHeaderUI();
});

// ========== EXPOSE FUNCTIONS GLOBALLY ==========
window.getCurrentUser = getCurrentUser;
window.updateHeaderUI = updateHeaderUI;
window.signUpWithEmail = signUpWithEmail;
window.signInWithEmail = signInWithEmail;
window.signInWithGoogle = signInWithGoogle;
window.signOut = signOut;
window.requireAuth = requireAuth;
window.requireEmployer = requireEmployer;
window.requireCandidate = requireCandidate;
window.showNotification = showNotification;
