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

// ========== SAFE FIREBASE INITIALIZATION ==========
// This function waits for Firebase SDK to load before initializing
function initializeFirebase() {
    // Check if Firebase SDK is loaded
    if (typeof firebase === 'undefined') {
        console.log('Waiting for Firebase SDK to load...');
        setTimeout(initializeFirebase, 500);
        return;
    }
    
    // Check if already initialized
    if (firebase.apps.length > 0) {
        console.log('Firebase already initialized');
        setupFirebase();
        return;
    }
    
    // Initialize Firebase
    try {
        firebase.initializeApp(firebaseConfig);
        console.log('Firebase initialized successfully!');
        setupFirebase();
    } catch (error) {
        console.error('Firebase initialization error:', error);
    }
}

// ========== SETUP FIREBASE AFTER INITIALIZATION ==========
function setupFirebase() {
    window.auth = firebase.auth();
    window.db = firebase.firestore();
    
    // Auth state listener
    firebase.auth().onAuthStateChanged(async (firebaseUser) => {
        if (firebaseUser) {
            try {
                const userDoc = await window.db.collection('users').doc(firebaseUser.uid).get();
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

// ========== SIGN UP FUNCTION ==========
async function signUpWithEmail(email, password, userData) {
    try {
        const userCredential = await firebase.auth().createUserWithEmailAndPassword(email, password);
        
        await userCredential.user.updateProfile({
            displayName: `${userData.firstName} ${userData.lastName}`
        });
        
        await firebase.firestore().collection('users').doc(userCredential.user.uid).set({
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
        return { success: false, message: error.message };
    }
}

// ========== SIGN IN FUNCTION ==========
async function signInWithEmail(email, password, userType) {
    try {
        const userCredential = await firebase.auth().signInWithEmailAndPassword(email, password);
        
        const userDoc = await firebase.firestore().collection('users').doc(userCredential.user.uid).get();
        
        if (!userDoc.exists) {
            await firebase.auth().signOut();
            return { success: false, message: "User data not found" };
        }
        
        const userData = userDoc.data();
        
        if (userData.userType !== userType) {
            await firebase.auth().signOut();
            return { success: false, message: `No ${userType} account found with this email` };
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
        console.error('Sign in error:', error);
        return { success: false, message: error.message };
    }
}

// ========== GOOGLE SIGN IN ==========
async function signInWithGoogle() {
    const provider = new firebase.auth.GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });
    
    try {
        const result = await firebase.auth().signInWithPopup(provider);
        const user = result.user;
        
        const userDoc = await firebase.firestore().collection('users').doc(user.uid).get();
        
        if (!userDoc.exists) {
            await firebase.firestore().collection('users').doc(user.uid).set({
                uid: user.uid,
                firstName: user.displayName?.split(' ')[0] || '',
                lastName: user.displayName?.split(' ')[1] || '',
                email: user.email,
                userType: 'candidate',
                authProvider: 'google',
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            });
        }
        
        const userData = (await firebase.firestore().collection('users').doc(user.uid).get()).data();
        
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
    firebase.auth().signOut().then(() => {
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

// ========== START FIREBASE INITIALIZATION ==========
// This will wait for Firebase SDK to load
initializeFirebase();

// ========== EXPOSE FUNCTIONS GLOBALLY ==========
window.signUpWithEmail = signUpWithEmail;
window.signInWithEmail = signInWithEmail;
window.signInWithGoogle = signInWithGoogle;
window.signOut = signOut;
window.getCurrentUser = getCurrentUser;
window.updateHeaderUI = updateHeaderUI;
window.requireAuth = requireAuth;
window.showNotification = showNotification;

