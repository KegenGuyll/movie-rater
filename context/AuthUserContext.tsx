import { User, UserCredential } from 'firebase/auth';
import React, { createContext, useContext } from 'react';

import useFirebaseAuth from '../hooks/userAuth';

interface AuthUserContext {
  authUser: User | null;
  loading: boolean;
}

interface Auth {
  authUser: User | null;
  loading: boolean;
  signOut: () => Promise<void>;
  createUserWithEmailAndPassword: (
    email: string,
    password: string
  ) => Promise<UserCredential>;
  signInWithEmailAndPassword: (
    email: string,
    password: string
  ) => Promise<UserCredential>;
  signInAnonymously: () => Promise<UserCredential>;
  signInWithGoogle: () => Promise<UserCredential>;
}

const authUserContext = createContext<AuthUserContext>({
  authUser: null,
  loading: true,
});

export function AuthUserProvider({ children }: any) {
  const auth = useFirebaseAuth();

  return (
    <authUserContext.Provider value={auth}>{children}</authUserContext.Provider>
  );
}

export const useAuth = () => useContext(authUserContext) as Auth;
