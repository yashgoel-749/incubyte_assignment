import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './store';
import App from './App';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* Redux store available to all components in the tree */}
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>,
);
