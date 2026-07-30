import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Mail, Lock, Eye, EyeOff, ShieldCheck } from 'lucide-react';
import { Button, Input, Card } from '../../components/ui';
import { ROUTES } from '../../utils/constants';
import { useAppDispatch } from '../../hooks';
import { loginUser } from '../../store/thunks/authThunks';

const loginSchema = z.object({
    email: z.string().min(1, 'Email is required').email('Enter a valid email address'),
    password: z.string().min(1, 'Password is required').min(8, 'Password must be at least 8 characters'),
    rememberMe: z.boolean().optional(),
});
type LoginFormInputs = z.infer<typeof loginSchema>;

export default function LoginPage() {
    const [showPassword, setShowPassword] = useState(false);
    const [authError, setAuthError] = useState('');
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<LoginFormInputs>({
        resolver: zodResolver(loginSchema),
        defaultValues: { email: '', password: '', rememberMe: false },
    });

    const onSubmit = async (data: LoginFormInputs) => {
        setAuthError('');
        const result = await dispatch(loginUser({ email: data.email, password: data.password }));

        if (loginUser.fulfilled.match(result)) {
            navigate(ROUTES.DASHBOARD, { replace: true });
            return;
        }

        setAuthError(result.payload ?? 'Failed to login');
    };

    return (
        <Card padding="lg" className="shadow-lg border-slate-100">
            <div className="flex flex-col items-center text-center mb-8">
                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-4">
                    <ShieldCheck size={24} />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Welcome Back</h2>
                <p className="mt-2 text-xs font-medium text-slate-500">
                    Enter your credentials to access the executive suite.
                </p>
            </div>

            {authError && (
                <div className="mb-4 p-3 bg-red-50 border border-red-100 text-red-600 text-sm rounded-lg text-center">
                    {authError}
                </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
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
                    placeholder="••••••••"
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

                <div className="flex items-center justify-between pt-1">
                    <label className="flex items-center gap-2 text-xs font-medium text-slate-600 cursor-pointer">
                        <input
                            type="checkbox"
                            className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500/30 transition-all"
                            {...register('rememberMe')}
                        />
                        Remember me
                    </label>
                    <a href="#" className="text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors">
                        Forgot password?
                    </a>
                </div>

                <Button type="submit" variant="primary" size="lg" isLoading={isSubmitting} className="w-full mt-2 py-3 rounded-xl border border-transparent">
                    Sign In
                </Button>
            </form>

            <div className="relative flex items-center py-6">
                <div className="flex-grow border-t border-slate-200"></div>
                <span className="flex-shrink-0 mx-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    OR CONTINUE WITH
                </span>
                <div className="flex-grow border-t border-slate-200"></div>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-6">
                <Button variant="outline" className="w-full rounded-xl py-2.5 text-xs text-slate-700 hover:bg-slate-50 font-semibold" type="button">
                    {/* using emoji as placeholder for google logo */}
                    <span className="mr-2">G </span> Google
                </Button>
                <Button variant="outline" className="w-full rounded-xl py-2.5 text-xs text-slate-700 hover:bg-slate-50 font-semibold" type="button">
                    SSO
                </Button>
            </div>

            <p className="text-center text-xs font-medium text-slate-500">
                Don't have an account yet?{' '}
                <Link to={ROUTES.REGISTER} className="text-blue-600 hover:text-blue-700 font-bold transition-colors">
                    Register
                </Link>
            </p>
        </Card>
    );
}
