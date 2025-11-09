'use client';

import type { FormEvent } from 'react';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

import { Button } from '~/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '~/components/ui/dialog';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';

type NavItem = { name: string; href: string };

type AuthUser = {
    id: string;
    email: string;
};

type AuthResponse = {
    token: string;
    user: AuthUser;
};

type ErrorPayload = {
    error?: string;
};

const TOKEN_STORAGE_KEY = 'vibecode:auth_token';
const USER_STORAGE_KEY = 'vibecode:auth_user';

const API_BASE_URL = (() => {
    const configured = import.meta.env.VITE_API_URL?.replace(/\/$/, '') ?? '';
    if (configured) return configured;
    return import.meta.env.DEV ? 'http://localhost:3001' : '';
})();

const apiUrl = (path: string) => `${API_BASE_URL}${path}`;

async function loginRequest(email: string, password: string): Promise<AuthResponse> {
    const response = await fetch(apiUrl('/api/auth/login'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
    });

    const payload: ErrorPayload & Partial<AuthResponse> = await response.json().catch(() => ({}));

    if (!response.ok || !payload || !payload.token || !payload.user) {
        throw new Error(payload?.error || 'Unable to sign in with those credentials');
    }

    return payload as AuthResponse;
}

async function registerRequest(email: string, password: string): Promise<AuthResponse> {
    const response = await fetch(apiUrl('/api/auth/register'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
    });

    const payload: ErrorPayload & Partial<AuthResponse> = await response.json().catch(() => ({}));

    if (!response.ok || !payload || !payload.token || !payload.user) {
        throw new Error(payload?.error || 'Unable to create an account with those details');
    }

    return payload as AuthResponse;
}

