// /js/firebase-init.js

// ========== FIREBASE CONFIGURATION ==========
// REPLACE THESE VALUES with your actual Firebase config
// Get these from: https://console.firebase.google.com > Project Settings > General > Your apps

// /js/firebase-init.js

// Check if Firebase is loaded
if (typeof firebase === 'undefined') {
    console.error('Firebase SDK not loaded! Check script order.');
    alert('Firebase SDK not loaded. Please check script order.');
}

// Wait for Firebase to be ready
document.addEventListener('DOMContentLoaded', function() {
    if (typeof firebase !== 'undefined' && !firebase.apps.length) {
        // Your Firebase config here
       const firebaseConfig = {
  apiKey: "AIzaSyBxeiG78oHv8wSLGRK_GAAD_mqvZKJtu30",
  authDomain: "jobpitality-1cfb2.firebaseapp.com",
  projectId: "jobpitality-1cfb2",
  storageBucket: "jobpitality-1cfb2.firebasestorage.app",
  messagingSenderId: "185191165097",
  appId: "1:185191165097:web:e0aeab622e8d89ef9a8db8",
  measurementId: "G-SF5LWDZDKF"
};
        
        firebase.initializeApp(firebaseConfig);
        console.log('Firebase initialized successfully!');
    }
});
// /js/firebase-init.js

// ========== YOUR FIREBASE CONFIGURATION ==========
// REPLACE WITH YOUR ACTUAL FIREBASE CONFIG
const firebaseConfig = {
  apiKey: "AIzaSyBxeiG78oHv8wSLGRK_GAAD_mqvZKJtu30",
  authDomain: "jobpitality-1cfb2.firebaseapp.com",
  projectId: "jobpitality-1cfb2",
  storageBucket: "jobpitality-1cfb2.firebasestorage.app",
  messagingSenderId: "185191165097",
  appId: "1:185191165097:web:e0aeab622e8d89ef9a8db8",
  measurementId: "G-SF5LWDZDKF"
};

// /js/firebase-init.js

// ========== YOUR FIREBASE CONFIGURATION ==========
// REPLACE THESE VALUES with your actual Firebase project config
// Get these from: https://console.firebase.google.com/ → Project Settings → Your apps
const FIREBASE_CONFIG = {
    apiKey: "AIzaSyBxeiG78oHv8wSLGRK_GAAD_mqvZKJtu30",  // Replace with your actual API Key
    authDomain: "jobpitality.firebaseapp.com",          // Replace with your actual authDomain
    projectId: "jobpitality",                           // Replace with your actual project ID
    storageBucket: "jobpitality.firebasestorage.app",   // Replace with your actual storageBucket
    messagingSenderId: "123456789012",                  // Replace with your actual messagingSenderId
    appId: "1:123456789012:web:abcdef1234567890"       // Replace with your actual appId
};

// ========== FIREBASE INITIALIZATION ==========
let firebaseInitialized = false;

function initializeFirebase() {
    // Check if Firebase SDK is loaded
    if (typeof firebase === 'undefined') {
        console.log('Waiting for Firebase SDK to load...');
        setTimeout(initializeFirebase, 500);
        return;
    }
    
    // Prevent double initialization
    if (firebaseInitialized) {
        console.log('Firebase already initialized, skipping...');
        setupFirebase();
        return;
    }
    
    // Check if already initialized by another script
    if (firebase.apps.length > 0) {
        console.log('Firebase already initialized by another script');
        firebaseInitialized = true;
        setupFirebase();
        return;
    }
    
    try {
        // Use FIREBASE_CONFIG variable (defined above)
        firebase.initializeApp(FIREBASE_CONFIG);
        firebaseInitialized = true;
        console.log('Firebase initialized successfully!');
        setupFirebase();
    } catch (error) {
        console.error('Firebase initialization error:', error);
    }
}

// ========== SETUP FIREBASE ==========
let auth = null;
let db = null;

