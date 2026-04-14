'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchApi } from '@/lib/api';
import { useRouter } from 'next/navigation';
import { ArrowUpRight, Zap, Mail, CheckCircle2 } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); 
    setLoading(true); 
    setError('');
    try {
      // We detect the subdomain if we are on one, otherwise it's null (main admin)
      const host = window.location.hostname;
      const subdomain = host.includes('.') ? host.split('.')[0] : '';
      
      await fetchApi('/auth/forgot-password', { 
        method: 'POST', 
        body: JSON.stringify({ email, subdomain: subdomain === 'localhost' ? '' : subdomain }) 
      });
      setSuccess(true);
    } catch (err: any) { 
      setError(err.message); 
    } finally { 
      setLoading(false); 
    }
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
          <button onClick={() => router.push('/login')} className="nav-pill">← Back to Login</button>
        </div>
        <ThemeToggle />
      </motion.nav>

      <section style={{ padding: '6rem 10% 5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '80vh', maxWidth: '1400px', margin: '0 auto', width: '100%' }}>
        <motion.div style={{ maxWidth: '450px', width: '100%', textAlign: 'center' }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          
          <AnimatePresence mode="wait">
            {!success ? (
              <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <div className="pill pill-amber" style={{ marginBottom: '1.5rem', display: 'inline-block' }}>Security</div>
                <h1 className="display-xl" style={{ fontSize: '3rem', marginBottom: '1rem', letterSpacing: '-0.04em' }}>Forgot Password?</h1>
                <p style={{ color: 'var(--text2)', fontSize: '1rem', lineHeight: 1.6, marginBottom: '2.5rem' }}>
                  Enter your email address and we'll send you a link to reset your password.
                </p>

                {error && (
                  <div style={{ marginBottom: '1.5rem', padding: '0.875rem 1.25rem', background: 'rgba(239,68,68,0.08)', borderRadius: '14px', color: '#EF4444', fontSize: '0.9rem', borderLeft: '3px solid #EF4444', textAlign: 'left' }}>
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', textAlign: 'left' }}>
                  <div>
                    <label className="label" style={{ display: 'block', marginBottom: '0.4rem' }}>Email Address</label>
                    <input type="email" required value={email} onChange={e => setEmail(e.target.value)} className="input" placeholder="you@example.com" />
                  </div>
                  <motion.button type="submit" disabled={loading} className="btn btn-ink" style={{ width: '100%', justifyContent: 'center', padding: '1rem' }} whileTap={{ scale: 0.98 }} whileHover={{ scale: 1.01 }}>
                    {loading ? 'Sending...' : <> Send Reset Link <Mail size={18} style={{ marginLeft: '8px' }} /> </>}
                  </motion.button>
                </form>
              </motion.div>
            ) : (
              <motion.div key="success" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
                <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'var(--accent-s)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2rem' }}>
                  <CheckCircle2 size={40} color="var(--accent)" />
                </div>
                <h2 className="display-xl" style={{ fontSize: '2.5rem', marginBottom: '1rem', letterSpacing: '-0.04em' }}>Check your email</h2>
                <p style={{ color: 'var(--text2)', fontSize: '1.1rem', lineHeight: 1.6, marginBottom: '2.5rem' }}>
                  We've sent a password reset link to <strong>{email}</strong>. Please check your inbox and follow the instructions.
                </p>
                <button onClick={() => router.push('/login')} className="btn btn-ink" style={{ width: '100%', justifyContent: 'center' }}>
                  Return to Login
                </button>
              </motion.div>
            )}
          </AnimatePresence>

        </motion.div>
      </section>
    </div>
  );
}
