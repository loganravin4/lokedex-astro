import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles/global.css';
import './styles/hardware.css';
import App from './App';
import PostHogProvider from './analytics/PostHogProvider';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <PostHogProvider>
      <App />
    </PostHogProvider>
  </StrictMode>
);
