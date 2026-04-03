'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { fetchApi } from '@/lib/api';
import { useRouter } from 'next/navigation';
import { Users, UserPlus, LogOut, Globe, BarChart2, Zap, ArrowUpRight, Tag } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';

export default function AdminDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState<any>(null);
  const [members, setMembers] = useState<any[]>([]);

  useEffect(() => {
    fetchApi('/dashboard/admin').then(setStats).catch(() => router.push('/login'));
    fetchApi('/users').then(setMembers).catch(console.error);
  }, [router]);

  if (!stats) return <div className="page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}><div className="spinner" /></div>;

  return (
    <div className="page" style={{ display: 'flex' }}>
      {/* Sidebar */}
      <aside className="sidebar">
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
            <div style={{ width: 26, height: 26, borderRadius: '50%', background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Zap size={13} color="#0C0C0C" fill="#0C0C0C" />
            </div>
            <span style={{ fontFamily: 'Outfit', fontWeight: 900, fontSize: '0.95rem', letterSpacing: '-0.03em', color: 'var(--text)' }}>fitshit</span>
          </div>
          <p className="label" style={{ paddingLeft: '0.25rem' }}>Admin</p>
        </div>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem', flex: 1 }}>
          <div className="nav-item active"><BarChart2 size={15} /> Overview</div>
          <button className="nav-item" onClick={() => router.push('/admin/add-member')}><UserPlus size={15} /> Add Member</button>
          <button className="nav-item" onClick={() => router.push('/admin/plans')}><Tag size={15} /> Plans & Pricing</button>
          <button className="nav-item" onClick={() => router.push('/admin/announcements')}><Zap size={15} /> Announcements</button>
          <button className="nav-item" onClick={() => router.push('/admin/website')}><Globe size={15} /> Website</button>
        </nav>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <ThemeToggle />
          <button className="nav-item" onClick={() => { localStorage.removeItem('token'); router.push('/login'); }}><LogOut size={15} /> Sign Out</button>
        </div>
      </aside>

      {/* Main */}
      <main style={{ flex: 1, overflow: 'auto', padding: '2.5rem 3rem', background: 'var(--bg)', transition: 'background 0.35s' }}>
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
          style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '3rem' }}>
          <div>
            <p className="label" style={{ marginBottom: '0.375rem' }}>Dashboard</p>
            <h1 className="display-xl" style={{ fontSize: '3.25rem' }}>Overview</h1>
          </div>
          <motion.button className="btn btn-amber" onClick={() => router.push('/admin/add-member')}
            style={{ padding: '0.7rem 1.5rem', fontSize: '0.875rem' }} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            <UserPlus size={15} /> Add Member
          </motion.button>
        </motion.div>

        {/* Stats — inline row, not 4 cards */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15, duration: 0.5 }}
          style={{ display: 'flex', gap: '3.5rem', borderBottom: '1px solid var(--border)', paddingBottom: '2.5rem', marginBottom: '2.5rem' }}>
          {[
            { label: 'Total Members', val: stats.totalMembers, color: 'var(--text)' },
            { label: 'Active', val: stats.activeMembers, color: 'var(--accent)' },
            { label: 'Expiring Soon', val: stats.expiringSoon, color: 'var(--text)' },
            { label: 'Expired', val: stats.expiredMembers, color: 'var(--text3)' },
          ].map(s => (
            <div key={s.label}>
              <p className="label" style={{ marginBottom: '0.5rem' }}>{s.label}</p>
              <p className="stat-num" style={{ fontSize: '3rem', color: s.color }}>{s.val}</p>
            </div>
          ))}
        </motion.div>

        {/* Members table */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25, duration: 0.5 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <h2 style={{ fontFamily: 'Outfit', fontWeight: 800, fontSize: '1.25rem', color: 'var(--text)', letterSpacing: '-0.02em' }}>
              Members <span style={{ color: 'var(--text3)', fontWeight: 500 }}>· {members.length}</span>
            </h2>
            <motion.button className="btn btn-outline" onClick={() => router.push('/admin/add-member')}
              style={{ padding: '0.55rem 1.25rem', fontSize: '0.85rem' }} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>
              <UserPlus size={14} /> Add
            </motion.button>
          </div>

          <div className="card" style={{ overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ background: 'var(--bg3)' }}>
                  {['Email', 'Status', 'Expires'].map(h => (
                    <th key={h} style={{ padding: '0.875rem 1.5rem', textAlign: 'left' }} className="label">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {members.map((m, i) => {
                  const isExpired = m.membership && new Date(m.membership.endDate) < new Date();
                  return (
                    <motion.tr key={m.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 + i * 0.04 }}
                      style={{ borderBottom: '1px solid var(--border)' }}>
                      <td style={{ padding: '1rem 1.5rem', fontWeight: 600, color: 'var(--text)' }}>{m.email}</td>
                      <td style={{ padding: '1rem 1.5rem' }}>
                        {m.membership ? <span className={isExpired ? 'badge-expired' : 'badge-active'}>{isExpired ? 'Expired' : 'Active'}</span> : <span className="badge-none">No Plan</span>}
                      </td>
                      <td style={{ padding: '1rem 1.5rem', color: 'var(--text3)' }}>
                        {m.membership ? new Date(m.membership.endDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : '—'}
                      </td>
                    </motion.tr>
                  );
                })}
                {members.length === 0 && (
                  <tr><td colSpan={3} style={{ padding: '4rem', textAlign: 'center', color: 'var(--text3)' }}>
                    No members yet — <a href="/admin/add-member" style={{ color: 'var(--accent)', fontWeight: 700, textDecoration: 'none' }}>add your first one.</a>
                  </td></tr>
                )}
              </tbody>
            </table>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
