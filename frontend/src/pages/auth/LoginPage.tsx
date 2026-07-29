import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Mail, Lock } from 'lucide-react';
import { Button, Input } from '../../components/ui';
import { emailPattern, passwordRules } from '../../utils/validators';
import { ROUTES } from '../../utils/constants';
import type { LoginCredentials } from '../../types';

export default function LoginPage() {
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginCredentials>();
    const onSubmit = async () => { };

    return (
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
            <div className="mb-8 text-center">
                <h2 className="text-2xl font-bold text-slate-900">Welcome back</h2>
                <p className="mt-2 text-sm text-slate-500">Sign in to your AutoCommand account</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
                <Input
                    label="Email address" type="email" placeholder="you@dealership.com"
                    leftAdornment={<Mail size={16} />}
                    error={errors.email?.message}
                    {...register('email', { required: 'Email is required', pattern: emailPattern })}
                />
                <Input
                    label="Password" type="password" placeholder="••••••••"
                    leftAdornment={<Lock size={16} />}
                    error={errors.password?.message}
                    {...register('password', passwordRules)}
                />
                <Button type="submit" variant="primary" size="lg" isLoading={isSubmitting} className="w-full mt-2">
                    Sign In
                </Button>
            </form>

            <p className="mt-6 text-center text-sm text-slate-500">
                Don't have an account?{' '}
                <Link to={ROUTES.REGISTER} className="text-blue-600 hover:text-blue-700 font-semibold">
                    Create one
                </Link>
            </p>
        </div>
    );
}
