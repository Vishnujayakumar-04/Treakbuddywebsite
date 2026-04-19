import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User as FirebaseUser } from 'firebase/auth';
import {
  signUpWithEmail,
  signInWithEmail,
  signInWithGoogle,
  signOut,
  getCurrentUser,
  onAuthStateChanged,
} from '../utils/auth';
import { createUserProfile, getUserProfile, ensureUserProfile, UserProfile } from '../utils/firestore';

interface AuthContextType {
  user: FirebaseUser | null;
  userProfile: UserProfile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string, phone?: string, profilePhotoUrl?: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  refreshUserProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Load user profile when user changes
  const loadUserProfile = async (userId: string) => {
    try {
      const profile = await getUserProfile(userId);
      setUserProfile(profile);
    } catch (error) {
      console.error('Error loading user profile:', error);
      setUserProfile(null);
    }
  };

  // Listen to auth state changes
  useEffect(() => {
    // Set a timeout to prevent infinite loading (max 5 seconds)
    const loadingTimeout = setTimeout(() => {
      if (loading) {
        console.warn('Auth loading timeout - proceeding with null user');
        setLoading(false);
      }
    }, 5000);

    const unsubscribe = onAuthStateChanged(async (firebaseUser) => {
      clearTimeout(loadingTimeout);
      setUser(firebaseUser);

      if (firebaseUser) {
        try {
          // Ensure user profile exists in Firestore (create if missing)
          await ensureUserProfile(firebaseUser.uid, {
            name: firebaseUser.displayName || undefined,
            email: firebaseUser.email || '',
            profilePhotoUrl: firebaseUser.photoURL || undefined,
          });
        } catch (profileError) {
          console.error('Error ensuring user profile:', profileError);
          // Continue even if profile creation fails
        }

        try {
          await loadUserProfile(firebaseUser.uid);
        } catch (error) {
          console.error('Error loading user profile:', error);
          // Continue even if profile load fails
        }
      } else {
        setUserProfile(null);
      }

      setLoading(false);
    });

    return () => {
      clearTimeout(loadingTimeout);
      unsubscribe();
    };
  }, []);

  const handleSignIn = async (email: string, password: string) => {
    try {
      const firebaseUser = await signInWithEmail(email, password);
      setUser(firebaseUser);
      if (firebaseUser) {
        // Ensure user profile exists in Firestore (create if missing)
        try {
          await ensureUserProfile(firebaseUser.uid, {
            name: firebaseUser.displayName || undefined,
            email: firebaseUser.email || email,
            profilePhotoUrl: firebaseUser.photoURL || undefined,
          });
        } catch (profileError) {
          console.error('Error ensuring user profile:', profileError);
          // Continue even if profile creation fails
        }
        await loadUserProfile(firebaseUser.uid);
      }
    } catch (error: any) {
      console.error('Sign in error:', error);
      throw error;
    }
  };

  const handleSignUp = async (
    email: string,
    password: string,
    name: string,
    phone?: string,
    profilePhotoUrl?: string
  ) => {
    try {
      const firebaseUser = await signUpWithEmail(email, password, name, phone);

      // Create user profile in Firestore
      await createUserProfile(firebaseUser.uid, {
        name,
        email,
        phone,
        profilePhotoUrl,
      });

      setUser(firebaseUser);
      await loadUserProfile(firebaseUser.uid);
    } catch (error: any) {
      console.error('Sign up error:', error);
      throw error;
    }
  };

  const handleSignInWithGoogle = async () => {
    try {
      const firebaseUser = await signInWithGoogle();
      setUser(firebaseUser);

      if (firebaseUser) {
        // Check if profile exists, if not create one
        const profile = await getUserProfile(firebaseUser.uid);
        if (!profile) {
          await createUserProfile(firebaseUser.uid, {
            name: firebaseUser.displayName || 'User',
            email: firebaseUser.email || '',
            profilePhotoUrl: firebaseUser.photoURL || undefined,
          });
        }
        await loadUserProfile(firebaseUser.uid);
      }
    } catch (error: any) {
      console.error('Google sign in error:', error);
      throw error;
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      setUser(null);
      setUserProfile(null);
    } catch (error: any) {
      console.error('Sign out error:', error);
      throw error;
    }
  };

  const refreshUserProfile = async () => {
    if (user) {
      await loadUserProfile(user.uid);
    }
  };

  const value: AuthContextType = {
    user,
    userProfile,
    loading,
    signIn: handleSignIn,
    signUp: handleSignUp,
    signInWithGoogle: handleSignInWithGoogle,
    signOut: handleSignOut,
    refreshUserProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

