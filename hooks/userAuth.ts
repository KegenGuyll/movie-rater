import {
  createUserWithEmailAndPassword as createEmailPassword,
  getAuth,
  GoogleAuthProvider,
  signInAnonymously as signAnonymously,
  signInWithEmailAndPassword as signEmailPassword,
  signInWithPopup,
  User,
} from 'firebase/auth';
import nookies from 'nookies';
import { useEffect, useState } from 'react';

export default function useFirebaseAuth() {
  const [authUser, setAuthUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const auth = getAuth();
  const googleProvider = new GoogleAuthProvider();

  const authStateChanged = async (authState: User | null) => {
    if (!authState) {
      setAuthUser(null);
      setLoading(false);
      nookies.set(undefined, 'token', '', { path: '/' });
    } else {
      setLoading(true);
      setAuthUser(authState);
      const token = await authState.getIdToken();
      nookies.set(undefined, 'token', token, { path: '/' });
      setLoading(false);
    }
  };

  const clear = () => {
    setAuthUser(null);
    setLoading(true);
  };

  const signInWithGoogle = () => signInWithPopup(auth, googleProvider);

  const createUserWithEmailAndPassword = (email: string, password: string) =>
    createEmailPassword(auth, email, password);

  const signInWithEmailAndPassword = (email: string, password: string) =>
    signEmailPassword(auth, email, password);

  const signInAnonymously = () => signAnonymously(auth);

  const signOut = () => auth.signOut().then(clear);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(authStateChanged);

    return () => unsubscribe();
  }, [auth]);

  return {
    authUser,
    createUserWithEmailAndPassword,
    loading,
    signInAnonymously,
    signInWithEmailAndPassword,
    signInWithGoogle,
    signOut,
  };
}
