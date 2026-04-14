'use client';
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { fetchApi } from '@/lib/api';
import { useRouter } from 'next/navigation';
import { Users, UserPlus, LogOut, Globe, BarChart2, Zap, ArrowUpRight, Tag, Trash2, ChevronDown, ChevronUp, User } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';
import toast from 'react-hot-toast';

export default function AdminDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState<any>(null);
  const [members, setMembers] = useState<any[]>([]);
  const [allPlans, setAllPlans] = useState<any[]>([]);
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  // Filters State
  const [filterPlan, setFilterPlan] = useState('ALL');
  const [filterGender, setFilterGender] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState('ALL');

  useEffect(() => {
    fetchApi('/dashboard/admin').then(setStats).catch(() => router.push('/login'));
    fetchApi('/users').then(setMembers).catch(console.error);
    fetchApi('/gyms/me/plans').then(setAllPlans).catch(console.error);
  }, [router]);

  const handleDeleteMember = async (id: string, email: string) => {
    toast.custom((t) => (
      <div style={{ background: 'var(--bg-card)', padding: '1.25rem', borderRadius: '12px', border: '1px solid var(--border)', boxShadow: '0 10px 40px rgba(0,0,0,0.1)' }}>
        <p style={{ fontWeight: 700, marginBottom: '0.75rem', color: 'var(--text)' }}>Delete {email}?</p>
        <p style={{ fontSize: '0.85rem', color: 'var(--text2)', marginBottom: '1rem' }}>This action cannot be undone.</p>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button className="btn btn-outline" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem', flex: 1 }} onClick={() => toast.dismiss(t.id)}>Cancel</button>
          <button className="btn" style={{ background: '#e11d48', color: '#fff', border: 'none', padding: '0.5rem 1rem', fontSize: '0.85rem', flex: 1, borderRadius: '99px' }} onClick={async () => {
            toast.dismiss(t.id);
            try {
              await fetchApi(`/users/${id}`, { method: 'DELETE' });
              setMembers(members => members.filter(m => m.id !== id));
              fetchApi('/dashboard/admin').then(setStats);
              toast.success('Member deleted');
            } catch (err: any) {
              toast.error('Failed to delete member');
            }
          }}>Delete</button>
        </div>
      </div>
    ), { duration: Infinity });
  };

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
            <span style={{ fontFamily: 'Outfit', fontWeight: 900, fontSize: '0.95rem', letterSpacing: '-0.03em', color: 'var(--text)' }}>
              {stats.gymName || 'fitshit'}
            </span>
          </div>
          <p className="label" style={{ paddingLeft: '0.25rem' }}>Admin</p>
        </div>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem', flex: 1 }}>
          <div className="nav-item active"><Users size={15} /> Members</div>
          <button className="nav-item" onClick={() => router.push('/admin/analytics')}><BarChart2 size={15} /> Analytics</button>
          <button className="nav-item" onClick={() => router.push('/admin/add-member')}><UserPlus size={15} /> Add Member</button>
          <button className="nav-item" onClick={() => router.push('/admin/plans')}><Tag size={15} /> Plans & Pricing</button>
          <button className="nav-item" onClick={() => router.push('/admin/announcements')}><Zap size={15} /> Announcements</button>
          <button className="nav-item" onClick={() => router.push('/admin/website')}><Globe size={15} /> Website</button>
          <button className="nav-item" onClick={() => router.push('/admin/profile')}><User size={15} /> Profile Settings</button>
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

        {/* Members table */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25, duration: 0.5 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <h2 style={{ fontFamily: 'Outfit', fontWeight: 800, fontSize: '1.25rem', color: 'var(--text)', letterSpacing: '-0.02em' }}>
              Members <span style={{ color: 'var(--text3)', fontWeight: 500 }}>· {members.length}</span>
            </h2>
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
              <select className="input" style={{ width: 140, padding: '0.4rem 0.75rem', fontSize: '0.85rem' }} value={filterPlan} onChange={e => setFilterPlan(e.target.value)}>
                <option value="ALL">All Plans</option>
                {allPlans.map(p => (
                  <option key={p.id} value={p.name}>{p.name}</option>
                ))}
              </select>
              <select className="input" style={{ width: 140, padding: '0.4rem 0.75rem', fontSize: '0.85rem' }} value={filterGender} onChange={e => setFilterGender(e.target.value)}>
                <option value="ALL">All Genders</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
              <select className="input" style={{ width: 140, padding: '0.4rem 0.75rem', fontSize: '0.85rem' }} value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
                <option value="ALL">All Status</option>
                <option value="ACTIVE">Active</option>
                <option value="EXPIRED">Expired</option>
                <option value="NONE">No Plan</option>
              </select>
              <motion.button className="btn btn-outline" onClick={() => router.push('/admin/add-member')}
                style={{ padding: '0.55rem 1.25rem', fontSize: '0.85rem', marginLeft: '1rem' }} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>
                <UserPlus size={14} /> Add
              </motion.button>
            </div>
          </div>

          <div className="card" style={{ overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ background: 'var(--bg3)' }}>
                  {['Name / Email', 'Status', 'Expires', ''].map(h => (
                    <th key={h} style={{ padding: '0.875rem 1.5rem', textAlign: 'left' }} className="label">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {members.filter(m => {
                  const isExpired = m.membership && new Date(m.membership.endDate) < new Date();
                  const statusLabel = m.membership ? (isExpired ? 'EXPIRED' : 'ACTIVE') : 'NONE';
                  if (filterStatus !== 'ALL' && statusLabel !== filterStatus) return false;
                  if (filterGender !== 'ALL' && (m.gender || 'Other') !== filterGender) return false;
                  if (filterPlan !== 'ALL' && m.membership?.plan?.name !== filterPlan) return false;
                  return true;
                }).map((m, i) => {
                  const isExpired = m.membership && new Date(m.membership.endDate) < new Date();
                  const isExpanded = expandedRow === m.id;

                  return (
                    <React.Fragment key={m.id}>
                      <motion.tr initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 + Math.min(i * 0.04, 0.5) }}
                        style={{ borderBottom: isExpanded ? 'none' : '1px solid var(--border)', cursor: 'pointer', background: isExpanded ? 'var(--bg3)' : 'transparent' }}
                        onClick={() => setExpandedRow(isExpanded ? null : m.id)}>
                        <td style={{ padding: '1rem 1.5rem', fontWeight: 600, color: 'var(--text)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <span style={{ color: 'var(--text3)', display: 'flex', alignItems: 'center' }}>
                            {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                          </span>
                          <div>
                            <div style={{ color: 'var(--text)' }}>{m.name || '—'}</div>
                            <div style={{ fontSize: '0.8rem', color: 'var(--text3)', fontWeight: 500 }}>{m.email}</div>
                          </div>
                        </td>
                        <td style={{ padding: '1rem 1.5rem' }}>
                          {m.membership ? <span className={isExpired ? 'badge-expired' : 'badge-active'}>{isExpired ? 'Expired' : 'Active'}</span> : <span className="badge-none">No Plan</span>}
                        </td>
                        <td style={{ padding: '1rem 1.5rem', color: 'var(--text3)' }}>
                          {m.membership ? new Date(m.membership.endDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : '—'}
                        </td>
                        <td style={{ padding: '1rem 1.5rem', textAlign: 'right', display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }} onClick={(e) => e.stopPropagation()}>
                          <button onClick={() => router.push(`/admin/members/${m.id}`)} style={{ background: 'transparent', border: 'none', color: 'var(--text3)', cursor: 'pointer' }} title="Edit user">
                            <ArrowUpRight size={16} />
                          </button>
                          <button onClick={() => handleDeleteMember(m.id, m.email)} style={{ background: 'transparent', border: 'none', color: 'var(--text3)', cursor: 'pointer' }} title="Delete user">
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </motion.tr>
                      {isExpanded && (
                        <tr style={{ borderBottom: '1px solid var(--border)', background: 'var(--bg3)' }}>
                          <td colSpan={4} style={{ padding: '0 1.5rem 1.5rem 3.5rem' }}>
                            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                              style={{ overflow: 'hidden', display: 'flex', gap: '3rem' }}>
                              <div>
                                <p className="label" style={{ marginBottom: '0.3rem' }}>Phone</p>
                                <p style={{ fontSize: '0.9rem', color: 'var(--text)', fontWeight: 500 }}>{m.phone || '—'}</p>
                              </div>
                              <div>
                                <p className="label" style={{ marginBottom: '0.3rem' }}>Gender</p>
                                <p style={{ fontSize: '0.9rem', color: 'var(--text)', fontWeight: 500 }}>{m.gender || '—'}</p>
                              </div>
                              <div>
                                <p className="label" style={{ marginBottom: '0.3rem' }}>Current Plan</p>
                                <p style={{ fontSize: '0.9rem', color: 'var(--text)', fontWeight: 500 }}>
                                  {m.membership?.plan ? `${m.membership.plan.name} (₹${m.membership.plan.price})` : '—'}
                                </p>
                              </div>
                              <div>
                                <p className="label" style={{ marginBottom: '0.3rem' }}>Registered On</p>
                                <p style={{ fontSize: '0.9rem', color: 'var(--text)', fontWeight: 500 }}>
                                  {new Date(m.createdAt).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
                                </p>
                              </div>
                            </motion.div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
                {members.length === 0 && (
                  <tr><td colSpan={4} style={{ padding: '4rem', textAlign: 'center', color: 'var(--text3)' }}>
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