async function fetchCurrentUser(token: string): Promise<AuthUser> {
    const response = await fetch(apiUrl('/api/auth/me'), {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        const payload: ErrorPayload = await response.json().catch(() => ({}));
        throw new Error(payload.error || 'Unable to load profile');
    }

    return response.json() as Promise<AuthUser>;
}

async function logoutRequest(token: string) {
    await fetch(apiUrl('/api/auth/logout'), {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${token}`,
        },
    }).catch(() => {
        // ignore network errors on logout
    });
}

const clearStoredAuth = () => {
    if (typeof window === 'undefined') return;
    window.localStorage.removeItem(TOKEN_STORAGE_KEY);
    window.localStorage.removeItem(USER_STORAGE_KEY);
};

export default function Navbar({ navigation }: { navigation: NavItem[] }) {
    const navigate = useNavigate();
    const location = useLocation();

    const [checking, setChecking] = useState(true);
    const [user, setUser] = useState<AuthUser | null>(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [formError, setFormError] = useState<string | null>(null);
    const [formBusy, setFormBusy] = useState(false);

    const canSubmit = email.trim().length > 0 && password.length > 0;
    const onHomePage = location.pathname === '/';

    // Load user from localStorage / /me
    useEffect(() => {
        if (typeof window === 'undefined') return;

        const token = window.localStorage.getItem(TOKEN_STORAGE_KEY);
        const cachedUser = window.localStorage.getItem(USER_STORAGE_KEY);

        if (!token) {
            if (cachedUser) {
                clearStoredAuth();
            }
            setChecking(false);
            return;
        }

        if (cachedUser) {
            try {
                setUser(JSON.parse(cachedUser));
            } catch {
                window.localStorage.removeItem(USER_STORAGE_KEY);
            }
        }

        let cancelled = false;

        fetchCurrentUser(token)
            .then((profile) => {
                if (cancelled) return;
                setUser(profile);
                window.localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(profile));
            })
            .catch(() => {
                if (cancelled) return;
                clearStoredAuth();
                setUser(null);
            })
            .finally(() => {
                if (!cancelled) {
                    setChecking(false);
                }
            });

        return () => {
            cancelled = true;
        };
    }, []);

    const resetFormState = () => {
        setFormError(null);
        setFormBusy(false);
        setEmail('');
        setPassword('');
        setAuthMode('login');
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setFormError(null);
        setFormBusy(true);

        const normalizedEmail = email.trim();

        try {
            const authFn = authMode === 'login' ? loginRequest : registerRequest;
            const result = await authFn(normalizedEmail, password);

            if (typeof window !== 'undefined') {
                window.localStorage.setItem(TOKEN_STORAGE_KEY, result.token);
                window.localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(result.user));
            }

            setUser(result.user);
            resetFormState();
            setDialogOpen(false);

            // Redirect to dashboard after successful auth
            navigate('/dashboard');
        } catch (error) {
            setFormError(
                error instanceof Error
                    ? error.message
                    : authMode === 'login'
                        ? 'Unable to sign in'
                        : 'Unable to create an account'
            );
        } finally {
            setFormBusy(false);
        }
    };

    const handleLogout = async () => {
        if (typeof window !== 'undefined') {
            const token = window.localStorage.getItem(TOKEN_STORAGE_KEY);
            if (token) {
                await logoutRequest(token);
            }
        }

        clearStoredAuth();
        setUser(null);
    };

    return (
        <header className="absolute inset-x-0 top-0 z-50">
            <nav aria-label="Global" className="flex items-center justify-between p-6 lg:px-8">
                <div className="flex lg:flex-1">
                    <a href="/" className="-m-1.5 p-1.5">
                        <span className="text-2xl font-bold text-indigo-500">VibeCode</span>
                    </a>
                </div>

                <div className="hidden lg:flex lg:gap-x-12">
                    {navigation.map((item) => (
                        <a key={item.name} href={item.href} className="text-sm/6 font-semibold text-white">
                            {item.name}
                        </a>
                    ))}
                </div>

                <div className="hidden lg:flex lg:flex-1 lg:justify-end">
                    {checking ? (
                        <span className="text-sm/6 font-semibold text-white/70">…</span>
                    ) : user ? (
                        onHomePage ? (
                            // Logged in AND on home page → only show Dashboard button
                            <Button
                                variant="ghost"
                                className="text-sm font-semibold text-white hover:bg-white/10 hover:text-white"
                                type="button"
                                onClick={() => navigate('/dashboard')}
                            >
                                Dashboard
                            </Button>
                        ) : (
                            // Logged in on other pages → show email + Sign Out
                            <div className="flex items-center gap-4">
                                <span className="text-sm font-semibold text-white">{user.email}</span>
                                <Button
                                    variant="ghost"
                                    className="text-sm font-semibold text-white hover:bg-white/10 hover:text-white"
                                    onClick={handleLogout}
                                    type="button"
                                >
                                    Sign Out
                                </Button>
                            </div>
                        )
                    ) : (
                        // Not logged in → Sign In / Create Account dialog
                        <Dialog
                            open={dialogOpen}
                            onOpenChange={(open) => {
                                setDialogOpen(open);
                                if (!open) {
                                    resetFormState();
                                }
                            }}
                        >
                            <DialogTrigger asChild>
                                <Button
                                    variant="ghost"
                                    className="text-sm font-semibold text-white hover:bg-white/10 hover:text-white"
                                    type="button"
                                >
                                    Sign In
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="bg-gray-900 text-white border border-gray-700/70 shadow-2xl sm:max-w-[420px] outline-none focus-visible:outline-none">
                                <DialogHeader>
                                    <DialogTitle>
                                        {authMode === 'login' ? 'Sign in to VibeCode' : 'Create your VibeCode account'}
                                    </DialogTitle>
                                    <DialogDescription className="text-gray-400">
                                        {authMode === 'login'
                                            ? 'Use the credentials you created during onboarding.'
                                            : 'Enter your email and a strong password to get started.'}
                                    </DialogDescription>
                                </DialogHeader>
                                <form className="space-y-4" onSubmit={handleSubmit}>
                                    <div className="space-y-2">
                                        <Label htmlFor="email">Email</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            value={email}
                                            onChange={(event) => setEmail(event.target.value)}
                                            placeholder="you@example.com"
                                            disabled={formBusy}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="password">Password</Label>
                                        <Input
                                            id="password"
                                            type="password"
                                            value={password}
                                            onChange={(event) => setPassword(event.target.value)}
                                            placeholder="********"
                                            disabled={formBusy}
                                            required
                                        />
                                        <p className="text-xs text-gray-500">
                                            {authMode === 'register'
                                                ? 'Password must be at least 8 characters.'
                                                : 'Keep your credentials secure.'}
                                        </p>
                                    </div>
                                    {formError && <p className="text-sm text-red-400">{formError}</p>}
                                    <DialogFooter className="flex flex-col gap-3">
                                        <Button type="submit" className="w-full" disabled={formBusy || !canSubmit}>
                                            {formBusy && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                            {authMode === 'login' ? 'Sign In' : 'Create Account'}
                                        </Button>
                                        <p className="text-xs text-gray-400 text-center">
                                            {authMode === 'login' ? (
                                                <>
                                                    Don&apos;t have an account?{' '}
                                                    <button
                                                        type="button"
                                                        className="text-indigo-400 hover:underline"
                                                        onClick={() => {
                                                            setFormError(null);
                                                            setAuthMode('register');
                                                        }}
                                                    >
                                                        Create one
                                                    </button>
                                                </>
                                            ) : (
                                                <>
                                                    Already have an account?{' '}
                                                    <button
                                                        type="button"
                                                        className="text-indigo-400 hover:underline"
                                                        onClick={() => {
                                                            setFormError(null);
                                                            setAuthMode('login');
                                                        }}
                                                    >
                                                        Sign in
                                                    </button>
                                                </>
                                            )}
                                        </p>
                                    </DialogFooter>
                                </form>
                            </DialogContent>
                        </Dialog>
                    )}
                </div>
            </nav>
        </header>
    );
}