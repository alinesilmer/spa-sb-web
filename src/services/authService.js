// This file would handle authentication-related functions

/*
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from './firebase';

// Register a new user
export const registerUser = async (userData) => {
  try {
    // Create user in Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(
      auth, 
      userData.email, 
      userData.password
    );
    
    // Add user profile data to Firestore
    await setDoc(doc(db, 'users', userCredential.user.uid), {
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: userData.email,
      phone: userData.phone || '',
      role: 'client', // Default role
      createdAt: serverTimestamp()
    });
    
    // Update profile display name
    await updateProfile(userCredential.user, {
      displayName: `${userData.firstName} ${userData.lastName}`
    });
    
    return { success: true, user: userCredential.user };
  } catch (error) {
    console.error('Error registering user:', error);
    return { success: false, error: error.message };
  }
};

// Login user
export const loginUser = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    
    // Get user role from Firestore
    const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid));
    const userData = userDoc.data();
    
    return { 
      success: true, 
      user: {
        ...userCredential.user,
        role: userData.role
      } 
    };
  } catch (error) {
    console.error('Error logging in:', error);
    return { success: false, error: error.message };
  }
};

// Google Sign In
export const signInWithGoogle = async () => {
  try {
    const provider = new GoogleAuthProvider();
    const userCredential = await signInWithPopup(auth, provider);
    
    // Check if user exists in Firestore
    const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid));
    
    if (!userDoc.exists()) {
      // Create new user document if first time login
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        firstName: userCredential.user.displayName.split(' ')[0] || '',
        lastName: userCredential.user.displayName.split(' ').slice(1).join(' ') || '',
        email: userCredential.user.email,
        phone: userCredential.user.phoneNumber || '',
        role: 'client', // Default role
        createdAt: serverTimestamp()
      });
    }
    
    // Get user role
    const userData = userDoc.exists() ? userDoc.data() : { role: 'client' };
    
    return { 
      success: true, 
      user: {
        ...userCredential.user,
        role: userData.role
      } 
    };
  } catch (error) {
    console.error('Error signing in with Google:', error);
    return { success: false, error: error.message };
  }
};

// Logout user
export const logoutUser = async () => {
  try {
    await signOut(auth);
    return { success: true };
  } catch (error) {
    console.error('Error logging out:', error);
    return { success: false, error: error.message };
  }
};

// Reset password
export const resetPassword = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
    return { success: true };
  } catch (error) {
    console.error('Error resetting password:', error);
    return { success: false, error: error.message };
  }
};
*/
