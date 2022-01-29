/* eslint-disable react/jsx-props-no-spreading */
import '../styles/globals.css';
import '../config/firebaseInit';

import type { AppProps } from 'next/app';
import React from 'react';

import { AuthUserProvider } from '../context/AuthUserContext';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AuthUserProvider>
      <Component {...pageProps} />
    </AuthUserProvider>
  );
}
export default MyApp;
