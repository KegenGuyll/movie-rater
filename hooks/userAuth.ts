import { useState, useEffect } from 'react';
import {
  getAuth,
  User,
  createUserWithEmailAndPassword as createEmailPassword,
  signInWithEmailAndPassword as signEmailPassword,
  signInAnonymously as signAnonymously,
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth';

export default function useFirebaseAuth() {
  const [authUser, setAuthUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const auth = getAuth();
  const googleProvider = new GoogleAuthProvider();

  const authStateChanged = async (authState: User | null) => {
    if (!authState) {
      setAuthUser(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setAuthUser(authState);
    setLoading(false);
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
    loading,
    signOut,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signInAnonymously,
    signInWithGoogle,
  };
}
