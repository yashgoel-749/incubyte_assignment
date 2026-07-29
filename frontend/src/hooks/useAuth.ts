import { useAppSelector } from './useAppSelector';
import { useAppDispatch } from './useAppDispatch';
import { logout } from '../store/slices/authSlice';

/**
 * Convenience hook that surfaces the full auth slice state
 * plus a pre-wired logout dispatcher.
 */
export function useAuth() {
    const dispatch = useAppDispatch();
    const user = useAppSelector((s) => s.auth.user);
    const token = useAppSelector((s) => s.auth.token);
    const isAuthenticated = useAppSelector((s) => s.auth.isAuthenticated);
    const isLoading = useAppSelector((s) => s.auth.isLoading);
    const error = useAppSelector((s) => s.auth.error);

    const handleLogout = () => dispatch(logout());

    return { user, token, isAuthenticated, isLoading, error, handleLogout };
}
