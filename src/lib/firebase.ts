import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  type User
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  getDocFromServer,
  collection,
  onSnapshot
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export const MASTER_ADMIN_EMAILS = [
  'breakingnewswala.com@gmail.com',
  'admin.ainewsroom@gmail.com',
  'editor.bnwtv@gmail.com'
];
export const MASTER_ADMIN_EMAIL = MASTER_ADMIN_EMAILS[0];

export function isMasterAdminEmail(email?: string | null): boolean {
  if (!email) return false;
  const normalized = email.toLowerCase().trim();
  return MASTER_ADMIN_EMAILS.some(e => e.toLowerCase() === normalized);
}

export type UserRole = 'MASTER_ADMIN' | 'CHANNEL_ADMIN';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string;
  role: UserRole;
  channelName: string;
  channelLogo: string;
  district: string;
  facebookConnected?: boolean;
  youtubeConnected?: boolean;
  instagramConnected?: boolean;
  twitterConnected?: boolean;
  linkedinConnected?: boolean;
  status: 'active' | 'pending' | 'suspended';
  createdAt?: string;
  updatedAt?: string;
}

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Google Login
export async function signInWithGoogle(): Promise<User> {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (err) {
    console.error('Google Sign-In Error:', err);
    throw err;
  }
}

// Logout
export async function signOutUser(): Promise<void> {
  await signOut(auth);
}

// Fetch or create user profile in Firestore
export async function syncUserProfile(user: User): Promise<UserProfile> {
  const userRef = doc(db, 'users', user.uid);
  const isMaster = isMasterAdminEmail(user.email);

  try {
    const snap = await getDoc(userRef);
    if (snap.exists()) {
      const data = snap.data() as UserProfile;
      // Ensure master admin role if matching email
      if (isMaster && data.role !== 'MASTER_ADMIN') {
        const updated: UserProfile = { ...data, role: 'MASTER_ADMIN' };
        await setDoc(userRef, updated, { merge: true });
        return updated;
      }
      return data;
    }

    // New User profile
    const newProfile: UserProfile = {
      uid: user.uid,
      email: user.email || '',
      displayName: user.displayName || 'Newsroom User',
      photoURL: user.photoURL || '',
      role: isMaster ? 'MASTER_ADMIN' : 'CHANNEL_ADMIN',
      channelName: isMaster ? 'AI Newsroom' : 'मेरा जिला लाइव',
      channelLogo: isMaster ? '/Logo.png' : '',
      district: 'मध्य प्रदेश',
      facebookConnected: isMaster,
      youtubeConnected: isMaster,
      instagramConnected: false,
      twitterConnected: false,
      linkedinConnected: false,
      status: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    await setDoc(userRef, newProfile);
    return newProfile;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `users/${user.uid}`);
    throw error;
  }
}

export async function updateUserProfile(uid: string, updates: Partial<UserProfile>): Promise<void> {
  try {
    const userRef = doc(db, 'users', uid);
    await setDoc(userRef, { ...updates, updatedAt: new Date().toISOString() }, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `users/${uid}`);
    throw error;
  }
}

export async function testConnection(): Promise<boolean> {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    return true;
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('Firebase client is offline. Verify network/configuration.');
      return false;
    }
    return true;
  }
}

testConnection().catch(err => console.debug('Initial Firebase test connection:', err));
