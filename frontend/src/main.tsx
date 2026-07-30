import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './store';
import { setTokenProvider } from './services/api';
import { logout } from './store/slices/authSlice';
import App from './App';
import './index.css';

// Wire up the JWT token provider so api.ts can attach the Bearer header
// without importing the store directly (which would create a circular dep).
setTokenProvider(
  () => store.getState().auth.token,
  () => store.dispatch(logout()),
);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* Redux store available to all components in the tree */}
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>,
);
