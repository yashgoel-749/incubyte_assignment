import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Mail, Lock, User } from 'lucide-react';
import { Button, Input } from '../../components/ui';
import { emailPattern, passwordRules } from '../../utils/validators';
import { ROUTES } from '../../utils/constants';
import type { RegisterCredentials } from '../../types';

export default function RegisterPage() {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<RegisterCredentials>();

    // TODO Sprint 3: dispatch authService.register → setCredentials
    const onSubmit = async (_data: RegisterCredentials) => { };

    return (
        <div>
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-white">Create account</h2>
                <p className="mt-1 text-sm text-slate-400">Join AutoCommand Executive Suite</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
                <Input
                    id="register-name"
                    label="Full name"
                    type="text"
                    placeholder="Alex Rivera"
                    leftAdornment={<User size={15} />}
                    error={errors.name?.message}
                    {...register('name', { required: 'Full name is required' })}
                />
                <Input
                    id="register-email"
                    label="Email address"
                    type="email"
                    placeholder="you@dealership.com"
                    leftAdornment={<Mail size={15} />}
                    error={errors.email?.message}
                    {...register('email', { required: 'Email is required', pattern: emailPattern })}
                />
                <Input
                    id="register-password"
                    label="Password"
                    type="password"
                    placeholder="Min. 8 characters"
                    leftAdornment={<Lock size={15} />}
                    error={errors.password?.message}
                    {...register('password', passwordRules)}
                />

                <Button
                    id="register-submit-btn"
                    type="submit"
                    variant="primary"
                    size="lg"
                    isLoading={isSubmitting}
                    className="w-full mt-2"
                >
                    Create Account
                </Button>
            </form>

            <p className="mt-6 text-center text-sm text-slate-500">
                Already have an account?{' '}
                <Link to={ROUTES.LOGIN} className="text-blue-400 hover:text-blue-300 font-medium">
                    Sign in
                </Link>
            </p>
        </div>
    );
}
