'use client';
import { useEffect, useState } from 'react';
// Last Sync: 2026-04-14 19:55
import { motion } from 'framer-motion';
import { fetchApi } from '@/lib/api';
import { useRouter, useParams } from 'next/navigation';
import { Zap, User } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';

export default function MemberDashboard() {
  const router = useRouter();
  const { subdomain } = useParams();
  const [stats, setStats] = useState<any>(null);
  useEffect(() => { fetchApi('/dashboard/member').then(setStats).catch(() => router.push('/login')); }, [router]);

  if (!stats) return <div className="page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}><div className="spinner" /></div>;
  const isExpired = stats.status === 'EXPIRED';
  const days = Math.max(0, stats.daysRemaining ?? 0);
  const pct = Math.min(100, Math.round((days / 365) * 100));

  return (
    <div className="page">
      <motion.nav className="nav-bar" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{ width: 30, height: 30, borderRadius: '50%', background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Zap size={15} color="#0C0C0C" fill="#0C0C0C" />
          </div>
          <a href="/" style={{ fontFamily: 'Outfit', fontWeight: 900, fontSize: '1.05rem', letterSpacing: '-0.03em', color: 'var(--text)', textDecoration: 'none' }}>
            {stats.gym?.name || 'fitshit'}
          </a>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <ThemeToggle />
          <button className="btn btn-ink" onClick={() => router.push('/profile')} style={{ padding: '0.55rem 1.25rem', fontSize: '0.85rem' }}>
            <User size={14} style={{ marginRight: '4px' }} /> Profile
          </button>
          <button className="btn btn-outline" onClick={() => { localStorage.removeItem('token'); router.push('/login'); }} style={{ padding: '0.55rem 1.25rem', fontSize: '0.85rem' }}>Sign Out</button>
        </div>
      </motion.nav>

      <section style={{ padding: '4rem 10%', maxWidth: '900px', margin: '0 auto', width: '100%' }}>
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: [0.25,0.46,0.45,0.94] }}>
          <p className="label" style={{ marginBottom: '0.75rem' }}>My Membership</p>

          {/* Big number */}
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '1.5rem', marginBottom: '2rem' }}>
            <motion.p className="display-xl" style={{ fontSize: 'clamp(7rem, 20vw, 14rem)', color: isExpired ? 'var(--text3)' : 'var(--text)', lineHeight: 0.9 }}
              initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.7, type: 'spring', damping: 14 }}>
              {days}
            </motion.p>
            <div style={{ paddingBottom: '1rem' }}>
              <p style={{ fontFamily: 'Outfit', fontWeight: 700, fontSize: '1.1rem', color: 'var(--text2)', marginBottom: '0.25rem' }}>days remaining</p>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.3rem 0.875rem', background: isExpired ? 'var(--bg3)' : 'var(--accent)', borderRadius: '999px' }}>
                {!isExpired && <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#0C0C0C' }} />}
                <span style={{ fontWeight: 800, fontSize: '0.75rem', color: isExpired ? 'var(--text3)' : '#0C0C0C', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  {isExpired ? 'Expired' : 'Active'}
                </span>
              </div>
            </div>
          </div>

          {/* Progress bar */}
          <div style={{ height: 4, background: 'var(--border)', borderRadius: 2, marginBottom: '1rem', overflow: 'hidden' }}>
            <motion.div style={{ height: '100%', background: isExpired ? 'var(--text3)' : 'var(--accent)', borderRadius: 2 }}
              initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 1.2, delay: 0.4, ease: [0.25,0.46,0.45,0.94] }} />
          </div>

          {stats.expiryDate && (
            <div style={{ display: 'flex', gap: '2rem', marginBottom: '3rem', borderTop: '1px solid var(--border)', paddingTop: '1.5rem', marginTop: '2rem' }}>
              <div>
                <p className="label" style={{ marginBottom: '0.25rem' }}>{isExpired ? 'Expired on' : 'Valid until'}</p>
                <p style={{ color: 'var(--text2)', fontWeight: 600 }}>
                  {new Date(stats.expiryDate).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
                </p>
              </div>
              
              {stats.plan && (
                <div>
                  <p className="label" style={{ marginBottom: '0.25rem' }}>Current Plan</p>
                  <p style={{ color: 'var(--text2)', fontWeight: 600 }}>{stats.plan.name}</p>
                </div>
              )}

              {stats.phone && (
                <div>
                  <p className="label" style={{ marginBottom: '0.25rem' }}>Reg. Phone</p>
                  <p style={{ color: 'var(--text2)', fontWeight: 600 }}>{stats.phone}</p>
                </div>
              )}
            </div>
          )}

          {isExpired && (
            <motion.a href="/signup" className="btn btn-amber" whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              Renew Membership →
            </motion.a>
          )}
        </motion.div>

        {/* Announcements Feed */}
        {stats.gym?.announcements && stats.gym.announcements.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}
            style={{ marginTop: '5rem', borderTop: '1px solid var(--border)', paddingTop: '4rem' }}>
            <p className="label" style={{ marginBottom: '2rem' }}>Gym Announcements</p>
            <div style={{ display: 'grid', gap: '1.25rem' }}>
              {stats.gym.announcements.map((a: any, i: number) => (
                <motion.div key={a.id} initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 + i * 0.1 }}
                  className="card" style={{ padding: '1.75rem', background: 'var(--bg2)', border: '1.5px solid var(--border)' }}>
                  <p style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.75rem' }}>
                    {new Date(a.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                  </p>
                  <p style={{ fontSize: '1.05rem', color: 'var(--text)', lineHeight: 1.6, fontWeight: 500, whiteSpace: 'pre-wrap' }}>
                    {a.content}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </section>
    </div>
  );
}
