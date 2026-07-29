import { useDispatch } from 'react-redux';
import type { AppDispatch } from '../store';

/**
 * Typed wrapper around useDispatch.
 * Provides full autocomplete for all slice actions and async thunks.
 */
export const useAppDispatch = () => useDispatch<AppDispatch>();
