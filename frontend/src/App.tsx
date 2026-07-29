import { RouterProvider } from 'react-router-dom';
import router from './router/AppRouter';

/**
 * App — root component.
 * Delegates routing entirely to AppRouter (createBrowserRouter).
 * Redux Provider is mounted in main.tsx so it wraps this component.
 */
export default function App() {
  return <RouterProvider router={router} />;
}
