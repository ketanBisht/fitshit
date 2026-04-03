'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchApi } from '@/lib/api';
import { useRouter } from 'next/navigation';
import { ArrowUpRight, Zap } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true); setError('');
    try {
      const data = await fetchApi('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) });
      localStorage.setItem('token', data.access_token);
      if (data.role === 'ADMIN' || data.role === 'SUPER_ADMIN') router.push('/admin');
      else setError('Members must log in from their Gym Portal.');
    } catch (err: any) { setError(err.message); } finally { setLoading(false); }
  };

  return (
    <div className="page">
      {/* Nav */}
      <motion.nav className="nav-bar" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{ width: 30, height: 30, borderRadius: '50%', background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Zap size={15} color="#0C0C0C" fill="#0C0C0C" />
          </div>
          <span style={{ fontFamily: 'Outfit', fontWeight: 900, fontSize: '1.05rem', letterSpacing: '-0.03em', color: 'var(--text)' }}>fitshit</span>
        </div>
        <div className="nav-pill-group">
          <span className="nav-pill active">Login</span>
          <a href="/signup" className="nav-pill">Register</a>
        </div>
        <ThemeToggle />
      </motion.nav>

      {/* Ghost scrolling text */}
      <div style={{ overflow: 'hidden', padding: '1.5rem 0 0', pointerEvents: 'none' }}>
        <div className="marquee-track">
          {[...Array(6)].map((_, i) => (
            <span key={i} className="ghost-text marquee-item" style={{ fontSize: '5rem', opacity: 1, padding: '0 2rem' }}>
              FITSHIT · GYM MANAGEMENT ·&nbsp;
            </span>
          ))}
        </div>
      </div>

      {/* Hero */}
      <section style={{ padding: '3rem 10% 5rem', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '4rem', maxWidth: '1400px', margin: '0 auto', width: '100%' }}>
        {/* Left */}
        <motion.div style={{ flex: 1 }} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1, ease: [0.25,0.46,0.45,0.94] }}>
          <div className="pill pill-amber" style={{ marginBottom: '1.75rem' }}>Admin Portal</div>
          <h1 className="display-xl" style={{ fontSize: 'clamp(3.5rem, 7vw, 6.5rem)', marginBottom: '1.5rem' }}>
            Own Your<br />Gym.
          </h1>
          <p style={{ color: 'var(--text2)', fontSize: '1rem', lineHeight: 1.75, maxWidth: '400px', marginBottom: '2.5rem' }}>
            Replace spreadsheets and WhatsApp. The all-in-one platform built for serious gym owners.
          </p>

          <AnimatePresence>
            {error && (
              <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                style={{ marginBottom: '1.5rem', padding: '0.875rem 1.25rem', background: 'rgba(239,68,68,0.08)', borderRadius: '14px', color: '#EF4444', fontSize: '0.9rem', borderLeft: '3px solid #EF4444' }}>
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '380px' }}>
            <div>
              <label className="label" style={{ display: 'block', marginBottom: '0.4rem' }}>Email</label>
              <input type="email" required value={email} onChange={e => setEmail(e.target.value)} className="input" placeholder="owner@gym.com" />
            </div>
            <div>
              <label className="label" style={{ display: 'block', marginBottom: '0.4rem' }}>Password</label>
              <input type="password" required value={password} onChange={e => setPassword(e.target.value)} className="input" placeholder="••••••••" />
            </div>
            <div style={{ display: 'flex', gap: '0.875rem', marginTop: '0.5rem' }}>
              <motion.button type="submit" disabled={loading} className="btn btn-ink" whileTap={{ scale: 0.97 }} whileHover={{ scale: 1.02 }}>
                {loading ? 'Signing in...' : <> Sign In <ArrowUpRight size={17} /> </>}
              </motion.button>
              <a href="/signup" className="btn btn-outline">Register Gym</a>
            </div>
          </form>
        </motion.div>

        {/* Right — ONE amber card */}
        <motion.div initial={{ opacity: 0, scale: 0.92, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2, type: 'spring', damping: 18 }}
          style={{ flexShrink: 0, width: 300 }}>
          <div className="card-amber" style={{ padding: '2.5rem', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: -40, right: -40, width: 180, height: 180, background: 'rgba(0,0,0,0.08)', borderRadius: '50%' }} />
            <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#0C0C0C', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '2rem' }}>
              <ArrowUpRight size={18} color="#F5A623" />
            </div>
            <p style={{ fontFamily: 'Outfit', fontWeight: 900, fontSize: '2.5rem', color: '#0C0C0C', lineHeight: 1, letterSpacing: '-0.04em', marginBottom: '1rem' }}>Admin<br />Panel</p>
            <p style={{ fontSize: '0.875rem', color: 'rgba(12,12,12,0.6)', lineHeight: 1.6 }}>Manage members, memberships, and your gym website — all in one place.</p>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
