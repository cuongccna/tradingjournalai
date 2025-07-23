'use client';

import { useEffect } from 'react';

export default function MetaMaskHandler() {
  useEffect(() => {
    // Handle MetaMask injection issues
    const handleError = (event: ErrorEvent) => {
      if (event.message && event.message.includes('MetaMask')) {
        event.preventDefault();
        console.warn('MetaMask error handled:', event.message);
        return false;
      }
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      if (event.reason && event.reason.toString().includes('MetaMask')) {
        event.preventDefault();
        console.warn('MetaMask promise rejection handled:', event.reason);
      }
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    // Cleanup listeners
    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, []);

  return null;
}
