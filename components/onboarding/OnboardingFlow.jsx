'use client';

import { useState, useRef } from 'react';
import { api } from '@/lib/api';
import {
  BookOpen, Swords, Trophy, Coins,
  Sparkles, Lock, ChevronLeft, Check,
  Gift,
} from 'lucide-react';
import { FaGooglePlay } from 'react-icons/fa';

const PS_URL = 'https://play.google.com/store/apps/details?id=com.nextmcq.app';

/* ── Left Panel Phone ──────────────────────────────────────────── */
function LeftPanelPhone() {
  return (
    <div className="relative mx-auto" style={{ width: 160 }}>
      <div className="absolute -left-[3px] top-[48px] w-[3px] h-[18px] bg-indigo-800 rounded-l-sm" />
      <div className="absolute -left-[3px] top-[76px] w-[3px] h-[18px] bg-indigo-800 rounded-l-sm" />
      <div className="absolute -right-[3px] top-[58px] w-[3px] h-[28px] bg-indigo-800 rounded-r-sm" />
      <div className="bg-indigo-950 rounded-[1.9rem] p-[5px] shadow-xl shadow-black/40 ring-1 ring-indigo-900">
        <div className="rounded-[1.5rem] overflow-hidden bg-white" style={{ aspectRatio: '9/19.5' }}>
          <div className="h-[14px] bg-indigo-950 flex justify-center items-end pb-1">
            <div className="w-10 h-[8px] bg-indigo-900 rounded-b-[7px]" />
          </div>
          <div className="flex flex-col gap-1.5 px-2 pt-1.5 pb-2 bg-white h-full">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-[6px] text-gray-400">Good morning 👋</p>
                <p className="text-[9px] font-semibold text-gray-900">Saniya</p>
              </div>
              <div className="w-5 h-5 rounded-full bg-indigo-100 grid place-items-center">
                <span className="text-[7px] font-bold text-indigo-600">S</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-1">
              {[{ v: '1,250', l: 'Coins', c: 'text-amber-500', i: '🪙' }, { v: '#7', l: 'Rank', c: 'text-purple-500', i: '🏆' }].map(s => (
                <div key={s.l} className="bg-gray-50 border border-gray-100 rounded-md p-1 text-center">
                  <p className={`${s.c} font-semibold text-[8px]`}>{s.i} {s.v}</p>
                  <p className="text-gray-400 text-[6px]">{s.l}</p>
                </div>
              ))}
            </div>
            <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-md p-1.5 flex items-center gap-1">
              <span className="text-[10px]">⚔️</span>
              <div className="flex-1 min-w-0">
                <p className="text-white font-semibold text-[7px] leading-none">Battle Mode</p>
                <p className="text-orange-100 text-[6px] mt-0.5">Aryan challenged you!</p>
              </div>
              <div className="bg-white/25 rounded px-1 py-0.5">
                <p className="text-white text-[6px] font-bold">Accept</p>
              </div>
            </div>
            {[
              { i: '📚', t: 'Physics — Ch.4', s: '250 MCQs', bg: 'bg-blue-50 border-blue-100', c: 'text-blue-500' },
              { i: '🧪', t: 'Chemistry', s: 'Score: 82%', bg: 'bg-emerald-50 border-emerald-100', c: 'text-emerald-500' },
            ].map(c => (
              <div key={c.t} className={`${c.bg} border rounded-md p-1 flex items-center gap-1`}>
                <span className="text-[10px] shrink-0">{c.i}</span>
                <div>
                  <p className="text-gray-800 font-medium text-[7px] leading-none">{c.t}</p>
                  <p className={`${c.c} text-[6px] mt-0.5`}>{c.s}</p>
                </div>
              </div>
            ))}
            <div className="bg-amber-50 border border-amber-100 rounded-md p-1">
              <p className="text-amber-700 font-medium text-[7px]">🔥 Day 7 streak!</p>
              <div className="flex gap-0.5 mt-0.5">
                {Array.from({ length: 7 }, (_, i) => (
                  <div key={i} className="flex-1 h-0.5 rounded-full bg-amber-400" />
                ))}
              </div>
            </div>
            <div className="mt-auto flex justify-around border-t border-gray-100 pt-1">
              {['🏠', '⚔️', '🏆', '👤'].map((ic, i) => (
                <div key={i} className={`text-[11px] ${i === 0 ? 'opacity-100' : 'opacity-25'}`}>{ic}</div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Left Panel ────────────────────────────────────────────────── */
function LeftPanel() {
  return (
    <div className="hidden lg:flex lg:w-[44%] bg-[#0f0e17] flex-col justify-between p-12 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none opacity-[0.07]"
        style={{ backgroundImage: 'radial-gradient(#a5b4fc 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.18) 0%, transparent 70%)' }} />

      {/* Logo */}
      <div className="flex items-center gap-2.5 relative z-10">
        <div className="w-9 h-9 rounded-xl grid place-items-center shadow-sm"
          style={{ background: 'linear-gradient(135deg, #6366f1 0%, #7c3aed 100%)' }}>
          <span className="text-white font-bold text-base">N</span>
        </div>
        <span className="text-white font-semibold text-lg">NextMCQ</span>
      </div>

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
        <p className="text-xs text-gray-500 font-medium">{labels[step] || ''}</p>
        <p className="text-xs text-gray-400">{STEPS.indexOf(step) + 1} of 3</p>
      </div>
      <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
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
    <button onClick={onClick} className="flex items-center gap-1.5 text-gray-400 hover:text-gray-700 text-sm font-medium mb-7 transition-colors">
      <ChevronLeft className="w-4 h-4" />
      Back
    </button>
  );
}

/* ── Error Box ─────────────────────────────────────────────────── */
function ErrBox({ msg }) {
  if (!msg) return null;
  return (
    <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3 mb-4">{msg}</div>
  );
}

/* ── Field ─────────────────────────────────────────────────────── */
function Field({ label, badge, children }) {
  return (
    <div className="mb-5">
      <div className="flex items-center gap-2 mb-2">
        <label className="text-sm font-medium text-gray-700">{label}</label>
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
      <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6"
        style={{ background: 'linear-gradient(135deg, #eef2ff 0%, #ede9fe 100%)' }}>
        <Sparkles className="w-8 h-8 text-indigo-500" />
      </div>

      <h1 className="text-2xl font-semibold text-gray-900 mb-2 text-center">You've been invited!</h1>
      <p className="text-gray-400 text-sm leading-relaxed mb-7 max-w-xs mx-auto text-center">
        A friend invited you to join <span className="font-semibold text-indigo-600">NextMCQ</span>. Complete your profile to claim your bonus coins.
      </p>

      <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4 mb-6 flex items-center gap-4">
        <div className="w-11 h-11 bg-amber-100 rounded-xl grid place-items-center shrink-0">
          <Coins className="w-5 h-5 text-amber-600" />
        </div>
        <div>
          <p className="font-semibold text-amber-900 text-sm">Bonus coins waiting</p>
          <p className="text-amber-600 text-xs mt-0.5">Claim by completing your profile below</p>
        </div>
      </div>

      <p className="text-xs text-gray-400 mb-7 text-center">
        Referral code:{' '}
        <span className="font-mono font-semibold text-gray-600 bg-gray-100 px-2 py-0.5 rounded">{code}</span>
      </p>

      <PrimaryBtn onClick={onNext}>Get Started →</PrimaryBtn>
      <p className="text-xs text-gray-400 mt-4 text-center">Takes less than 2 minutes</p>
    </div>
  );
}

/* ── Step: Email ───────────────────────────────────────────────── */
function EmailStep({ email, setEmail, onNext, loading, error }) {
  return (
    <div className="step-in">
      <h2 className="text-2xl font-semibold text-gray-900 mb-1">Enter your email</h2>
      <p className="text-gray-400 text-sm mb-7">We'll send a 6-digit code — no password needed.</p>

      <Field label="Email address">
        <input type="email" value={email} onChange={e => setEmail(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && onNext()} placeholder="you@example.com"
          disabled={loading}
          className="w-full border border-gray-200 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50 rounded-xl px-4 py-3.5 text-gray-900 placeholder-gray-300 outline-none transition-all disabled:opacity-50 text-sm" />
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
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
      <h2 className="text-2xl font-semibold text-gray-900 mb-1">Check your email</h2>
      <p className="text-gray-400 text-sm mb-1">6-digit code sent to</p>
      <p className="text-indigo-600 font-medium text-sm mb-7">{email}</p>

      <OtpBoxes value={otp} onChange={setOtp} disabled={loading} />
      {error && <p className="text-red-500 text-sm mt-3 text-center">{error}</p>}

      <div className="mt-6">
        <PrimaryBtn onClick={onNext} disabled={otp.replace(/ /g, '').length < 6} loading={loading}>
          {!loading && 'Verify →'}
        </PrimaryBtn>
      </div>
      <p className="text-xs text-gray-400 text-center mt-4">
        Didn't get it?{' '}
        <button className="text-indigo-500 font-medium hover:underline">Resend code</button>
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
      <h2 className="text-2xl font-semibold text-gray-900 mb-1">Complete your profile</h2>
      <p className="text-gray-400 text-sm mb-7">Almost there — just a few details.</p>

      <Field label="Full name">
        <input type="text" value={form.name} onChange={e => set('name', e.target.value)}
          placeholder="Your full name" disabled={loading}
          className="w-full border border-gray-200 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50 rounded-xl px-4 py-3.5 text-gray-900 placeholder-gray-300 outline-none transition-all disabled:opacity-50 text-sm" />
      </Field>

      <Field label="I am a">
        <div className="grid grid-cols-2 gap-3">
          {['student', 'teacher'].map(r => (
            <button key={r} onClick={() => set('role', r)} disabled={loading}
              className={`py-3 rounded-xl border font-medium capitalize text-sm transition-all ${
                form.role === r
                  ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                  : 'border-gray-200 text-gray-500 hover:border-gray-300 bg-white'
              }`}>
              {r === 'student' ? '🎓 Student' : '👨‍🏫 Teacher'}
            </button>
          ))}
        </div>
      </Field>

      {form.role === 'student' && (
        <>
          <Field label="Class" badge={<span className="text-[10px] text-gray-400 font-normal">optional</span>}>
            <div className="flex gap-2">
              {CLASSES.map(c => (
                <button key={c.v} onClick={() => {
                  const same = form.class === c.v;
                  set('class', same ? null : c.v);
                  if (!same) set('semester', c.v === '11' ? '1' : '3');
                }} disabled={loading}
                  className={`flex-1 py-2.5 rounded-xl border text-sm font-medium transition-all ${
                    form.class === c.v
                      ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                      : 'border-gray-200 text-gray-500 hover:border-gray-300 bg-white'
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
                        ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                        : 'border-gray-200 text-gray-500 hover:border-gray-300 bg-white'
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
        badge={<span className="text-[10px] font-semibold bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">Auto-applied</span>}>
        <div className="relative">
          <input readOnly value={code}
            className="w-full border border-amber-200 bg-amber-50 rounded-xl px-4 py-3.5 font-mono font-semibold text-amber-800 tracking-widest cursor-not-allowed pr-10 text-sm" />
          <div className="absolute right-3.5 top-1/2 -translate-y-1/2">
            <Lock className="w-4 h-4 text-amber-400" />
          </div>
        </div>
        <p className="text-amber-600 text-xs mt-1.5">Bonus coins will be credited automatically.</p>
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
        <div className="absolute -bottom-2 -right-2 w-9 h-9 bg-emerald-500 rounded-2xl grid place-items-center shadow-lg ring-2 ring-white">
          <Check className="w-5 h-5 text-white" strokeWidth={3} />
        </div>
      </div>

      {/* Headline */}
      <h2 className="text-3xl font-bold text-gray-900 mb-4 tracking-tight">
        Your account is live 🚀
      </h2>

      {/* Sub-copy */}
      <p className="text-gray-400 text-sm max-w-[260px] mx-auto leading-relaxed mb-8">
        Your rewards are already waiting inside the app. Just download and sign in — it's all there.
      </p>

      {/* Reward hint pill — no amounts */}
      <div className="inline-flex items-center gap-2 bg-amber-50 border border-amber-200 text-amber-700 text-xs font-medium px-4 py-2 rounded-full mb-8">
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
      <p className="text-xs text-gray-400">
        Sign in with <span className="font-medium text-gray-600">the same email</span> you used here
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
    <div className="min-h-screen flex bg-white">
      <LeftPanel />

      {/* Right panel */}
      <div className="flex-1 flex flex-col justify-center items-center px-6 py-12 min-h-screen">
        {/* Mobile logo */}
        <div className="lg:hidden flex items-center gap-2 mb-10">
          <div className="w-8 h-8 rounded-xl grid place-items-center shadow-sm"
            style={{ background: 'linear-gradient(135deg, #6366f1 0%, #7c3aed 100%)' }}>
            <span className="text-white font-bold text-sm">N</span>
          </div>
          <span className="font-semibold text-gray-900">NextMCQ</span>
        </div>

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
