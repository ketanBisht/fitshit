'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchApi } from '@/lib/api';
import { useRouter } from 'next/navigation';
import { ArrowUpRight, Zap } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';

export default function SignupPage() {
  const router = useRouter();
  const [gymName, setGymName] = useState('');
  const [subdomain, setSubdomain] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true); setError('');
    try {
      await fetchApi('/auth/register', { method: 'POST', body: JSON.stringify({ gymName, subdomain, email, password }) });
      alert('Gym registered! Please sign in.'); router.push('/login');
    } catch (err: any) { setError(err.message); } finally { setLoading(false); }
  };

  return (
    <div className="page">
      <motion.nav className="nav-bar" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{ width: 30, height: 30, borderRadius: '50%', background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Zap size={15} color="#0C0C0C" fill="#0C0C0C" />
          </div>
          <span style={{ fontFamily: 'Outfit', fontWeight: 900, fontSize: '1.05rem', letterSpacing: '-0.03em', color: 'var(--text)' }}>fitshit</span>
        </div>
        <div className="nav-pill-group">
          <a href="/login" className="nav-pill">Login</a>
          <span className="nav-pill active">Register</span>
        </div>
        <ThemeToggle />
      </motion.nav>

      <div style={{ overflow: 'hidden', padding: '1.5rem 0 0', pointerEvents: 'none' }}>
        <div className="marquee-track">
          {[...Array(6)].map((_, i) => (
            <span key={i} className="ghost-text marquee-item" style={{ fontSize: '5rem', opacity: 1, padding: '0 2rem' }}>
              LAUNCH YOUR GYM · START TODAY ·&nbsp;
            </span>
          ))}
        </div>
      </div>

      <section style={{ padding: '3rem 10% 5rem', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '5rem', maxWidth: '1400px', margin: '0 auto', width: '100%' }}>
        {/* Left */}
        <motion.div style={{ flex: 1 }} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1, ease: [0.25,0.46,0.45,0.94] }}>
          <div className="pill pill-amber" style={{ marginBottom: '1.75rem' }}>Get Started Free</div>
          <h1 className="display-xl" style={{ fontSize: 'clamp(3rem, 6vw, 5.5rem)', marginBottom: '1.5rem' }}>
            Launch Your<br />Gym Today.
          </h1>
          <p style={{ color: 'var(--text2)', fontSize: '1rem', lineHeight: 1.75, maxWidth: '380px', marginBottom: '3rem' }}>
            Set up your gym platform in 2 minutes. Members get a branded portal the moment you're done.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
            {['Custom subdomain for your gym', 'Member self-signup portal included', 'Expiry tracking with live dashboard'].map((f, i) => (
              <motion.div key={f} initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 + i * 0.08 }}
                style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.95rem', color: 'var(--text2)' }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--accent)', flexShrink: 0 }} />{f}
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Right — form only, no card wrapping */}
        <motion.div style={{ flexShrink: 0, width: '420px' }} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.15, ease: [0.25,0.46,0.45,0.94] }}>
          <AnimatePresence>
            {error && <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              style={{ marginBottom: '1.25rem', padding: '0.875rem 1.25rem', background: 'rgba(239,68,68,0.08)', borderRadius: '14px', color: '#EF4444', fontSize: '0.9rem', borderLeft: '3px solid #EF4444' }}>
              {error}
            </motion.div>}
          </AnimatePresence>

          <form onSubmit={handleSignup} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label className="label" style={{ display: 'block', marginBottom: '0.4rem' }}>Gym Name</label>
              <input type="text" required value={gymName} onChange={e => { setGymName(e.target.value); if (!subdomain) setSubdomain(e.target.value.toLowerCase().replace(/[^a-z0-9]/g, '')); }} className="input" placeholder="Iron Paradise" />
            </div>
            <div>
              <label className="label" style={{ display: 'block', marginBottom: '0.4rem' }}>Subdomain</label>
              <div className="input-group">
                <input type="text" required value={subdomain} onChange={e => setSubdomain(e.target.value.toLowerCase().replace(/[^a-z0-9]/g, ''))} placeholder="ironparadise" />
                <span className="input-group-suffix">.fitshit.com</span>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.875rem' }}>
              <div>
                <label className="label" style={{ display: 'block', marginBottom: '0.4rem' }}>Email</label>
                <input type="email" required value={email} onChange={e => setEmail(e.target.value)} className="input" placeholder="owner@gym.com" />
              </div>
              <div>
                <label className="label" style={{ display: 'block', marginBottom: '0.4rem' }}>Password</label>
                <input type="password" required value={password} onChange={e => setPassword(e.target.value)} className="input" placeholder="••••••••" />
              </div>
            </div>
            <div style={{ display: 'flex', gap: '0.875rem', marginTop: '0.5rem' }}>
              <motion.button type="submit" disabled={loading} className="btn btn-amber" whileTap={{ scale: 0.97 }} whileHover={{ scale: 1.02 }}>
                {loading ? 'Creating...' : <> Create Gym <ArrowUpRight size={17} /> </>}
              </motion.button>
              <a href="/login" className="btn btn-outline">Sign In</a>
            </div>
          </form>
        </motion.div>
      </section>
    </div>
  );
}
