import { initializeApp } from "firebase/app";
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged, User } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Provider with Google Workspace scopes — used for admin newsletter/Sheets flow only
const workspaceProvider = new GoogleAuthProvider();
workspaceProvider.addScope("https://www.googleapis.com/auth/spreadsheets");
workspaceProvider.addScope("https://www.googleapis.com/auth/drive.file");

// Basic provider — used for hub sign-in (no Drive consent prompt)
const basicProvider = new GoogleAuthProvider();

let isSigningIn = false;
let cachedAccessToken: string | null = null;

export const initAuth = (
  onAuthSuccess?: (user: User, token: string) => void,
  onAuthFailure?: () => void
) => {
  return onAuthStateChanged(auth, async (user: User | null) => {
    if (user) {
      if (cachedAccessToken) {
        if (onAuthSuccess) onAuthSuccess(user, cachedAccessToken);
      } else if (!isSigningIn) {
        cachedAccessToken = null;
        if (onAuthFailure) onAuthFailure();
      }
    } else {
      cachedAccessToken = null;
      if (onAuthFailure) onAuthFailure();
    }
  });
};

// Full sign-in with Workspace scopes (admin newsletter/Sheets integration)
export const googleSignIn = async (): Promise<{ user: User; accessToken: string } | null> => {
  try {
    isSigningIn = true;
    const result = await signInWithPopup(auth, workspaceProvider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    if (!credential?.accessToken) {
      throw new Error("Failed to extract Google Access Token from session.");
    }
    cachedAccessToken = credential.accessToken;
    return { user: result.user, accessToken: cachedAccessToken };
  } catch (error: any) {
    console.error("Google Sign-In Failure:", error);
    throw error;
  } finally {
    isSigningIn = false;
  }
};

// Basic sign-in for hub users (no Workspace scopes)
export const googleSignInBasic = async (): Promise<User> => {
  try {
    isSigningIn = true;
    const result = await signInWithPopup(auth, basicProvider);
    return result.user;
  } catch (error: any) {
    console.error("Google Sign-In Failure:", error);
    throw error;
  } finally {
    isSigningIn = false;
  }
};

export const getAccessToken = async (): Promise<string | null> => {
  return cachedAccessToken;
};

export const logout = async () => {
  await auth.signOut();
  cachedAccessToken = null;
  try {
    await fetch("/api/admin/revoke", { method: "POST" });
  } catch (e) {
    console.error("Backend credentials revocation failed", e);
  }
};
