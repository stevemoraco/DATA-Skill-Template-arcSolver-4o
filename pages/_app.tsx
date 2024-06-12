import type { AppProps } from 'next/app';
 import React, { useState, useEffect } from 'react';
 import '../styles/globals.css';


 function MyApp({ Component, pageProps }: AppProps) {
  useEffect(() => {
    document.body.style.backgroundColor = '#000';
  }, []);
  
   return <Component {...pageProps} />;
 }

 export default MyApp;