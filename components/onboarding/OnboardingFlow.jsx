'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { api } from '@/lib/api';
import {
  BookOpen, Swords, Trophy, Coins,
  Sparkles, Lock, ChevronLeft, Check,
  Gift,
} from 'lucide-react';
import { FaGooglePlay } from 'react-icons/fa';

const PS_URL = 'https://play.google.com/store/apps/details?id=com.nextmcq.app';

const DOT_DARK = {
  backgroundImage: 'radial-gradient(rgba(29,78,216,0.15) 1px, transparent 1px)',
  backgroundSize: '24px 24px',
};

/* ── Left Panel Phone ──────────────────────────────────────────── */
function LeftPanelPhone() {
  return (
    <div className="relative mx-auto" style={{ width: 160 }}>
      <div className="absolute -left-[3px] top-[48px] w-[3px] h-[18px] bg-indigo-800 rounded-l-sm" />
      <div className="absolute -left-[3px] top-[76px] w-[3px] h-[18px] bg-indigo-800 rounded-l-sm" />
      <div className="absolute -right-[3px] top-[58px] w-[3px] h-[28px] bg-indigo-800 rounded-r-sm" />
      <div className="bg-gray-800 rounded-[1.9rem] p-[6px] shadow-xl shadow-black/40"
        style={{ boxShadow: '0 40px 80px -12px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.07)' }}>
        <div className="relative rounded-[1.5rem] overflow-hidden" style={{ aspectRatio: '9/19.5' }}>
          <img src="/unnamed.webp" alt="NextMCQ app" className="absolute inset-0 w-full h-full object-cover object-top" />
        </div>
      </div>
    </div>
  );
}

/* ── Left Panel ────────────────────────────────────────────────── */
function LeftPanel() {
  return (
    <div className="hidden lg:flex lg:w-[44%] bg-[#030712] flex-col justify-between p-12 relative overflow-hidden" style={DOT_DARK}>
      <div className="absolute inset-0 pointer-events-none opacity-[0.07]"
        style={{ backgroundImage: 'radial-gradient(#a5b4fc 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.18) 0%, transparent 70%)' }} />

      {/* Phone mockup */}
      <div className="relative z-10 flex justify-center">
        <LeftPanelPhone />
      </div>

      {/* Feature list */}
      <div className="relative z-10">
        <div className="inline-flex items-center gap-2 bg-amber-400/10 border border-amber-400/20 text-amber-400 text-xs font-medium px-3 py-1.5 rounded-full mb-5">
          <Gift className="w-3.5 h-3.5" />
          You were invited!
        </div>
        <h2 className="text-2xl font-medium text-white leading-snug mb-3">
          Your friend wants you on NextMCQ
        </h2>
        <p className="text-indigo-300/70 text-sm leading-relaxed mb-6">
          Complete your profile, claim your bonus coins, then download the app.
        </p>
        <ul className="space-y-3">
          {[
            [BookOpen, 'Practice MCQs for Class 10, 11 & 12'],
            [Swords, '1v1 real-time battles with friends'],
            [Trophy, 'Global & class-wise leaderboards'],
            [Coins, 'Earn coins and XP for every test'],
          ].map(([Icon, txt]) => (
            <li key={txt} className="flex items-center gap-3">
              <div className="w-7 h-7 bg-white/5 border border-white/10 rounded-lg grid place-items-center shrink-0">
                <Icon className="w-3.5 h-3.5 text-indigo-300" />
              </div>
              <p className="text-indigo-200/80 text-sm">{txt}</p>
            </li>
          ))}
        </ul>
      </div>

      <p className="text-indigo-900 text-xs relative z-10">Android · Free · No subscription</p>
    </div>
  );
}

