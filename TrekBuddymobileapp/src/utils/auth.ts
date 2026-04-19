import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  sendPasswordResetEmail,
  onAuthStateChanged as firebaseOnAuthStateChanged,
  User as FirebaseUser,
  GoogleAuthProvider,
  signInWithCredential,
  signInWithPhoneNumber,
} from 'firebase/auth';

// Type for phone authentication confirmation result
// Note: This may need adjustment based on your Firebase version and platform
export type PhoneConfirmationResult = Awaited<ReturnType<typeof signInWithPhoneNumber>>;
import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import * as Crypto from 'expo-crypto';
import { Auth } from 'firebase/auth';
import { auth } from '../firebase/auth';

// Complete web browser authentication flow
WebBrowser.maybeCompleteAuthSession();

// Google Sign-In configuration
const GOOGLE_CLIENT_ID = process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID || '';

/**
 * Sign up with email and password
 */
export const signUpWithEmail = async (
  email: string,
  password: string,
  name?: string,
  phone?: string
): Promise<FirebaseUser> => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth as Auth, email, password);
    const user = userCredential.user;

    // Update display name if provided
    if (name) {
      // Note: We'll update the profile in Firestore via firestore.ts
      // Firebase Auth displayName update requires additional setup
    }

    return user;
  } catch (error: any) {
    console.error('Error signing up:', error);
    throw new Error(error.message || 'Failed to sign up');
  }
};

/**
 * Sign in with email and password
 */
export const signInWithEmail = async (
  email: string,
  password: string
): Promise<FirebaseUser> => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth as Auth, email, password);
    return userCredential.user;
  } catch (error: any) {
    console.error('Error signing in:', error);
    throw new Error(error.message || 'Failed to sign in');
  }
};

/**
 * Sign in with Google
 */
export const signInWithGoogle = async (): Promise<FirebaseUser> => {
  try {
    // Generate a random state for security
    const state = await Crypto.digestStringAsync(
      Crypto.CryptoDigestAlgorithm.SHA256,
      Math.random().toString()
    );

    // Create the auth request
    const request = new AuthSession.AuthRequest({
      clientId: GOOGLE_CLIENT_ID,
      scopes: ['openid', 'profile', 'email'],
      responseType: AuthSession.ResponseType.IdToken,
      redirectUri: AuthSession.makeRedirectUri(),
      state,
    });

    // Get the discovery document
    const discovery = {
      authorizationEndpoint: 'https://accounts.google.com/o/oauth2/v2/auth',
      tokenEndpoint: 'https://oauth2.googleapis.com/token',
      revocationEndpoint: 'https://oauth2.googleapis.com/revoke',
    };

    // Start the authentication flow
    const result = await request.promptAsync(discovery);

    if (result.type === 'success' && result.params?.id_token) {
      const { id_token } = result.params;
      const credential = GoogleAuthProvider.credential(id_token);
      const userCredential = await signInWithCredential(auth as Auth, credential);
      return userCredential.user;
    } else {
      throw new Error('Google sign-in was cancelled or failed');
    }
  } catch (error: any) {
    console.error('Error signing in with Google:', error);
    throw new Error(error.message || 'Failed to sign in with Google');
  }
};

/**
 * Send OTP to phone number
 * Note: Phone authentication may require additional setup for React Native
 * This is a simplified implementation - you may need to adjust based on your platform
 */
export const sendOTP = async (phoneNumber: string): Promise<PhoneConfirmationResult> => {
  try {
    // Format phone number (ensure it starts with +)
    const formattedPhone = phoneNumber.startsWith('+') ? phoneNumber : `+${phoneNumber}`;

    // Note: signInWithPhoneNumber requires reCAPTCHA verification on web
    // For React Native, you may need to use Firebase Phone Auth with a different approach
    // This is a simplified version - you may need to adjust based on your platform
    const confirmationResult = await signInWithPhoneNumber(auth as Auth, formattedPhone);
    return confirmationResult;
  } catch (error: any) {
    console.error('Error sending OTP:', error);
    throw new Error(error.message || 'Failed to send OTP');
  }
};

/**
 * Verify OTP code
 */
export const verifyOTP = async (
  confirmationResult: PhoneConfirmationResult,
  code: string
): Promise<FirebaseUser> => {
  try {
    const userCredential = await confirmationResult.confirm(code);
    return userCredential.user;
  } catch (error: any) {
    console.error('Error verifying OTP:', error);
    throw new Error(error.message || 'Failed to verify OTP');
  }
};

/**
 * Sign out
 */
export const signOut = async (): Promise<void> => {
  try {
    await firebaseSignOut(auth as Auth);
  } catch (error: any) {
    console.error('Error signing out:', error);
    throw new Error(error.message || 'Failed to sign out');
  }
};

/**
 * Reset password
 */
export const resetPassword = async (email: string): Promise<void> => {
  try {
    await sendPasswordResetEmail(auth as Auth, email);
  } catch (error: any) {
    console.error('Error sending password reset email:', error);
    throw new Error(error.message || 'Failed to send password reset email');
  }
};

/**
 * Get current authenticated user
 */
export const getCurrentUser = (): FirebaseUser | null => {
  return (auth as Auth).currentUser;
};

/**
 * Listen to authentication state changes
 */
export const onAuthStateChanged = (
  callback: (user: FirebaseUser | null) => void
): (() => void) => {
  return firebaseOnAuthStateChanged(auth as Auth, callback);
};

