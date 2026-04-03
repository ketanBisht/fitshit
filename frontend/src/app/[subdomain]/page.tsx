'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchApi } from '@/lib/api';
import { useRouter, useParams } from 'next/navigation';
import { ArrowUpRight, Zap } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';

export default function GymLandingPage() {
  const router = useRouter();
  const params = useParams();
  const subdomain = params?.subdomain as string;
  const [gymData, setGymData] = useState<any>(null);
  const [plans, setPlans] = useState<any[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (subdomain) {
      Promise.all([
        fetchApi(`/gyms/subdomain/${subdomain}`),
        fetchApi(`/gyms/subdomain/${subdomain}/plans`)
      ])
      .then(([gym, p]) => { setGymData(gym); setPlans(p); setLoading(false); })
      .catch(() => setLoading(false));
    }
  }, [subdomain]);

  if (loading) return <div className="page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}><div className="spinner" /></div>;
  if (!gymData) return (
    <div className="page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <h1 className="display-xl" style={{ fontSize: '5rem' }}>Gym not found.</h1>
    </div>
  );

  const facilities = gymData.facilities ? gymData.facilities.split(',').map((f: string) => f.trim()).filter(Boolean) : ['World-class Equipment', 'Expert Trainers', 'Flexible Timings', 'Lockers & Showers'];

  return (
    <div className="page">
      {/* Nav */}
      <motion.nav className="nav-bar" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{ width: 30, height: 30, borderRadius: '50%', background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Zap size={15} color="#0C0C0C" fill="#0C0C0C" />
          </div>
          <span style={{ fontFamily: 'Outfit', fontWeight: 900, fontSize: '1.05rem', letterSpacing: '-0.03em', color: 'var(--text)' }}>{gymData.name}</span>
        </div>
        <div className="nav-pill-group">
          <a href="/" className="nav-pill active">Home</a>
          <a href="/login" className="nav-pill">Login</a>
          <a href="/signup" className="nav-pill">Join</a>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <ThemeToggle />
          <motion.a href="/signup" className="btn btn-ink" style={{ padding: '0.6rem 1.375rem', fontSize: '0.875rem' }} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            Join Now <ArrowUpRight size={15} />
          </motion.a>
        </div>
      </motion.nav>

      {/* Ghost marquee */}
      <div style={{ overflow: 'hidden', padding: '1.5rem 0 0', pointerEvents: 'none' }}>
        <div className="marquee-track">
          {[...Array(6)].map((_, i) => (
            <span key={i} className="ghost-text marquee-item" style={{ fontSize: '5rem', opacity: 1, padding: '0 2rem' }}>
              {gymData.name.toUpperCase()} · JOIN NOW ·&nbsp;
            </span>
          ))}
        </div>
      </div>

      {/* Hero */}
      <section style={{ padding: '3rem 10% 5rem', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '4rem', maxWidth: '1400px', margin: '0 auto', width: '100%' }}>
        <motion.div style={{ flex: 1 }} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1, ease: [0.25,0.46,0.45,0.94] }}>
          <div className="pill pill-amber" style={{ marginBottom: '1.75rem' }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#0C0C0C', display: 'inline-block', marginRight: '0.5rem' }} />
            {subdomain}.fitshit.com
          </div>
          <h1 className="display-xl" style={{ fontSize: 'clamp(3.5rem, 7vw, 6.5rem)', marginBottom: '1.5rem' }}>
            Unleash<br />Your Power.
          </h1>
          <p style={{ color: 'var(--text2)', fontSize: '1rem', lineHeight: 1.75, maxWidth: '420px', marginBottom: '2rem' }}>
            {gymData.description || 'Join our community and achieve your fitness goals with world-class equipment and expert coaches.'}
          </p>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '2.5rem' }}>
            {gymData.timing && (
              <div className="pill" style={{ background: 'var(--bg2)', border: '1px solid var(--border)' }}>
                🕒 {gymData.timing}
              </div>
            )}
            {gymData.instagram && (
              <a href={`https://instagram.com/${gymData.instagram.replace('@', '')}`} target="_blank" className="pill" style={{ background: 'var(--bg2)', border: '1px solid var(--border)', textDecoration: 'none', color: 'var(--text)' }}>
                📷 @{gymData.instagram.replace('@', '')}
              </a>
            )}
          </div>
          <div style={{ display: 'flex', gap: '0.875rem' }}>
            <motion.a href="/signup" className="btn btn-ink" whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              Get Started <ArrowUpRight size={17} />
            </motion.a>
            <a href="/login" className="btn btn-outline">Member Login</a>
          </div>
        </motion.div>

        {/* ONE amber card */}
        <motion.div style={{ flexShrink: 0, width: 280 }} initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2, type: 'spring', damping: 18 }} whileHover={{ y: -4 }}>
          <div className="card-amber" style={{ padding: '2.5rem', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: -40, right: -40, width: 160, height: 160, background: 'rgba(0,0,0,0.08)', borderRadius: '50%' }} />
            <div style={{ width: 38, height: 38, borderRadius: '50%', background: '#0C0C0C', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.75rem' }}>
              <ArrowUpRight size={17} color="#F5A623" />
            </div>
            <p style={{ fontFamily: 'Outfit', fontWeight: 900, fontSize: '2.25rem', color: '#0C0C0C', lineHeight: 1, letterSpacing: '-0.04em', marginBottom: '1rem' }}>Join<br />Today</p>
            <p style={{ fontSize: '0.85rem', color: 'rgba(12,12,12,0.6)', lineHeight: 1.6, marginBottom: '1.5rem' }}>Plans from 1 month. Start your journey right now.</p>
            <a href="/signup" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem', color: '#0C0C0C', fontWeight: 800, fontSize: '0.85rem', textDecoration: 'none' }}>
              Sign up ↗
            </a>
          </div>
        </motion.div>
      </section>

      {/* Facilities Section */}
      <section style={{ padding: '0 10% 5rem', maxWidth: '1400px', margin: '0 auto', width: '100%' }}>
        <p className="label" style={{ marginBottom: '1.5rem', textAlign: 'center' }}>World-Class Facilities</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
          {facilities.map((f: string, i: number) => (
            <motion.div key={i} className={i % 2 !== 0 ? 'card-ink' : 'card'} style={{ padding: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 + (i * 0.1), duration: 0.5 }}
              whileHover={{ y: -3, boxShadow: i % 2 !== 0 ? '0 12px 40px rgba(0,0,0,0.5)' : '0 12px 40px rgba(0,0,0,0.1)' }}>
              <h3 style={{ fontFamily: 'Outfit', fontWeight: 800, fontSize: '1.4rem', color: i % 2 !== 0 ? 'var(--ink-inv)' : 'var(--text)', letterSpacing: '-0.03em', lineHeight: 1.2 }}>
                {f}
              </h3>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Pricing Plans */}
      {plans && plans.length > 0 && (
        <section style={{ padding: '0 10% 5rem', maxWidth: '1400px', margin: '0 auto', width: '100%' }}>
          <p className="label" style={{ marginBottom: '1.5rem', textAlign: 'center' }}>Membership Plans</p>
          <div style={{ display: 'grid', gridTemplateColumns: `repeat(auto-fit, minmax(280px, 1fr))`, gap: '1rem' }}>
            {plans.map((p, i) => (
              <motion.div key={p.id} className="card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column' }}
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + i * 0.1, duration: 0.5 }}
                whileHover={{ y: -3, boxShadow: '0 12px 40px rgba(0,0,0,0.1)' }}>
                <h3 style={{ fontFamily: 'Outfit', fontWeight: 800, fontSize: '1.25rem', color: 'var(--text)', marginBottom: '0.25rem' }}>{p.name}</h3>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.25rem', marginBottom: '1.5rem' }}>
                  <span style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--text)' }}>₹{p.price}</span>
                  <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text3)', textTransform: 'uppercase' }}>/ {p.durationMonths}mo</span>
                </div>
                <ul style={{ padding: 0, margin: '0 0 2rem 0', listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem', flex: 1 }}>
                  {p.features.split(',').map((f: string, idx: number) => (
                    <li key={idx} style={{ fontSize: '0.875rem', color: 'var(--text2)', display: 'flex', alignItems: 'flex-start', gap: '0.5rem', lineHeight: 1.4 }}>
                      <span style={{ color: 'var(--accent)', fontWeight: 800 }}>✓</span> {f.trim()}
                    </li>
                  ))}
                </ul>
                <motion.a href="/signup" className="btn btn-outline" style={{ width: '100%', justifyContent: 'center' }} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  Select Plan
                </motion.a>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* Full-width amber CTA */}
      <section style={{ padding: '0 10% 5rem', maxWidth: '1400px', margin: '0 auto', width: '100%' }}>
        <motion.div className="card-amber" style={{ padding: '3rem 3.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderRadius: '24px' }}
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
          <h2 style={{ fontFamily: 'Outfit', fontWeight: 900, fontSize: 'clamp(1.75rem, 3.5vw, 2.75rem)', color: '#0C0C0C', letterSpacing: '-0.04em', lineHeight: 1.15 }}>
            Ready to start<br />your journey?
          </h2>
          <motion.a href="/signup" className="btn btn-ink" style={{ flexShrink: 0 }} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
            Join {gymData.name} ↗
          </motion.a>
        </motion.div>
      </section>
    </div>
  );
}
