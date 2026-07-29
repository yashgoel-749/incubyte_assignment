import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Mail, Lock, Zap } from 'lucide-react';
import { Button, Input } from '../../components/ui';
import { emailPattern, passwordRules } from '../../utils/validators';
import { ROUTES } from '../../utils/constants';
import type { LoginCredentials } from '../../types';

/**
 * LoginPage
 * ─────────────────────────────────────────────────────────────────────────
 * Architecture stub — form wired with RHF validation.
 * API call will be connected in a later sprint.
 */
export default function LoginPage() {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<LoginCredentials>();

    // TODO Sprint 3: dispatch authService.login → setCredentials
    const onSubmit = async (_data: LoginCredentials) => {
        // Placeholder — wire to authService in Sprint 3
    };

    return (
        <div>
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-white">Welcome back</h2>
                <p className="mt-1 text-sm text-slate-400">Sign in to your AutoCommand account</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
                <Input
                    id="login-email"
                    label="Email address"
                    type="email"
                    placeholder="you@dealership.com"
                    leftAdornment={<Mail size={15} />}
                    error={errors.email?.message}
                    {...register('email', { required: 'Email is required', pattern: emailPattern })}
                />

                <Input
                    id="login-password"
                    label="Password"
                    type="password"
                    placeholder="••••••••"
                    leftAdornment={<Lock size={15} />}
                    error={errors.password?.message}
                    {...register('password', passwordRules)}
                />

                <Button
                    id="login-submit-btn"
                    type="submit"
                    variant="primary"
                    size="lg"
                    isLoading={isSubmitting}
                    className="w-full mt-2"
                    leftIcon={<Zap size={16} />}
                >
                    Sign In
                </Button>
            </form>

            <p className="mt-6 text-center text-sm text-slate-500">
                Don't have an account?{' '}
                <Link to={ROUTES.REGISTER} className="text-blue-400 hover:text-blue-300 font-medium">
                    Create one
                </Link>
            </p>
        </div>
    );
}
