'use client';
import { useState, useEffect, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchApi } from '@/lib/api';
import { useRouter, useSearchParams } from 'next/navigation';
import { Zap, Lock, CheckCircle2, AlertCircle } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';

function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!token) {
      setError('Invalid or missing reset token.');
    }
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    setError('');
    try {
      await fetchApi('/auth/reset-password', {
        method: 'POST',
        body: JSON.stringify({ token, newPassword: password })
      });
      setSuccess(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div style={{ maxWidth: '450px', width: '100%', textAlign: 'center' }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
      <AnimatePresence mode="wait">
        {!success ? (
          <motion.div key="reset-form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="pill pill-amber" style={{ marginBottom: '1.5rem', display: 'inline-block' }}>Update</div>
            <h1 className="display-xl" style={{ fontSize: '3rem', marginBottom: '1rem', letterSpacing: '-0.04em' }}>New Password</h1>
            <p style={{ color: 'var(--text2)', fontSize: '1rem', lineHeight: 1.6, marginBottom: '2.5rem' }}>
              Please enter your new password below to regain access to your account.
            </p>

            {error && (
              <div style={{ marginBottom: '1.5rem', padding: '0.875rem 1.25rem', background: 'rgba(239,68,68,0.08)', borderRadius: '14px', color: '#EF4444', fontSize: '0.9rem', borderLeft: '3px solid #EF4444', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <AlertCircle size={18} />
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', textAlign: 'left' }}>
              <div>
                <label className="label" style={{ display: 'block', marginBottom: '0.4rem' }}>New Password</label>
                <input type="password" required value={password} onChange={e => setPassword(e.target.value)} className="input" placeholder="••••••••" />
              </div>
              <div>
                <label className="label" style={{ display: 'block', marginBottom: '0.4rem' }}>Confirm New Password</label>
                <input type="password" required value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} className="input" placeholder="••••••••" />
              </div>
              <motion.button type="submit" disabled={loading || !token} className="btn btn-ink" style={{ width: '100%', justifyContent: 'center', padding: '1rem' }} whileTap={{ scale: 0.98 }} whileHover={{ scale: 1.01 }}>
                {loading ? 'Updating...' : <> Update Password <Lock size={18} style={{ marginLeft: '8px' }} /> </>}
              </motion.button>
            </form>
          </motion.div>
        ) : (
          <motion.div key="reset-success" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
            <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'var(--accent-s)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2rem' }}>
              <CheckCircle2 size={40} color="var(--accent)" />
            </div>
            <h2 className="display-xl" style={{ fontSize: '2.5rem', marginBottom: '1rem', letterSpacing: '-0.04em' }}>Password Updated</h2>
            <p style={{ color: 'var(--text2)', fontSize: '1.1rem', lineHeight: 1.6, marginBottom: '2.5rem' }}>
              Your password has been changed successfully. You can now use your new password to sign in.
            </p>
            <button onClick={() => router.push('/login')} className="btn btn-ink" style={{ width: '100%', justifyContent: 'center' }}>
              Sign In
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function ResetPasswordPage() {
  const router = useRouter();

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
          <button onClick={() => router.push('/login')} className="nav-pill">← Cancel</button>
        </div>
        <ThemeToggle />
      </motion.nav>

      <section style={{ padding: '6rem 10% 5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '80vh', maxWidth: '1400px', margin: '0 auto', width: '100%' }}>
        <Suspense fallback={<div className="spinner" />}>
          <ResetPasswordContent />
        </Suspense>
      </section>
    </div>
  );
}
