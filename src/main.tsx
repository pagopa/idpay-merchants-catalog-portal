import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { theme } from '@pagopa/mui-italia';
import { BrowserRouter } from 'react-router-dom';

const getRouterBasename = () => {
  const baseUrl = import.meta.env.BASE_URL;
  const { pathname } = new URL(baseUrl, window.location.origin);

  return pathname.replace(/\/$/, '') || '/';
};

createRoot(document.getElementById('root')!).render(
    <BrowserRouter basename={getRouterBasename()}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <App />
      </ThemeProvider>
    </BrowserRouter>
);