/* ── OTP Boxes ─────────────────────────────────────────────────── */
function OtpBoxes({ value, onChange, disabled }) {
  const refs = useRef([]);
  const handleChange = (e, i) => {
    const ch = e.target.value.replace(/\D/g, '').slice(-1);
    const arr = value.padEnd(6, ' ').split('');
    arr[i] = ch || ' ';
    const next = arr.join('').trimEnd();
    onChange(next);
    if (ch && i < 5) refs.current[i + 1]?.focus();
  };
  const handleKeyDown = (e, i) => {
    if (e.key === 'Backspace') {
      if (!value[i] || value[i] === ' ') { if (i > 0) refs.current[i - 1]?.focus(); }
      else {
        const arr = value.padEnd(6, ' ').split('');
        arr[i] = ' '; onChange(arr.join('').trimEnd());
      }
    }
  };
  const handlePaste = (e) => {
    e.preventDefault();
    const p = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    onChange(p);
    refs.current[Math.min(p.length, 5)]?.focus();
  };
  return (
    <div className="flex gap-2.5 justify-center">
      {Array(6).fill(0).map((_, i) => (
        <input key={i} ref={el => refs.current[i] = el}
          type="text" inputMode="numeric" maxLength={1}
          value={value[i] && value[i] !== ' ' ? value[i] : ''}
          onChange={e => handleChange(e, i)}
          onKeyDown={e => handleKeyDown(e, i)}
          onPaste={handlePaste} disabled={disabled}
          className={`otp-box ${value[i] && value[i] !== ' ' ? 'filled' : ''} disabled:opacity-40`} />
      ))}
    </div>
  );
}

/* ── Progress Bar ──────────────────────────────────────────────── */
const STEPS = ['email', 'otp', 'profile'];
function ProgressBar({ step }) {
  const idx = STEPS.indexOf(step);
  const pct = idx < 0 ? 0 : ((idx + 1) / STEPS.length) * 100;
  const labels = { email: 'Verify email', otp: 'Enter code', profile: 'Your profile' };
  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-2.5">
        <p className="text-xs text-gray-400 font-medium">{labels[step] || ''}</p>
        <p className="text-xs text-gray-500">{STEPS.indexOf(step) + 1} of 3</p>
      </div>
      <div className="h-1 bg-white/10 rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all duration-500"
          style={{ width: `${pct}%`, background: 'linear-gradient(90deg, #6366f1 0%, #7c3aed 100%)' }} />
      </div>
    </div>
  );
}

/* ── Spinner ───────────────────────────────────────────────────── */
function Spinner() {
  return (
    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  );
}

/* ── Primary Button ────────────────────────────────────────────── */
function PrimaryBtn({ onClick, disabled, loading, children }) {
  return (
    <button onClick={onClick} disabled={disabled || loading}
      className="w-full text-white py-3.5 rounded-xl font-medium text-[15px] transition-all active:scale-[.98] disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-sm"
      style={{ background: 'linear-gradient(135deg, #6366f1 0%, #7c3aed 100%)' }}>
      {loading && <Spinner />}{children}
    </button>
  );
}

/* ── Back Button ───────────────────────────────────────────────── */
function BackBtn({ onClick }) {
  return (
    <button onClick={onClick} className="flex items-center gap-1.5 text-gray-500 hover:text-white text-sm font-medium mb-7 transition-colors">
      <ChevronLeft className="w-4 h-4" />
      Back
    </button>
  );
}

/* ── Error Box ─────────────────────────────────────────────────── */
function ErrBox({ msg }) {
  if (!msg) return null;
  return (
    <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-xl px-4 py-3 mb-4">{msg}</div>
  );
}

/* ── Field ─────────────────────────────────────────────────────── */
function Field({ label, badge, children }) {
  return (
    <div className="mb-5">
      <div className="flex items-center gap-2 mb-2">
        <label className="text-sm font-medium text-gray-300">{label}</label>
        {badge}
      </div>
      {children}
    </div>
  );
}

