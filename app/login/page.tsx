'use client';

import Image from 'next/image';
import { useState } from 'react';
import { jysSectionTheme } from '@/lib/theme/jys-components';

export default function LoginPage() {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [keepSignedIn, setKeepSignedIn] = useState(false);
  const [agree, setAgree] = useState(false);
  const [loginForm, setLoginForm] = useState({
    email: '',
    password: '',
  });
  const [signupForm, setSignupForm] = useState({
    fullname: '',
    email: '',
    password: '',
    confirmPassword: '',
    referral: '',
  });

  const onChangeLogin = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginForm(prev => ({ ...prev, [name]: value }));
  };
  const onChangeSignup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSignupForm(prev => ({ ...prev, [name]: value }));
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === 'login') {
      console.log('Login submit:', { ...loginForm, keepSignedIn });
    } else {
      console.log('Signup submit:', { ...signupForm, agree });
    }
    // TODO: Nanti integrasi sama auth aseli
  };

  return (
    <section className="min-h-screen w-full bg-white">
      <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
        {/* Panel Gambar (selalu di kiri) */}
        <div className="relative hidden bg-pink-500 lg:block">
          <Image
            src="/img/programhighlight1.jpg"
            alt="Japan Youth Summit Highlight"
            fill
            priority
            className="object-cover"
            sizes="(min-width: 1024px) 50vw, 0px"
          />
          <div className="absolute inset-0 bg-pink-500/60" />
          <div className="relative z-10 flex h-full flex-col px-10 py-10 text-white">
            <div className="space-y-4">
              <Image
                src="/img/jysfooters.png"
                alt="Japan Youth Summit"
                width={120}
                height={40}
                className="h-10 w-auto"
              />
              <div className="max-w-sm space-y-3">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-pink-100">
                  Japan Youth Summit 2026
                </p>
                <h2 className="text-3xl font-extrabold leading-tight sm:text-4xl">
                  Raise your hand,
                  <br />
                  Be the future leaders.
                </h2>
                <p className="text-sm text-pink-50">
                  Join our global youth community and access your dashboard to manage your
                  application and participation.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Panel Form (selalu di kanan) */}
        <div className="flex items-center justify-start px-6 py-10 lg:px-20 lg:py-0">
          <div className="w-full max-w-xl">
            <div>
              <h1 className="text-2xl font-extrabold tracking-tight text-pink-600 sm:text-3xl">
                {mode === 'login' ? 'Welcome back!' : 'Create your account'}
              </h1>
            </div>
            <p className="mt-2 text-sm text-slate-600">
              {mode === 'login'
                ? 'Sign in to continue and manage your application.'
                : 'Fill in your details below to start your journey.'}
            </p>

            <form onSubmit={onSubmit} className="mt-6 space-y-4">
              {mode === 'login' ? (
                <>
                  <div className="space-y-4 rounded-2xl border border-slate-100 bg-white/80 p-6 shadow-sm">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wide text-slate-700">
                        Email
                      </label>
                      <input
                        name="email"
                        value={loginForm.email}
                        onChange={onChangeLogin}
                        type="email"
                        required
                        className={jysSectionTheme.login.input}
                        placeholder="you@example.com"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wide text-slate-700">
                        Password
                      </label>
                      <input
                        name="password"
                        value={loginForm.password}
                        onChange={onChangeLogin}
                        type="password"
                        required
                        className={jysSectionTheme.login.input}
                        placeholder="••••••••"
                      />
                    </div>
                    <div className="flex items-center justify-between text-xs text-slate-600">
                      <label className="inline-flex items-center gap-2">
                        <input
                          type="checkbox"
                          className={jysSectionTheme.login.checkbox}
                          checked={keepSignedIn}
                          onChange={e => setKeepSignedIn(e.target.checked)}
                        />
                        Keep me signed in
                      </label>
                      <a href="#" className={jysSectionTheme.login.forgotPasswordLink}>
                        Forgot Password?
                      </a>
                    </div>
                    <div className="pt-2">
                      <button type="submit" className={jysSectionTheme.login.primaryButton}>
                        Login
                      </button>
                    </div>
                  </div>
                  <p className="text-xs text-slate-600">
                    Don't have an account?{' '}
                    <button
                      type="button"
                      onClick={() => setMode('signup')}
                      className={jysSectionTheme.login.switchModeLink}
                    >
                      Sign up for free
                    </button>
                  </p>
                </>
              ) : (
                <>
                  <div className="space-y-4 rounded-2xl border border-slate-100 bg-white/80 p-6 shadow-sm">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wide text-slate-700">
                        Fullname
                      </label>
                      <input
                        name="fullname"
                        value={signupForm.fullname}
                        onChange={onChangeSignup}
                        type="text"
                        required
                        className={jysSectionTheme.login.input}
                        placeholder="Hilmi Farrel Firjatullah"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wide text-slate-700">
                        Email
                      </label>
                      <input
                        name="email"
                        value={signupForm.email}
                        onChange={onChangeSignup}
                        type="email"
                        required
                        className={jysSectionTheme.login.input}
                        placeholder="hilmi123@example.com"
                      />
                    </div>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wide text-slate-700">
                          Password
                        </label>
                        <input
                          name="password"
                          value={signupForm.password}
                          onChange={onChangeSignup}
                          type="password"
                          required
                          className={jysSectionTheme.login.input}
                          placeholder="••••••••"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wide text-slate-700">
                          Confirm Password
                        </label>
                        <input
                          name="confirmPassword"
                          value={signupForm.confirmPassword}
                          onChange={onChangeSignup}
                          type="password"
                          required
                          className={jysSectionTheme.login.input}
                          placeholder="••••••••"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wide text-slate-700">
                        Referral Code (Optional)
                      </label>
                      <input
                        name="referral"
                        value={signupForm.referral}
                        onChange={onChangeSignup}
                        type="text"
                        className={jysSectionTheme.login.input}
                        placeholder="ABC-123"
                      />
                    </div>
                    <label className="mt-1 inline-flex items-center gap-2 text-xs text-slate-600">
                      <input
                        type="checkbox"
                        className={jysSectionTheme.login.checkbox}
                        checked={agree}
                        onChange={e => setAgree(e.target.checked)}
                        required
                      />
                      I agree to the{' '}
                      <a href="#" className="underline">
                        Terms of Service
                      </a>
                      and{' '}
                      <a href="#" className="underline">
                        Privacy Policy
                      </a>
                    </label>
                    <div className="pt-2">
                      <button type="submit" className={jysSectionTheme.login.primaryButton}>
                        Create Account
                      </button>
                    </div>
                  </div>
                  <p className="text-xs text-slate-600">
                    Already have an account?{' '}
                    <button
                      type="button"
                      onClick={() => setMode('login')}
                      className={jysSectionTheme.login.switchModeLink}
                    >
                      Log in
                    </button>
                  </p>
                </>
              )}
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
