'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchApi } from '@/lib/api';
import { useRouter, useParams } from 'next/navigation';
import { ArrowUpRight, Zap } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';

const plans = [
  { months: '1', label: '1 Month', tag: '' },
  { months: '3', label: '3 Months', tag: 'Popular' },
  { months: '6', label: '6 Months', tag: 'Value' },
  { months: '12', label: '1 Year', tag: 'Best' },
];

export default function SubdomainSignup() {
  const router = useRouter();
  const params = useParams();
  const subdomain = params?.subdomain as string;
  const [gymName, setGymName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [planMonths, setPlanMonths] = useState('3');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (subdomain) fetchApi(`/gyms/subdomain/${subdomain}`).then(r => setGymName(r.name)).catch(() => {});
  }, [subdomain]);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true); setError('');
    try {
      await fetchApi('/auth/register-member', { method: 'POST', body: JSON.stringify({ email, password, subdomain, planMonths }) });
      const data = await fetchApi('/auth/login', { method: 'POST', body: JSON.stringify({ email, password, subdomain }) });
      localStorage.setItem('token', data.access_token);
      router.push('/dashboard');
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
          <a href="/login" className="nav-pill">Login</a>
          <span className="nav-pill active">Sign Up</span>
        </div>
        <ThemeToggle />
      </motion.nav>

      <section style={{ padding: '4rem 10% 5rem', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '5rem', maxWidth: '1400px', margin: '0 auto', width: '100%' }}>
        {/* Left */}
        <motion.div style={{ flex: 1 }} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: [0.25,0.46,0.45,0.94] }}>
          <div className="pill pill-amber" style={{ marginBottom: '1.75rem' }}>Join {gymName}</div>
          <h1 className="display-xl" style={{ fontSize: 'clamp(3rem, 5.5vw, 5.5rem)', marginBottom: '1.5rem' }}>
            Start Your<br />Journey.
          </h1>
          <p style={{ color: 'var(--text2)', fontSize: '1rem', lineHeight: 1.75, maxWidth: '380px', marginBottom: '3rem' }}>
            Pick your plan and get instant access to your member portal.
          </p>

          {/* Plan selector — clean grid, no card wrapping */}
          <p className="label" style={{ marginBottom: '0.875rem' }}>Choose a plan</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.625rem', maxWidth: '360px' }}>
            {plans.map(p => (
              <motion.button key={p.months} type="button" onClick={() => setPlanMonths(p.months)}
                style={{ padding: '1rem', borderRadius: '16px', border: '2px solid', cursor: 'pointer', textAlign: 'left', background: planMonths === p.months ? 'var(--accent)' : 'var(--bg2)', borderColor: planMonths === p.months ? 'var(--accent)' : 'var(--border)', outline: 'none', transition: 'all 0.15s' }}
                whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                {p.tag && <p style={{ color: planMonths === p.months ? 'rgba(12,12,12,0.6)' : 'var(--text3)', fontSize: '0.62rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.3rem' }}>{p.tag}</p>}
                <p style={{ fontWeight: 700, fontSize: '0.9rem', color: planMonths === p.months ? '#0C0C0C' : 'var(--text)' }}>{p.label}</p>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Right — bare form */}
        <motion.div style={{ flexShrink: 0, width: '400px' }} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1, ease: [0.25,0.46,0.45,0.94] }}>
          <AnimatePresence>
            {error && <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              style={{ marginBottom: '1.25rem', padding: '0.875rem 1.25rem', background: 'rgba(239,68,68,0.08)', borderRadius: '14px', color: '#EF4444', fontSize: '0.9rem', borderLeft: '3px solid #EF4444' }}>
              {error}
            </motion.div>}
          </AnimatePresence>

          <form onSubmit={handleSignup} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label className="label" style={{ display: 'block', marginBottom: '0.4rem' }}>Email</label>
              <input type="email" required value={email} onChange={e => setEmail(e.target.value)} className="input" placeholder="you@example.com" />
            </div>
            <div>
              <label className="label" style={{ display: 'block', marginBottom: '0.4rem' }}>Password</label>
              <input type="password" required value={password} onChange={e => setPassword(e.target.value)} className="input" placeholder="••••••••" />
            </div>
            <div style={{ padding: '0.875rem 1.125rem', background: 'var(--accent-s)', border: '1.5px solid var(--accent)', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <p className="label">Selected plan</p>
                <p style={{ fontWeight: 800, color: 'var(--text)', marginTop: '0.125rem' }}>{plans.find(p => p.months === planMonths)?.label}</p>
              </div>
              <AnimatePresence mode="wait">
                <motion.span key={planMonths} initial={{ scale: 0.7, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.7, opacity: 0 }}
                  style={{ fontFamily: 'Outfit', fontWeight: 900, fontSize: '1.75rem', color: 'var(--accent)', letterSpacing: '-0.04em' }}>
                  {planMonths}M
                </motion.span>
              </AnimatePresence>
            </div>
            <div style={{ display: 'flex', gap: '0.875rem', marginTop: '0.25rem' }}>
              <motion.button type="submit" disabled={loading} className="btn btn-ink" whileTap={{ scale: 0.97 }} whileHover={{ scale: 1.02 }}>
                {loading ? 'Processing...' : <> Complete Signup <ArrowUpRight size={17} /> </>}
              </motion.button>
              <a href="/login" className="btn btn-outline">Login</a>
            </div>
          </form>
        </motion.div>
      </section>
    </div>
  );
}
