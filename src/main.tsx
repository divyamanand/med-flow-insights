import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { queryClient } from '@/lib/queryClient';
import { AuthProvider } from '@/lib/auth';
import App from './App';
import './styles/global.css';

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter basename="/">
          <App />
        </BrowserRouter>
        <ReactQueryDevtools initialIsOpen={false} buttonPosition="bottom-right" />
      </AuthProvider>
    </QueryClientProvider>
  </React.StrictMode>,
);
