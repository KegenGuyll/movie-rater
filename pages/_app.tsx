/* eslint-disable react/jsx-props-no-spreading */
import '../styles/globals.css';
import '../config/firebaseInit';

import type { AppProps } from 'next/app';
import NextNProgress from 'nextjs-progressbar';
import React from 'react';

import { AuthUserProvider } from '../context/AuthUserContext';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AuthUserProvider>
      <NextNProgress
        showOnShallow
        color="#e82763"
        height={3}
        startPosition={0.3}
        stopDelayMs={200}
      />
      <Component {...pageProps} />
    </AuthUserProvider>
  );
}
export default MyApp;
