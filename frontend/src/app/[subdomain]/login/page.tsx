'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchApi } from '@/lib/api';
import { useRouter, useParams } from 'next/navigation';
import { ArrowUpRight, Zap } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';

export default function SubdomainLogin() {
  const router = useRouter();
  const params = useParams();
  const subdomain = params?.subdomain as string;
  const [gymName, setGymName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (subdomain) fetchApi(`/gyms/subdomain/${subdomain}`).then(r => setGymName(r.name)).catch(() => {});
  }, [subdomain]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true); setError('');
    try {
      const data = await fetchApi('/auth/login', { method: 'POST', body: JSON.stringify({ email, password, subdomain }) });
      localStorage.setItem('token', data.access_token);
      if (data.role === 'MEMBER') router.push('/dashboard');
      else setError('Admins should sign in from the main Fitshit portal.');
    } catch (err: any) { setError(err.message); } finally { setLoading(false); }
  };

  return (
    <div className="page">
      <motion.nav className="nav-bar" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{ width: 30, height: 30, borderRadius: '50%', background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Zap size={15} color="#0C0C0C" fill="#0C0C0C" />
          </div>
          <a href="/" style={{ fontFamily: 'Outfit', fontWeight: 900, fontSize: '1.05rem', letterSpacing: '-0.03em', color: 'var(--text)', textDecoration: 'none' }}>{gymName || '...'}</a>
        </div>
        <div className="nav-pill-group">
          <a href="/" className="nav-pill">← Back</a>
          <span className="nav-pill active">Login</span>
          <a href="/signup" className="nav-pill">Join</a>
        </div>
        <ThemeToggle />
      </motion.nav>

      <div style={{ overflow: 'hidden', padding: '1.5rem 0 0', pointerEvents: 'none' }}>
        <div className="marquee-track">
          {[...Array(6)].map((_, i) => (
            <span key={i} className="ghost-text marquee-item" style={{ fontSize: '5rem', opacity: 1, padding: '0 2rem' }}>
              {(gymName || 'GYM').toUpperCase()} · MEMBER PORTAL ·&nbsp;
            </span>
          ))}
        </div>
      </div>

      <section style={{ padding: '3rem 10% 5rem', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '5rem', maxWidth: '1400px', margin: '0 auto', width: '100%' }}>
        <motion.div style={{ flex: 1 }} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: [0.25,0.46,0.45,0.94] }}>
          <div className="pill pill-amber" style={{ marginBottom: '1.75rem' }}>{gymName}</div>
          <h1 className="display-xl" style={{ fontSize: 'clamp(3.5rem, 7vw, 6.5rem)', marginBottom: '1.5rem' }}>
            Member<br />Portal.
          </h1>
          <p style={{ color: 'var(--text2)', fontSize: '1rem', lineHeight: 1.75, maxWidth: '380px' }}>
            Sign in to track your membership, days remaining, and stay on top of your fitness journey.
          </p>
        </motion.div>

        <motion.div style={{ flexShrink: 0, width: '380px' }} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1, ease: [0.25,0.46,0.45,0.94] }}>
          <AnimatePresence>
            {error && <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              style={{ marginBottom: '1.25rem', padding: '0.875rem 1.25rem', background: 'rgba(239,68,68,0.08)', borderRadius: '14px', color: '#EF4444', fontSize: '0.9rem', borderLeft: '3px solid #EF4444' }}>
              {error}
            </motion.div>}
          </AnimatePresence>

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label className="label" style={{ display: 'block', marginBottom: '0.4rem' }}>Email</label>
              <input type="email" required value={email} onChange={e => setEmail(e.target.value)} className="input" placeholder="you@example.com" />
            </div>
            <div>
              <label className="label" style={{ display: 'block', marginBottom: '0.4rem' }}>Password</label>
              <input type="password" required value={password} onChange={e => setPassword(e.target.value)} className="input" placeholder="••••••••" />
            </div>
            <div style={{ display: 'flex', gap: '0.875rem', marginTop: '0.5rem' }}>
              <motion.button type="submit" disabled={loading} className="btn btn-amber" whileTap={{ scale: 0.97 }} whileHover={{ scale: 1.02 }}>
                {loading ? 'Signing in...' : <> Sign In <ArrowUpRight size={17} /> </>}
              </motion.button>
              <a href="/signup" className="btn btn-outline">Join Now</a>
            </div>
          </form>
        </motion.div>
      </section>
    </div>
  );
}
