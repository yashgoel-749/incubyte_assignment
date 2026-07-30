import { useState } from 'react';
import { useForm, type UseFormRegister, type FieldErrors } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../hooks';
import { loginUser } from '../../store/thunks/authThunks';
import { ROUTES } from '../../utils/constants';

// ─── Validation Schema ────────────────────────────────────────────────────
export const loginSchema = z.object({
    email: z
        .string()
        .min(1, 'Email is required')
        .email('Enter a valid email address'),
    password: z
        .string()
        .min(1, 'Password is required')
        .min(8, 'Password must be at least 8 characters'),
    rememberMe: z.boolean().optional(),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

// ─── Return Shape ─────────────────────────────────────────────────────────
export interface UseLoginFormReturn {
    register: UseFormRegister<LoginFormValues>;
    errors: FieldErrors<LoginFormValues>;
    isSubmitting: boolean;
    authError: string;
    handleSubmit: React.FormEventHandler<HTMLFormElement>;
}

// ─── Hook ─────────────────────────────────────────────────────────────────
/**
 * Encapsulates all login form logic:
 *  - Zod-backed validation via react-hook-form
 *  - Redux thunk dispatch on submit
 *  - localStorage / Redux state update (handled by authSlice)
 *  - Dashboard redirect on success
 *  - Backend error surfacing on failure
 */
export function useLoginForm(): UseLoginFormReturn {
    const [authError, setAuthError] = useState<string>('');
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
        defaultValues: { email: '', password: '', rememberMe: false },
    });

    const onSubmit = async (data: LoginFormValues): Promise<void> => {
        setAuthError('');
        const result = await dispatch(
            loginUser({ email: data.email, password: data.password }),
        );

        if (loginUser.fulfilled.match(result)) {
            navigate(ROUTES.DASHBOARD, { replace: true });
            return;
        }

        setAuthError(result.payload ?? 'Failed to login');
    };

    return {
        register,
        errors,
        isSubmitting,
        authError,
        handleSubmit: handleSubmit(onSubmit),
    };
}
