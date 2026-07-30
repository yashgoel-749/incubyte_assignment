import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, ShieldCheck } from 'lucide-react';
import { Button, Input, Card } from '../../components/ui';
import { ROUTES } from '../../utils/constants';
import { useLoginForm } from './useLoginForm';

// ─── Sub-components ───────────────────────────────────────────────────────

/** Renders a dismissible error banner when the backend rejects the login. */
function AuthErrorBanner({ message }: { message: string }) {
    if (!message) return null;
    return (
        <div
            role="alert"
            className="mb-4 p-3 bg-red-50 border border-red-100 text-red-600 text-sm rounded-lg text-center"
        >
            {message}
        </div>
    );
}

/** Decorative divider + social login buttons (Google / SSO). */
function SocialLoginSection() {
    return (
        <>
            <div className="relative flex items-center py-6">
                <div className="flex-grow border-t border-slate-200" />
                <span className="flex-shrink-0 mx-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    OR CONTINUE WITH
                </span>
                <div className="flex-grow border-t border-slate-200" />
            </div>

            <div className="grid grid-cols-2 gap-3 mb-6">
                <Button
                    variant="outline"
                    type="button"
                    className="w-full rounded-xl py-2.5 text-xs text-slate-700 hover:bg-slate-50 font-semibold"
                >
                    <span className="mr-2">G </span>Google
                </Button>
                <Button
                    variant="outline"
                    type="button"
                    className="w-full rounded-xl py-2.5 text-xs text-slate-700 hover:bg-slate-50 font-semibold"
                >
                    SSO
                </Button>
            </div>
        </>
    );
}

// ─── Page Component ───────────────────────────────────────────────────────

/**
 * LoginPage — presentational component.
 *
 * All form logic (schema, submit, thunk dispatch, redirect, error state)
 * lives in the `useLoginForm` hook; this component only handles UI concerns
 * like the password visibility toggle.
 */
export default function LoginPage() {
    const [showPassword, setShowPassword] = useState(false);
    const { register, errors, isSubmitting, authError, handleSubmit } = useLoginForm();

    return (
        <Card padding="lg" className="shadow-lg border-slate-100">
            {/* ── Header ───────────────────────────────────────────────── */}
            <div className="flex flex-col items-center text-center mb-8">
                <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mb-4">
                    <ShieldCheck size={24} />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
                    Welcome Back
                </h2>
                <p className="mt-2 text-xs font-medium text-slate-500">
                    Enter your credentials to access the executive suite.
                </p>
            </div>

            {/* ── Backend error ─────────────────────────────────────────── */}
            <AuthErrorBanner message={authError} />

            {/* ── Credential form ───────────────────────────────────────── */}
            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                <Input
                    label="EMAIL ADDRESS"
                    type="email"
                    placeholder="manager@premiumdeluxemotors.com"
                    leftAdornment={<Mail size={16} />}
                    error={errors.email?.message}
                    {...register('email')}
                />

                <Input
                    label="PASSWORD"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    leftAdornment={<Lock size={16} />}
                    rightAdornment={
                        <button
                            type="button"
                            tabIndex={-1}
                            aria-hidden="true"
                            onClick={() => setShowPassword((prev) => !prev)}
                            className="text-slate-400 hover:text-slate-600 focus:outline-none"
                        >
                            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                    }
                    error={errors.password?.message}
                    {...register('password')}
                />

                <div className="flex items-center justify-between pt-1">
                    <label className="flex items-center gap-2 text-xs font-medium text-slate-600 cursor-pointer">
                        <input
                            type="checkbox"
                            className="w-4 h-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500/30 transition-all"
                            {...register('rememberMe')}
                        />
                        Remember me
                    </label>
                    <a
                        href="#"
                        className="text-xs font-bold text-emerald-600 hover:text-emerald-700 transition-colors"
                    >
                        Forgot password?
                    </a>
                </div>

                <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    isLoading={isSubmitting}
                    className="w-full mt-2 py-3 rounded-xl border border-transparent"
                >
                    Sign In
                </Button>
            </form>

            {/* ── Social / SSO ─────────────────────────────────────────── */}
            <SocialLoginSection />

            {/* ── Register link ─────────────────────────────────────────── */}
            <p className="text-center text-xs font-medium text-slate-500">
                Don't have an account yet?{' '}
                <Link
                    to={ROUTES.REGISTER}
                    className="text-emerald-600 hover:text-emerald-700 font-bold transition-colors"
                >
                    Register
                </Link>
            </p>
        </Card>
    );
}