/* ── Step: Welcome ─────────────────────────────────────────────── */
function WelcomeStep({ code, onNext }) {
  return (
    <div className="step-in">

      {/* Play Store style app header */}
      <div className="flex items-center gap-4 mb-7 p-4 rounded-2xl border border-white/10 bg-white/5">
        <div className="w-16 h-16 rounded-2xl overflow-hidden shadow-md ring-1 ring-white/10 shrink-0 bg-white">
          <Image src="/nextmcq-logo.png" alt="NextMCQ" width={64} height={64} className="w-full h-full object-contain" />
        </div>
        <div className="min-w-0">
          <p className="text-lg font-bold text-white leading-tight">NextMCQ</p>
          <p className="text-sm text-gray-400 mt-0.5">MCQ Practice for Boards & School</p>
          <div className="flex items-center gap-2 mt-1.5">
            <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">Free</span>
            <span className="text-[11px] text-gray-500">Class 10 · 11 · 12</span>
          </div>
        </div>
      </div>

      <h1 className="text-2xl font-semibold text-white mb-2 text-center">You've been invited!</h1>
      <p className="text-gray-400 text-sm leading-relaxed mb-7 max-w-xs mx-auto text-center">
        A friend invited you to join <span className="font-semibold text-indigo-400">NextMCQ</span>. Complete your profile to claim your bonus coins.
      </p>

      <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-4 mb-6 flex items-center gap-4">
        <div className="w-11 h-11 bg-amber-500/20 rounded-xl grid place-items-center shrink-0">
          <Coins className="w-5 h-5 text-amber-400" />
        </div>
        <div>
          <p className="font-semibold text-amber-200 text-sm">Bonus coins waiting</p>
          <p className="text-amber-400 text-xs mt-0.5">Claim by completing your profile below</p>
        </div>
      </div>

      <p className="text-xs text-gray-500 mb-7 text-center">
        Referral code:{' '}
        <span className="font-mono font-semibold text-gray-200 bg-white/10 px-2 py-0.5 rounded">{code}</span>
      </p>

      <PrimaryBtn onClick={onNext}>Get Started →</PrimaryBtn>
      <p className="text-xs text-gray-500 mt-4 text-center">Takes less than 2 minutes</p>
    </div>
  );
}

