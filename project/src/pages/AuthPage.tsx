import { useState } from 'react';
import {
  AlertTriangle,
  ArrowRight,
  BarChart3,
  Eye,
  EyeOff,
  Landmark,
  LockKeyhole,
  Mail,
  MapPin,
  UserRound,
} from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { useToast } from '@/lib/toast';
import type { Route } from '@/lib/router';

export function AuthPage({ navigate }: { navigate: (r: Route) => void }) {
  const { login, signup, loginAsGuest } = useAuth();
  const { show } = useToast();

  const [mode, setMode] = useState<'login' | 'signup' | 'forgot'>('login');
  const [form, setForm] = useState({
    name: '',
    email: '',
    mobile: '',
    password: '',
    confirm: '',
    remember: false,
  });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const set = (k: keyof typeof form, v: string | boolean) =>
    setForm((f) => ({ ...f, [k]: v }));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setBusy(true);

    if (mode === 'forgot') {
      if (!form.email.includes('@')) {
        setError('Enter a valid email address.');
        setBusy(false);
        return;
      }

      show('Password reset link sent to your email (demo flow).');
      setMode('login');
      setBusy(false);
      return;
    }

    if (mode === 'signup') {
      if (!form.name.trim()) {
        setError('Please enter your full name.');
        setBusy(false);
        return;
      }

      if (!form.email.includes('@')) {
        setError('Please enter a valid email address.');
        setBusy(false);
        return;
      }

      if (!/^[0-9+\-\s]{10,15}$/.test(form.mobile)) {
        setError('Please enter a valid mobile number.');
        setBusy(false);
        return;
      }

      if (form.password.length < 6) {
        setError('Password must be at least 6 characters.');
        setBusy(false);
        return;
      }

      if (form.password !== form.confirm) {
        setError('Passwords do not match.');
        setBusy(false);
        return;
      }

      const res = signup(
        form.name.trim(),
        form.email.trim(),
        form.mobile.trim(),
        form.password
      );

      if (!res.ok) {
        setError(res.error ?? 'Sign up failed.');
        setBusy(false);
        return;
      }

      show('Welcome to Nagpur Saathi!');
      navigate('home');
      setBusy(false);
      return;
    }

    if (!form.email.trim()) {
      setError('Please enter your email or mobile.');
      setBusy(false);
      return;
    }

    if (form.password.length < 1) {
      setError('Please enter your password.');
      setBusy(false);
      return;
    }

    const res = login(form.email.trim(), form.password);

    if (!res.ok) {
      setError(res.error ?? 'Login failed.');
      setBusy(false);
      return;
    }

    show('Welcome back!');
    navigate('home');
    setBusy(false);
  };

  return (
    <div className="min-h-screen bg-white lg:grid lg:grid-cols-[53%_47%]">
      {/* LEFT SIDE */}
      <section className="relative hidden min-h-screen overflow-hidden bg-[#edf8ff] px-10 py-10 text-navy-900 lg:flex lg:flex-col xl:px-16">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_72%_10%,rgba(124,205,255,0.28),transparent_28%),linear-gradient(135deg,rgba(255,255,255,0.74),transparent_58%)]" />

        <div className="relative z-10 flex items-start justify-between gap-5">
          <div className="flex items-center gap-3">
            <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-navy-700 text-white shadow-lg shadow-navy-900/15">
              <Landmark size={29} strokeWidth={2.4} />
              <span className="absolute -top-1 right-1 h-2.5 w-2.5 rounded-full bg-saffron-500" />
            </div>

            <div>
              <p className="text-[27px] font-extrabold leading-none tracking-tight text-navy-800">
                Nagpur Saathi
              </p>
              <p className="mt-2 text-sm font-medium text-navy-700">
                Report · Track · Build a Better Nagpur
              </p>
            </div>
          </div>

          <div className="hidden items-center gap-2 text-[11px] font-semibold text-navy-400 xl:flex">
            <span>Nagpur</span>
            <span>|</span>
            <span>Cleaner</span>
            <span>|</span>
            <span>Safer</span>
            <span>|</span>
            <span>Stronger</span>
          </div>
        </div>

        <div className="relative z-10 mt-20 max-w-xl xl:mt-24">
          <p className="text-[27px] font-medium leading-tight text-navy-800">
            Together for a
          </p>

          <h1 className="mt-1 font-display text-[42px] font-extrabold leading-tight tracking-tight text-navy-800 xl:text-5xl">
            Smarter, Safer Nagpur
          </h1>

          <p className="mt-5 max-w-md text-base leading-6 text-navy-700">
            Report civic issues, get real-time updates, and help us build a
            cleaner, safer and more developed Nagpur.
          </p>

          <div className="mt-7 grid max-w-lg grid-cols-3 gap-5">
            {[
              {
                icon: AlertTriangle,
                title: 'Report',
                text: 'Potholes, garbage, streetlights & more',
                tone: 'bg-orange-100 text-orange-700',
              },
              {
                icon: MapPin,
                title: 'Track',
                text: 'Live updates with location',
                tone: 'bg-emerald-100 text-emerald-700',
              },
              {
                icon: BarChart3,
                title: 'See Impact',
                text: 'Real data for a better Nagpur',
                tone: 'bg-cyan-100 text-cyan-700',
              },
            ].map(({ icon: Icon, title, text, tone }) => (
              <div key={title}>
                <span
                  className={`flex h-11 w-11 items-center justify-center rounded-full ${tone}`}
                >
                  <Icon size={23} />
                </span>

                <p className="mt-3 text-sm font-extrabold text-navy-800">
                  {title}
                </p>

                <p className="mt-1 text-xs leading-4 text-navy-600">
                  {text}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Cartoon / city illustration removed */}
      </section>

      {/* RIGHT SIDE - LOGIN */}
      <section className="flex min-h-screen items-center justify-center bg-white px-5 py-8 sm:px-10 lg:px-12 xl:px-20">
        <div className="w-full max-w-[520px]">
          <div className="mb-8 flex items-center gap-3 lg:hidden">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-navy-700 text-white">
              <Landmark size={23} />
            </div>

            <div>
              <p className="font-extrabold tracking-tight text-navy-800">
                Nagpur Saathi
              </p>
              <p className="text-[11px] text-navy-400">
                Report · Track · Build a Better Nagpur
              </p>
            </div>
          </div>

          <div className="rounded-[22px] border border-[#dce8f5] bg-white p-6 shadow-[0_18px_55px_rgba(24,74,137,0.08)] sm:p-9">
            <h2 className="font-display text-3xl font-extrabold tracking-tight text-navy-800">
              {mode === 'login'
                ? 'Welcome back'
                : mode === 'signup'
                  ? 'Create your account'
                  : 'Reset your password'}
            </h2>

            <p className="mt-3 text-base text-navy-600">
              {mode === 'login'
                ? 'Sign in to continue to Nagpur Saathi'
                : mode === 'signup'
                  ? 'Join the Nagpur Saathi community'
                  : 'Enter your email to receive a reset link'}
            </p>

            <form onSubmit={submit} className="mt-7 space-y-4">
              {mode === 'signup' && (
                <div>
                  <label className="label">Full Name</label>

                  <div className="relative">
                    <UserRound
                      size={19}
                      className="absolute left-4 top-3.5 text-navy-500"
                    />

                    <input
                      className="input h-14 pl-12"
                      value={form.name}
                      onChange={(e) => set('name', e.target.value)}
                      placeholder="Enter your full name"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="sr-only">
                  {mode === 'login'
                    ? 'Email or Mobile Number'
                    : 'Email Address'}
                </label>

                <div className="relative">
                  <Mail
                    size={20}
                    className="absolute left-4 top-4 text-navy-500"
                  />

                  <input
                    className="input h-14 pl-12 text-base"
                    value={form.email}
                    onChange={(e) => set('email', e.target.value)}
                    placeholder={
                      mode === 'login'
                        ? 'Email or Mobile Number'
                        : 'Email Address'
                    }
                  />
                </div>
              </div>

              {mode === 'signup' && (
                <div>
                  <label className="label">Mobile Number</label>

                  <input
                    className="input h-14 text-base"
                    value={form.mobile}
                    onChange={(e) => set('mobile', e.target.value)}
                    placeholder="+91 90000 00000"
                  />
                </div>
              )}

              {mode !== 'forgot' && (
                <div>
                  <div className="relative">
                    <LockKeyhole
                      size={20}
                      className="absolute left-4 top-4 text-navy-500"
                    />

                    <input
                      type={showPassword ? 'text' : 'password'}
                      className="input h-14 pl-12 pr-12 text-base"
                      value={form.password}
                      onChange={(e) => set('password', e.target.value)}
                      placeholder="Password"
                    />

                    <button
                      type="button"
                      aria-label={
                        showPassword ? 'Hide password' : 'Show password'
                      }
                      onClick={() =>
                        setShowPassword((value) => !value)
                      }
                      className="absolute right-4 top-3.5 text-navy-500 transition hover:text-navy-800"
                    >
                      {showPassword ? (
                        <EyeOff size={20} />
                      ) : (
                        <Eye size={20} />
                      )}
                    </button>
                  </div>

                  {mode === 'login' && (
                    <div className="mt-3 flex justify-end">
                      <button
                        type="button"
                        onClick={() => {
                          setMode('forgot');
                          setError('');
                        }}
                        className="text-sm font-semibold text-blue-600 hover:text-blue-800"
                      >
                        Forgot password?
                      </button>
                    </div>
                  )}
                </div>
              )}

              {mode === 'signup' && (
                <div>
                  <label className="label">Confirm Password</label>

                  <input
                    type="password"
                    className="input h-14"
                    value={form.confirm}
                    onChange={(e) => set('confirm', e.target.value)}
                    placeholder="Re-enter your password"
                  />
                </div>
              )}

              {error && (
                <p className="rounded-xl border border-red-100 bg-red-50 px-3.5 py-3 text-sm font-medium text-red-600">
                  {error}
                </p>
              )}

              <button
                type="submit"
                className="btn-primary h-14 w-full rounded-xl bg-[#245da4] text-base shadow-lg shadow-blue-900/15 hover:bg-[#194d8c]"
                disabled={busy}
              >
                {busy ? (
                  'Please wait...'
                ) : mode === 'login' ? (
                  <>
                    <span>Sign In</span>
                    <ArrowRight size={20} />
                  </>
                ) : mode === 'signup' ? (
                  'Create Account'
                ) : (
                  'Send Reset Link'
                )}
              </button>
            </form>

            {mode === 'login' && (
              <div className="mt-6">
                <div className="flex items-center gap-3 text-xs font-semibold text-navy-400">
                  <div className="h-px flex-1 bg-navy-100" />
                  <span>OR</span>
                  <div className="h-px flex-1 bg-navy-100" />
                </div>

                <button
                  onClick={() => {
                    loginAsGuest();
                    show('You are continuing as a guest.');
                    navigate('home');
                  }}
                  className="btn-ghost mt-5 h-14 w-full border-[#cbdcef] text-base text-navy-800"
                >
                  <UserRound size={20} />
                  Continue as Guest
                </button>
              </div>
            )}

            <p className="mt-8 text-center text-sm text-navy-600">
              {mode === 'login'
                ? 'New to Nagpur Saathi? '
                : mode === 'signup'
                  ? 'Already have an account? '
                  : 'Remembered your password? '}

              <button
                onClick={() => {
                  setMode(mode === 'login' ? 'signup' : 'login');
                  setError('');
                }}
                className="font-bold text-blue-600 transition hover:text-blue-800"
              >
                {mode === 'login' ? 'Create an account' : 'Sign in'}
              </button>
            </p>
          </div>

          <p className="mt-6 text-center text-xs text-navy-400">
            One platform for a smarter, safer Nagpur
          </p>
        </div>
      </section>
    </div>
  );
}
