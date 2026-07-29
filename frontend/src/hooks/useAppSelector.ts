import { useSelector, type TypedUseSelectorHook } from 'react-redux';
import type { RootState } from '../store';

/**
 * Typed wrapper around useSelector.
 * Provides full type inference for all state selectors.
 */
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
