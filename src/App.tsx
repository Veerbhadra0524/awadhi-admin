import React from 'react';
import { AppRouter } from './core/routing/AppRouter';
import { AuthProvider } from './core/auth/AuthContext';

export default function App() {
  return (
    <AuthProvider>
      <AppRouter />
    </AuthProvider>
  );
}
