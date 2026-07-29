import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Mail, Lock, Eye, EyeOff, ShieldCheck, User } from 'lucide-react';
import { Button, Input, Card } from '../../components/ui';
import { ROUTES } from '../../utils/constants';
import { useAppDispatch } from '../../hooks';
import { setCredentials } from '../../store/slices/authSlice';
import { authService } from '../../services';

const registerSchema = z.object({
    name: z.string().min(1, 'Full name is required'),
    email: z.string().min(1, 'Email is required').email('Enter a valid email address'),
    password: z.string().min(1, 'Password is required').min(8, 'Password must be at least 8 characters'),
});
type RegisterFormInputs = z.infer<typeof registerSchema>;

export default function RegisterPage() {
    const [showPassword, setShowPassword] = useState(false);
    const [authError, setAuthError] = useState('');
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<RegisterFormInputs>({
        resolver: zodResolver(registerSchema),
        defaultValues: { name: '', email: '', password: '' },
    });

    const onSubmit = async (data: RegisterFormInputs) => {
        try {
            setAuthError('');
            const response = await authService.register(data);
            dispatch(setCredentials(response));
            navigate(ROUTES.DASHBOARD, { replace: true });
        } catch (error: any) {
            setAuthError(error.message || 'Failed to register');
        }
    };

    return (
        <Card padding="lg" className="shadow-lg border-slate-100">
            <div className="flex flex-col items-center text-center mb-8">
                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-4">
                    <ShieldCheck size={24} />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Create Account</h2>
                <p className="mt-2 text-xs font-medium text-slate-500">
                    Join the executive suite to get started.
                </p>
            </div>

            {authError && (
                <div className="mb-4 p-3 bg-red-50 border border-red-100 text-red-600 text-sm rounded-lg text-center">
                    {authError}
                </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
                <Input
                    label="FULL NAME"
                    type="text"
                    placeholder="Alex Rivera"
                    leftAdornment={<User size={16} />}
                    error={errors.name?.message}
                    {...register('name')}
                />

                <Input
                    label="EMAIL ADDRESS"
                    type="email"
                    placeholder="manager@autocommand.com"
                    leftAdornment={<Mail size={16} />}
                    error={errors.email?.message}
                    {...register('email')}
                />

                <Input
                    label="PASSWORD"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Min 8 characters"
                    leftAdornment={<Lock size={16} />}
                    rightAdornment={
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="text-slate-400 hover:text-slate-600 focus:outline-none"
                            tabIndex={-1}
                        >
                            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                    }
                    error={errors.password?.message}
                    {...register('password')}
                />

                <Button type="submit" variant="primary" size="lg" isLoading={isSubmitting} className="w-full mt-2 py-3 rounded-xl border border-transparent">
                    Create Account
                </Button>
            </form>

            <p className="mt-8 text-center text-xs font-medium text-slate-500">
                Already have an account?{' '}
                <Link to={ROUTES.LOGIN} className="text-blue-600 hover:text-blue-700 font-bold transition-colors">
                    Sign In
                </Link>
            </p>
        </Card>
    );
}