/* ── Step: Email ───────────────────────────────────────────────── */
function EmailStep({ email, setEmail, onNext, loading, error }) {
  return (
    <div className="step-in">
      <h2 className="text-2xl font-semibold text-white mb-1">Enter your email</h2>
      <p className="text-gray-400 text-sm mb-7">We'll send a 6-digit code — no password needed.</p>

      <Field label="Email address">
        <input type="email" value={email} onChange={e => setEmail(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && onNext()} placeholder="you@example.com"
          disabled={loading}
          className="w-full border border-white/20 bg-white/6 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/20 rounded-xl px-4 py-3.5 text-white placeholder-white/30 outline-none transition-all disabled:opacity-50 text-sm" />
        {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
      </Field>

      <PrimaryBtn onClick={onNext} disabled={!email.trim()} loading={loading}>
        {!loading && 'Send Code →'}
      </PrimaryBtn>
    </div>
  );
}

/* ── Step: OTP ─────────────────────────────────────────────────── */
function OtpStep({ email, otp, setOtp, onNext, onBack, loading, error }) {
  return (
    <div className="step-in">
      <BackBtn onClick={onBack} />
      <h2 className="text-2xl font-semibold text-white mb-1">Check your email</h2>
      <p className="text-gray-400 text-sm mb-1">6-digit code sent to</p>
      <p className="text-indigo-400 font-medium text-sm mb-7">{email}</p>

      <OtpBoxes value={otp} onChange={setOtp} disabled={loading} />
      {error && <p className="text-red-400 text-sm mt-3 text-center">{error}</p>}

      <div className="mt-6">
        <PrimaryBtn onClick={onNext} disabled={otp.replace(/ /g, '').length < 6} loading={loading}>
          {!loading && 'Verify →'}
        </PrimaryBtn>
      </div>
      <p className="text-xs text-gray-500 text-center mt-4">
        Didn't get it?{' '}
        <button className="text-indigo-400 font-medium hover:underline">Resend code</button>
      </p>
    </div>
  );
}

/* ── Step: Profile ─────────────────────────────────────────────── */
const CLASSES = [{ v: '10', l: 'Class 10' }, { v: '11', l: 'Class 11' }, { v: '12', l: 'Class 12' }];
const SEMESTERS = {
  '11': [{ v: '1', l: 'Sem 1' }, { v: '2', l: 'Sem 2' }],
  '12': [{ v: '3', l: 'Sem 3' }, { v: '4', l: 'Sem 4' }],
};

function ProfileStep({ form, setForm, code, onSubmit, loading, error }) {
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const sems = form.class ? SEMESTERS[form.class] : null;

  return (
    <div className="step-in">
      <h2 className="text-2xl font-semibold text-white mb-1">Complete your profile</h2>
      <p className="text-gray-400 text-sm mb-7">Almost there — just a few details.</p>

      <Field label="Full name">
        <input type="text" value={form.name} onChange={e => set('name', e.target.value)}
          placeholder="Your full name" disabled={loading}
          className="w-full border border-white/20 bg-white/6 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/20 rounded-xl px-4 py-3.5 text-white placeholder-white/30 outline-none transition-all disabled:opacity-50 text-sm" />
      </Field>

      <Field label="I am a">
        <div className="grid grid-cols-2 gap-3">
          {['student', 'teacher'].map(r => (
            <button key={r} onClick={() => set('role', r)} disabled={loading}
              className={`py-3 rounded-xl border font-medium capitalize text-sm transition-all ${
                form.role === r
                  ? 'border-indigo-400 bg-indigo-500/20 text-indigo-300'
                  : 'border-white/20 text-gray-400 hover:border-white/30 bg-white/5'
              }`}>
              {r === 'student' ? '🎓 Student' : '👨‍🏫 Teacher'}
            </button>
          ))}
        </div>
      </Field>

      {form.role === 'student' && (
        <>
          <Field label="Class" badge={<span className="text-[10px] text-gray-500 font-normal">optional</span>}>
            <div className="flex gap-2">
              {CLASSES.map(c => (
                <button key={c.v} onClick={() => {
                  const same = form.class === c.v;
                  set('class', same ? null : c.v);
                  if (!same) set('semester', c.v === '11' ? '1' : '3');
                }} disabled={loading}
                  className={`flex-1 py-2.5 rounded-xl border text-sm font-medium transition-all ${
                    form.class === c.v
                      ? 'border-indigo-400 bg-indigo-500/20 text-indigo-300'
                      : 'border-white/20 text-gray-400 hover:border-white/30 bg-white/5'
                  }`}>
                  {c.l}
                </button>
              ))}
            </div>
          </Field>

          {sems && (
            <Field label="Semester">
              <div className="flex gap-2">
                {sems.map(s => (
                  <button key={s.v} onClick={() => set('semester', s.v)} disabled={loading}
                    className={`flex-1 py-2.5 rounded-xl border text-sm font-medium transition-all ${
                      form.semester === s.v
                        ? 'border-indigo-400 bg-indigo-500/20 text-indigo-300'
                        : 'border-white/20 text-gray-400 hover:border-white/30 bg-white/5'
                    }`}>
                    {s.l}
                  </button>
                ))}
              </div>
            </Field>
          )}
        </>
      )}

      <Field label="Referral code"
        badge={<span className="text-[10px] font-semibold bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full">Auto-applied</span>}>
        <div className="relative">
          <input readOnly value={code}
            className="w-full border border-amber-500/30 bg-amber-500/10 rounded-xl px-4 py-3.5 font-mono font-semibold text-amber-300 tracking-widest cursor-not-allowed pr-10 text-sm" />
          <div className="absolute right-3.5 top-1/2 -translate-y-1/2">
            <Lock className="w-4 h-4 text-amber-500" />
          </div>
        </div>
        <p className="text-amber-400 text-xs mt-1.5">Bonus coins will be credited automatically.</p>
      </Field>

      <ErrBox msg={error} />
      <PrimaryBtn onClick={onSubmit} disabled={!form.name.trim()} loading={loading}>
        {!loading && 'Complete Profile →'}
      </PrimaryBtn>
    </div>
  );
}

/* ── Step: Success ─────────────────────────────────────────────── */
function SuccessStep({ name }) {
  const firstName = name ? name.split(' ')[0] : null;

  return (
    <div className="step-in text-center">

      {/* Hero icon */}
      <div className="relative inline-flex items-center justify-center mb-6">
        <div className="absolute inset-0 rounded-full blur-2xl scale-150 opacity-30"
          style={{ background: 'radial-gradient(circle, #6366f1, #7c3aed)' }} />
        <div className="relative w-24 h-24 rounded-3xl grid place-items-center shadow-2xl"
          style={{ background: 'linear-gradient(135deg, #6366f1 0%, #7c3aed 100%)' }}>
          <span className="text-5xl select-none">🎉</span>
        </div>
        <div className="absolute -bottom-2 -right-2 w-9 h-9 bg-emerald-500 rounded-2xl grid place-items-center shadow-lg ring-2 ring-[#030712]">
          <Check className="w-5 h-5 text-white" strokeWidth={3} />
        </div>
      </div>

      {/* Headline */}
      <h2 className="text-3xl font-bold text-white mb-4 tracking-tight">
        Your account is live 🚀
      </h2>

      {/* Sub-copy */}
      <p className="text-gray-400 text-sm max-w-[260px] mx-auto leading-relaxed mb-8">
        Your rewards are already waiting inside the app. Just download and sign in — it's all there.
      </p>

      {/* Reward hint pill — no amounts */}
      <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-medium px-4 py-2 rounded-full mb-8">
        <span>🪙</span>
        <span>Coins &amp; bonuses added to your account</span>
        <span>✓</span>
      </div>

      {/* CTA */}
      <a href={PS_URL} target="_blank" rel="noopener noreferrer"
        className="ps-btn text-white w-full justify-center mb-3 text-[15px] py-4 shadow-lg shadow-indigo-500/30"
        style={{ background: 'linear-gradient(135deg, #6366f1 0%, #7c3aed 100%)' }}>
        <FaGooglePlay className="w-5 h-5 shrink-0" />
        <span className="leading-none">
          <span className="block text-[9px] opacity-70 mb-[2px]">GET IT ON</span>
          <span className="block font-semibold">Google Play</span>
        </span>
      </a>
      <p className="text-xs text-gray-500">
        Sign in with <span className="font-medium text-gray-300">the same email</span> you used here
      </p>
    </div>
  );
}

/* ── Main ──────────────────────────────────────────────────────── */
export default function OnboardingFlow({ referralCode }) {
  const [step, setStep] = useState('welcome');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [form, setForm] = useState({ name: '', role: 'student', class: null, semester: '1' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [token, setToken] = useState(null);

  const sendOtp = async () => {
    if (!email.trim()) return;
    setError(''); setLoading(true);
    try {
      await api.post('/auth/send-otp', { email });
      setStep('otp');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async () => {
    if (otp.replace(/ /g, '').length < 6) return;
    setError(''); setLoading(true);
    try {
      const res = await api.post('/auth/verify-otp', { email, otp });
      setToken(res.data.token);
      setStep('profile');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const submit = async () => {
    if (!form.name.trim()) return;
    setError(''); setLoading(true);
    try {
      const payload = { name: form.name, role: form.role, referralCode: referralCode };
      if (form.class) { payload.class = form.class; payload.semester = form.semester; }
      await api.post('/auth/complete-onboarding', payload, token);
      setStep('success');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-[#030712]" style={DOT_DARK}>
      <LeftPanel />

      {/* Right panel */}
      <div className="flex-1 flex flex-col justify-center items-center px-6 py-12 min-h-screen">
        <div className="w-full max-w-md">
          {STEPS.includes(step) && <ProgressBar step={step} />}

          {step === 'welcome' && <WelcomeStep code={referralCode} onNext={() => setStep('email')} />}
          {step === 'email' && <EmailStep email={email} setEmail={setEmail} onNext={sendOtp} loading={loading} error={error} />}
          {step === 'otp' && <OtpStep email={email} otp={otp} setOtp={setOtp} onNext={verifyOtp} onBack={() => setStep('email')} loading={loading} error={error} />}
          {step === 'profile' && <ProfileStep form={form} setForm={setForm} code={referralCode} onSubmit={submit} loading={loading} error={error} />}
          {step === 'success' && <SuccessStep name={form.name} />}
        </div>
      </div>
    </div>
  );
}
