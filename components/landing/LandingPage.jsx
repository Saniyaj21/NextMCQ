'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';

const PS_URL = 'https://play.google.com/store/apps/details?id=com.nextmcq.app';

const DOT_DARK = {
  backgroundImage: 'radial-gradient(rgba(29,78,216,0.15) 1px, transparent 1px)',
  backgroundSize: '24px 24px',
};

/* ──────────────────────────────────────────────────────────────────
   Hooks
────────────────────────────────────────────────────────────────── */
function useInView(threshold = 0.12) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setInView(true); io.disconnect(); } },
      { threshold }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);
  return [ref, inView];
}

function useCounter(target, active, ms = 1400) {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!active) return;
    let raf;
    const t0 = performance.now();
    const tick = (t) => {
      const p = Math.min((t - t0) / ms, 1);
      setN(Math.floor((1 - Math.pow(1 - p, 3)) * target));
      if (p < 1) raf = requestAnimationFrame(tick);
      else setN(target);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active, target, ms]);
  return n;
}

/* ──────────────────────────────────────────────────────────────────
   Reveal — scroll-triggered fade-up (or scale)
────────────────────────────────────────────────────────────────── */
function Reveal({ children, delay = 0, scale = false, className = '' }) {
  const [ref, inView] = useInView();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const hidden = mounted && !inView;
  return (
    <div ref={ref} style={{ transitionDelay: `${delay}ms` }}
      className={`transition-all duration-700 ease-out ${
        hidden
          ? (scale ? 'opacity-0 scale-[0.96]' : 'opacity-0 translate-y-7')
          : (scale ? 'opacity-100 scale-100'  : 'opacity-100 translate-y-0')
      } ${className}`}>
      {children}
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────────
   Play Store Button
────────────────────────────────────────────────────────────────── */
function PSBtn({ size = 'md', variant = 'dark', className = '' }) {
  const bg =
    variant === 'outline' ? 'bg-white/10 text-white border border-white/25 hover:bg-white/20 backdrop-blur-sm' :
    variant === 'light'   ? 'bg-white text-gray-900 border border-gray-200 hover:bg-gray-50' :
                            'bg-gray-900 text-white hover:bg-gray-800';
  const pad = size === 'lg' ? 'px-6 py-3.5' : 'px-4 py-2.5';
  return (
    <a href={PS_URL} target="_blank" rel="noopener noreferrer"
      className={`ps-btn ${bg} ${pad} ${size === 'lg' ? 'text-base' : 'text-sm'} ${className}`}>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 opacity-80">
        <path d="M12 16L12 8"/>
        <path d="M8 12l4 4 4-4"/>
        <rect x="3" y="3" width="18" height="18" rx="3"/>
      </svg>
      <span className="font-semibold">Download App</span>
    </a>
  );
}

/* ──────────────────────────────────────────────────────────────────
   Navbar — transparent over dark hero, white when scrolled
────────────────────────────────────────────────────────────────── */
function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  return (
    <nav className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
      scrolled ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100' : 'bg-transparent'
    }`}>
      <div className="max-w-5xl mx-auto h-16 px-6 flex items-center justify-between gap-4">
        <a href="/" className="flex items-center gap-2.5 shrink-0">
          <div className="w-9 h-9 rounded-xl overflow-hidden bg-white shadow-sm ring-1 ring-black/[0.06] shrink-0">
            <Image src="/nextmcq-logo.png" alt="NextMCQ" width={36} height={36} className="w-full h-full object-contain" />
          </div>
          <span className={`font-bold text-[15px] transition-colors duration-300 ${
            scrolled ? 'text-gray-900' : 'text-white'
          }`}>NextMCQ</span>
        </a>

        <div className={`hidden md:flex items-center rounded-full px-1.5 py-1 gap-0.5 transition-all duration-300 ${
          scrolled ? 'bg-gray-100' : 'bg-white/10 border border-white/10'
        }`}>
          {[['#features', 'Features'], ['#how', 'How it works']].map(([href, label]) => (
            <a key={label} href={href}
              className={`text-sm font-medium px-4 py-1.5 rounded-full transition-all ${
                scrolled
                  ? 'text-gray-500 hover:text-gray-900 hover:bg-white'
                  : 'text-white/70 hover:text-white hover:bg-white/10'
              }`}>
              {label}
            </a>
          ))}
        </div>

        <PSBtn variant={scrolled ? 'dark' : 'outline'} />
      </div>
    </nav>
  );
}

/* ──────────────────────────────────────────────────────────────────
   Hero Phone mockup
────────────────────────────────────────────────────────────────── */
function HeroPhone() {
  return (
    <div className="relative mx-auto shrink-0" style={{ width: 230 }}>
      <div className="pointer-events-none absolute -inset-10 rounded-full blur-3xl"
        style={{ background: 'radial-gradient(circle, rgba(29,78,216,0.45) 0%, transparent 65%)' }} />

      <div className="relative">
        <div className="absolute -left-[4px] top-[56px] w-[4px] h-[22px] bg-gray-600 rounded-l-sm" />
        <div className="absolute -left-[4px] top-[90px] w-[4px] h-[22px] bg-gray-600 rounded-l-sm" />
        <div className="absolute -right-[4px] top-[72px] w-[4px] h-[34px] bg-gray-600 rounded-r-sm" />

        <div className="bg-gray-800 rounded-[2.6rem] p-[9px]"
          style={{ boxShadow: '0 40px 80px -12px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.07)' }}>
          <div className="relative rounded-[2.1rem] overflow-hidden" style={{ aspectRatio: '9/19.5' }}>
            <img src="/unnamed.webp" alt="NextMCQ app" className="absolute inset-0 w-full h-full object-cover object-top" />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────────
   Hero — dark animated section
────────────────────────────────────────────────────────────────── */
function Hero() {
  return (
    <section className="relative overflow-hidden bg-[#030712]" style={DOT_DARK}>
      <div className="pointer-events-none absolute top-0 -left-48 w-[640px] h-[640px] rounded-full opacity-20"
        style={{ background: 'radial-gradient(circle, #1d4ed8, transparent 65%)' }} />
      <div className="pointer-events-none absolute -top-24 right-0 w-[500px] h-[500px] rounded-full opacity-15"
        style={{ background: 'radial-gradient(circle, #2563eb, transparent 65%)' }} />

      <div className="relative max-w-5xl mx-auto px-6 pt-28">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16 pb-20">
          {/* Text */}
          <div className="flex-1 text-center lg:text-left">
            <div className="hero-badge inline-flex items-center gap-2 bg-white/10 border border-white/15 text-gray-300 text-xs font-medium px-3.5 py-1.5 rounded-full mb-8">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Now live on Android · Free download
            </div>

            <h1 className="hero-title text-5xl sm:text-6xl lg:text-[68px] font-bold text-white leading-[1.05] tracking-tight mb-6">
              Study smarter,<br />
              <span className="gradient-text">battle harder.</span>
            </h1>

            <p className="hero-desc text-gray-400 text-lg max-w-md mx-auto lg:mx-0 mb-10 leading-relaxed">
              MCQ practice for Class 10, 11 &amp; 12 — real-time friend battles, leaderboards, and rewards that keep you coming back.
            </p>

            <div className="hero-cta flex flex-wrap gap-3 justify-center lg:justify-start">
              <PSBtn size="lg" variant="light" />
              <a href="#features"
                className="inline-flex items-center gap-2 border border-white/20 bg-white/10 hover:bg-white/15 text-gray-300 hover:text-white text-sm font-medium transition-all py-3 px-5 rounded-xl">
                Explore features
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </a>
            </div>
          </div>

          {/* Phone */}
          <div className="hero-phone relative shrink-0">
            <div className="float-1 absolute -left-32 top-12 hidden lg:flex bg-white/90 backdrop-blur-sm border border-white/50 shadow-2xl rounded-2xl px-3.5 py-2.5 items-center gap-2.5 z-10">
              <span className="text-xl">🏆</span>
              <div>
                <p className="font-semibold text-gray-900 text-xs leading-none">Rank #1</p>
                <p className="text-gray-400 text-[10px] mt-0.5">This week</p>
              </div>
            </div>
            <div className="float-2 absolute -right-32 bottom-16 hidden lg:flex bg-white/90 backdrop-blur-sm border border-white/50 shadow-2xl rounded-2xl px-3.5 py-2.5 items-center gap-2.5 z-10">
              <span className="text-xl">🪙</span>
              <div>
                <p className="font-semibold text-gray-900 text-xs leading-none">+250 Coins</p>
                <p className="text-gray-400 text-[10px] mt-0.5">Battle won!</p>
              </div>
            </div>
            <HeroPhone />
          </div>
        </div>
      </div>

      <div className="pointer-events-none absolute bottom-0 inset-x-0 h-36 bg-gradient-to-t from-white to-transparent" />
    </section>
  );
}

/* ──────────────────────────────────────────────────────────────────
   Trust Bar — animated counters
────────────────────────────────────────────────────────────────── */
function TrustBar() {
  const [ref, inView] = useInView(0.4);
  const c1 = useCounter(10, inView);
  const c2 = useCounter(25, inView);
  const c3 = useCounter(5, inView);

  return (
    <div className="border-b border-gray-100 py-10 bg-white">
      <div ref={ref} className="max-w-5xl mx-auto px-6">
        <div className="flex flex-wrap items-center justify-center gap-10 sm:gap-16">
          {[
            { icon: '🎓', val: `${c1}K+`, label: 'Students' },
            { icon: '📝', val: `${c2}K+`, label: 'Questions' },
            { icon: '⚔️', val: `${c3}K+`, label: 'Battles fought' },
            { icon: '🏫', val: null,       label: 'Class 10, 11 & 12' },
          ].map(({ icon, val, label }) => (
            <div key={label} className="flex items-center gap-3">
              <span className="text-2xl">{icon}</span>
              <div>
                {val && <p className="text-xl font-bold text-gray-900 leading-none tabular-nums">{val}</p>}
                <p className={`text-sm ${val ? 'text-gray-500 mt-0.5' : 'text-base font-semibold text-gray-800'}`}>
                  {label}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────────
   Phone Frame (feature sections)
────────────────────────────────────────────────────────────────── */
function AppScreenshot() {
  return (
    <img src="/sample.png" alt="NextMCQ app" className="absolute inset-0 w-full h-full object-cover object-top" />
  );
}

function PhoneFrame({ offset = 0 }) {
  return (
    <div className="relative shrink-0" style={{ width: 168, transform: `translateY(${offset}px)` }}>
      <div className="absolute -left-[3px] top-[54px] w-[3px] h-[22px] bg-gray-700 rounded-l-sm" />
      <div className="absolute -left-[3px] top-[86px] w-[3px] h-[22px] bg-gray-700 rounded-l-sm" />
      <div className="absolute -right-[3px] top-[68px] w-[3px] h-[34px] bg-gray-700 rounded-r-sm" />

      <div className="bg-gray-900 rounded-[2rem] p-[6px] shadow-2xl shadow-black/30 ring-1 ring-black/10">
        <div className="relative rounded-[1.6rem] overflow-hidden" style={{ aspectRatio: '9/19.5' }}>
          <AppScreenshot />
        </div>
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────────
   Feature Section — side-by-side, alternates direction on desktop
────────────────────────────────────────────────────────────────── */
function FeatureSection({ labelIcon, label, title, desc, reverse = false }) {
  const [ref, inView] = useInView(0.08);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const hidden = mounted && !inView;

  return (
    <div ref={ref}
      className={`flex flex-col lg:flex-row items-center gap-10 lg:gap-16 transition-all duration-700 ease-out ${
        reverse ? 'lg:flex-row-reverse' : ''
      } ${hidden ? 'opacity-0 translate-y-10' : 'opacity-100 translate-y-0'}`}>

      <div className="flex-1 text-center lg:text-left">
        <span className="inline-flex items-center gap-2 text-xs font-semibold text-blue-700 bg-blue-50 border border-blue-100 px-3 py-1.5 rounded-full uppercase tracking-wide">
          <span>{labelIcon}</span>{label}
        </span>
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mt-5 mb-4 leading-tight tracking-tight">
          {title}
        </h2>
        <p className="text-gray-500 text-base leading-relaxed lg:max-w-sm">{desc}</p>
      </div>

      <div className="relative rounded-2xl border border-gray-200 shadow-lg py-10 px-6 sm:py-12 sm:px-10 w-full lg:w-auto lg:shrink-0 overflow-hidden bg-white">
        <div className="pointer-events-none absolute inset-0"
          style={{ background: 'radial-gradient(ellipse at 50% 100%, rgba(99,102,241,0.07), transparent 65%)' }} />
        <div className="relative flex justify-center items-end gap-5">
          <PhoneFrame offset={20} />
          <div className="hidden sm:block"><PhoneFrame /></div>
        </div>
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────────
   Features
────────────────────────────────────────────────────────────────── */
function Features() {
  return (
    <section id="features" className="bg-white py-28">
      <div className="max-w-5xl mx-auto px-6 space-y-28">
        <FeatureSection
          labelIcon="📚" label="Practice Mode"
          title="Unlimited MCQs, organized for your syllabus"
          desc="Practice by class, subject, and chapter with full explanations after every answer. Track accuracy and spot weak topics — automatically."
        />
        <FeatureSection
          labelIcon="⚔️" label="Battle Mode"
          title="Challenge friends to live MCQ duels"
          desc="Send a challenge, answer the same question at the same time. Speed and accuracy both count — winner earns bonus coins. Losers earn motivation."
          reverse
        />
        <FeatureSection
          labelIcon="🏆" label="Leaderboards"
          title="See where you stand, every week"
          desc="Global and class-wise rankings updated every Monday. Compete with classmates or climb the national board from your phone."
        />
        <FeatureSection
          labelIcon="🪙" label="Coins & Rewards"
          title="Your hard work has real rewards"
          desc="Every test, battle, and daily streak earns you coins and XP. Level up, unlock badges, and watch your profile grow as you improve."
          reverse
        />
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────────────────────────────
   How It Works — staggered card entrance
────────────────────────────────────────────────────────────────── */
function HowItWorks() {
  const [cardsRef, cardsInView] = useInView(0.1);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const steps = [
    { emoji: '📲', title: 'Download the app', desc: 'Free on the Play Store. No subscription, no credit card required.' },
    { emoji: '✍️', title: 'Set up your profile', desc: 'Pick your class and semester. Done in under 60 seconds.' },
    { emoji: '🚀', title: 'Practice & compete', desc: 'Daily MCQs, live battles with friends, weekly leaderboards.' },
  ];

  return (
    <section id="how" className="bg-gray-50 border-y border-gray-100 py-28">
      <div className="max-w-5xl mx-auto px-6">
        <Reveal className="text-center mb-14">
          <span className="inline-flex items-center gap-2 text-sm font-semibold text-blue-700 bg-blue-50 border border-blue-100 px-3 py-1.5 rounded-full mb-5">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Getting started
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">Up and running in 3 steps</h2>
        </Reveal>

        <div ref={cardsRef} className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {steps.map((s, i) => {
            const hidden = mounted && !cardsInView;
            return (
              <div key={s.title}
                style={{ transitionDelay: `${i * 120}ms` }}
                className={`bg-white border border-gray-100 rounded-2xl p-7 shadow-sm transition-all duration-700 ease-out ${
                  hidden ? 'opacity-0 translate-y-8' : 'opacity-100 translate-y-0'
                }`}>
                <div className="w-11 h-11 rounded-2xl grid place-items-center mb-5 text-xl shadow-sm"
                  style={{ background: 'linear-gradient(135deg, #1d4ed8 0%, #2563eb 100%)' }}>
                  {s.emoji}
                </div>
                <p className="text-xs font-bold text-blue-400 mb-2 tracking-widest uppercase">Step {i + 1}</p>
                <h3 className="font-bold text-gray-900 text-base mb-2">{s.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{s.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}


/* ──────────────────────────────────────────────────────────────────
   Download CTA
────────────────────────────────────────────────────────────────── */
function DownloadCTA() {
  return (
    <section className="bg-white pb-28">
      <div className="max-w-5xl mx-auto px-6">
        <Reveal>
          <div className="relative overflow-hidden bg-[#030712] rounded-3xl px-8 py-20 text-center">
            <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-64 rounded-full opacity-25"
              style={{ background: 'radial-gradient(circle, #1d4ed8, transparent 65%)' }} />
            <div className="pointer-events-none absolute bottom-0 right-0 w-64 h-64 rounded-full opacity-15 translate-x-1/4 translate-y-1/4"
              style={{ background: 'radial-gradient(circle, #2563eb, transparent 65%)' }} />

            <h2 className="relative text-3xl sm:text-4xl font-bold text-white mb-4 tracking-tight">
              Ready to top your class?
            </h2>
            <p className="relative text-gray-400 text-base max-w-sm mx-auto mb-10 leading-relaxed">
              Free forever. No ads. No subscription. Just MCQ practice, battles, and glory.
            </p>
            <PSBtn variant="light" size="lg" className="relative mx-auto mb-10" />
            <div className="relative flex flex-wrap justify-center gap-6 text-gray-500 text-sm">
              {['Free forever', 'No subscription', 'No ads'].map(t => (
                <span key={t} className="flex items-center gap-1.5">
                  <svg className="w-3.5 h-3.5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  {t}
                </span>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────────────────────────────
   Footer
────────────────────────────────────────────────────────────────── */
function Footer() {
  return (
    <footer className="bg-[#030712] py-16" style={DOT_DARK}>
      <div className="max-w-5xl mx-auto px-6 flex flex-col items-center text-center">
        <div className="w-24 h-24 rounded-3xl overflow-hidden bg-white shadow-md mb-4">
          <Image src="/nextmcq-logo.png" alt="NextMCQ" width={96} height={96} className="w-full h-full object-contain" />
        </div>
        <p className="text-gray-500 text-sm max-w-xs leading-relaxed mb-8">
          MCQ practice for Indian students — Class 10, 11 &amp; 12.
        </p>

        <div className="flex flex-wrap justify-center gap-6 text-sm mb-10">
          {['Privacy Policy', 'Terms of Use', 'Contact'].map(l => (
            <a key={l} href="#" className="text-gray-500 hover:text-gray-300 transition-colors">{l}</a>
          ))}
        </div>

        <p className="text-gray-600 text-xs">© {new Date().getFullYear()} NextMCQ. Built for Indian students.</p>
      </div>
    </footer>
  );
}

/* ──────────────────────────────────────────────────────────────────
   Page
────────────────────────────────────────────────────────────────── */
export default function LandingPage() {
  return (
    <div className="w-full overflow-x-hidden">
      <Navbar />
      <Hero />
      <TrustBar />
      <Features />
      <HowItWorks />
      <DownloadCTA />
      <Footer />
    </div>
  );
}
