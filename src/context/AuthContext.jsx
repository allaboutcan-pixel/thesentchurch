import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
    onAuthStateChanged, 
    signInWithEmailAndPassword, 
    signOut, 
    createUserWithEmailAndPassword,
    sendPasswordResetEmail
} from 'firebase/auth';
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [userProfile, setUserProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let unsubscribeProfile = null;

        const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
            if (unsubscribeProfile) {
                unsubscribeProfile();
                unsubscribeProfile = null;
            }

            if (user) {
                // Real-time subscription to the user's Firestore profile
                const userDocRef = doc(db, 'users', user.uid);
                
                unsubscribeProfile = onSnapshot(userDocRef, (docSnap) => {
                    if (docSnap.exists()) {
                        const profileData = docSnap.data();
                        setUserProfile(profileData);
                        setCurrentUser({
                            ...user,
                            ...profileData
                        });
                    } else {
                        // User exists in Auth but not in Firestore yet (e.g. during registration)
                        setUserProfile(null);
                        setCurrentUser(user);
                    }
                    setLoading(false);
                }, (error) => {
                    console.error("Error subscribing to user profile:", error);
                    setLoading(false);
                });
            } else {
                setCurrentUser(null);
                setUserProfile(null);
                setLoading(false);
            }
        });

        return () => {
            unsubscribeAuth();
            if (unsubscribeProfile) unsubscribeProfile();
        };
    }, []);

    // Register a new user
    const register = async (email, password, name, phone) => {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Create user document in Firestore with pending status
            await setDoc(doc(db, 'users', user.uid), {
                uid: user.uid,
                email: email,
                name: name,
                phone: phone || '',
                role: 'member',
                status: 'pending', // Option 2: Admin Approval Required
                createdAt: new Date().toISOString()
            });

            return user;
        } catch (error) {
            console.error("Registration error:", error);
            throw error;
        }
    };

    // Login user
    const login = (email, password) => {
        return signInWithEmailAndPassword(auth, email, password);
    };

    // Logout user
    const logout = () => {
        return signOut(auth);
    };

    // Reset password
    const resetPassword = (email) => {
        return sendPasswordResetEmail(auth, email);
    };

    const value = {
        currentUser,
        userProfile,
        loading,
        login,
        logout,
        register,
        resetPassword
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