function setupFirebase() {
    auth = firebase.auth();
    db = firebase.firestore();
    
    // Enable offline persistence
    db.enablePersistence().catch((err) => {
        if (err.code === 'failed-precondition') {
            console.warn('Multiple tabs open, persistence can only be enabled in one tab at a time.');
        } else if (err.code === 'unimplemented') {
            console.warn('The current browser does not support offline persistence.');
        }
    });
    
    // Auth state listener
    auth.onAuthStateChanged(async (firebaseUser) => {
        if (firebaseUser) {
            try {
                const userDoc = await db.collection('users').doc(firebaseUser.uid).get();
                if (userDoc.exists) {
                    const userData = userDoc.data();
                    const localUser = {
                        id: firebaseUser.uid,
                        email: firebaseUser.email,
                        name: `${userData.firstName || ''} ${userData.lastName || ''}`.trim() || firebaseUser.email.split('@')[0],
                        type: userData.userType || 'candidate',
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
            localStorage.removeItem('jobpitality_user');
        }
        updateHeaderUI();
    });
}

// ========== SIGN UP WITH EMAIL ==========
async function signUpWithEmail(email, password, userData) {
    if (!auth) {
        return { success: false, message: "Firebase not ready. Please refresh the page." };
    }
    
    try {
        const userCredential = await auth.createUserWithEmailAndPassword(email, password);
        
        await userCredential.user.updateProfile({
            displayName: `${userData.firstName} ${userData.lastName}`
        });
        
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
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });
        
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
        console.error('Sign up error:', error);
        let message = error.message;
        if (error.code === 'auth/email-already-in-use') {
            message = "Email already registered. Please sign in instead.";
        } else if (error.code === 'auth/weak-password') {
            message = "Password should be at least 6 characters.";
        }
        return { success: false, message: message };
    }
}

// ========== SIGN IN WITH EMAIL ==========
async function signInWithEmail(email, password, userType) {
    if (!auth) {
        return { success: false, message: "Firebase not ready. Please refresh the page." };
    }
    
    try {
        if (!navigator.onLine) {
            return { success: false, message: "No internet connection. Please check your network." };
        }
        
        const userCredential = await auth.signInWithEmailAndPassword(email, password);
        
        const userDoc = await db.collection('users').doc(userCredential.user.uid).get();
        
        if (!userDoc.exists) {
            await auth.signOut();
            return { success: false, message: "User data not found. Please register first." };
        }
        
        const userData = userDoc.data();
        
        if (userData.userType !== userType) {
            await auth.signOut();
            return { success: false, message: `No ${userType} account found with this email.` };
        }
        
        const localUser = {
            id: userCredential.user.uid,
            email: email,
            name: `${userData.firstName} ${userData.lastName}`,
            type: userData.userType,
            dashboardUrl: userData.userType === 'candidate' 
                ? '/candidates-dashboard/index.html' 
                : '/employers-dashboard/index.html'
        };
        localStorage.setItem('jobpitality_user', JSON.stringify(localUser));
        
        return { success: true, user: localUser };
    } catch (error) {
        console.error("Sign in error:", error);
        
        let message = "Invalid credentials";
        if (error.code === 'auth/user-not-found') {
            message = "No account found with this email. Please register first.";
        } else if (error.code === 'auth/wrong-password') {
            message = "Incorrect password. Please try again.";
        } else if (error.code === 'auth/invalid-email') {
            message = "Please enter a valid email address.";
        } else if (error.code === 'auth/network-request-failed') {
            message = "Network error. Please check your internet connection.";
        }
        
        return { success: false, message: message };
    }
}

// ========== GOOGLE SIGN IN ==========
async function signInWithGoogle() {
    if (!auth) {
        showNotification("Firebase not ready. Please refresh the page.", "error");
        return;
    }
    
    const provider = new firebase.auth.GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });
    
    try {
        const result = await auth.signInWithPopup(provider);
        const user = result.user;
        
        const userDoc = await db.collection('users').doc(user.uid).get();
        
        if (!userDoc.exists) {
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
        console.error('Google sign in error:', error);
        showNotification(error.message, 'error');
    }
}

// ========== SIGN OUT ==========
function signOut() {
    if (!auth) return;
    
    auth.signOut().then(() => {
        localStorage.removeItem('jobpitality_user');
        window.location.href = '/';
    }).catch((error) => {
        console.error('Sign out error:', error);
    });
}

// ========== GET CURRENT USER ==========
function getCurrentUser() {
    const savedUser = localStorage.getItem('jobpitality_user');
    if (savedUser) {
        try {
            return JSON.parse(savedUser);
        } catch(e) {
            return null;
        }
    }
    return null;
}

// ========== UPDATE HEADER UI ==========
function updateHeaderUI() {
    const user = getCurrentUser();
    const signInBtn = document.querySelector('#signinTrigger, .nav-cta-emergency');
    
    if (user && signInBtn) {
        const displayName = user.name || user.email?.split('@')[0] || 'User';
        signInBtn.innerHTML = `<i class="fas fa-user-circle"></i> ${displayName}`;
        signInBtn.classList.remove('nav-cta-emergency');
        signInBtn.classList.add('nav-cta');
        
        const newBtn = signInBtn.cloneNode(true);
        signInBtn.parentNode?.replaceChild(newBtn, signInBtn);
        newBtn.addEventListener('click', (e) => {
            e.preventDefault();
            window.location.href = user.dashboardUrl;
        });
    } else if (signInBtn) {
        signInBtn.innerHTML = `<i class="fas fa-sign-in-alt"></i> SIGN IN`;
        signInBtn.classList.add('nav-cta-emergency');
        signInBtn.classList.remove('nav-cta');
        
        const newBtn = signInBtn.cloneNode(true);
        signInBtn.parentNode?.replaceChild(newBtn, signInBtn);
        newBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const modal = document.getElementById('signinModal');
            if (modal) modal.classList.add('active');
        });
    }
}

// ========== SHOW NOTIFICATION ==========
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

// ========== REQUIRE AUTHENTICATION ==========
function requireAuth(redirectUrl = '/') {
    const user = getCurrentUser();
    if (!user) {
        window.location.href = redirectUrl;
        return false;
    }
    return true;
}

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

// ========== START FIREBASE ==========
initializeFirebase();

// ========== EXPOSE FUNCTIONS GLOBALLY ==========
window.signUpWithEmail = signUpWithEmail;
window.signInWithEmail = signInWithEmail;
window.signInWithGoogle = signInWithGoogle;
window.signOut = signOut;
window.getCurrentUser = getCurrentUser;
window.updateHeaderUI = updateHeaderUI;
window.requireAuth = requireAuth;
window.requireEmployer = requireEmployer;
window.requireCandidate = requireCandidate;
window.showNotification = showNotification;