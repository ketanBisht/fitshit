'use client';
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { fetchApi } from '@/lib/api';
import { useRouter } from 'next/navigation';
import { Users, UserPlus, LogOut, Globe, BarChart2, Zap, Tag } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, Legend } from 'recharts';

const COLORS = ['#10b981', '#f59e0b', '#3b82f6', '#8b5cf6', '#ef4444', '#ec4899'];

export default function AnalyticsDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    fetchApi('/dashboard/admin').then(setStats).catch(() => router.push('/login'));
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
          <button className="nav-item" onClick={() => router.push('/admin')}><Users size={15} /> Members</button>
          <div className="nav-item active"><BarChart2 size={15} /> Analytics</div>
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
            <h1 className="display-xl" style={{ fontSize: '3.25rem' }}>Analytics</h1>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15, duration: 0.5 }}
          style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
          
          <div className="card" style={{ padding: '2rem', borderTop: '4px solid #10b981' }}>
            <p className="label" style={{ marginBottom: '0.5rem' }}>Total Revenue</p>
            <p className="stat-num" style={{ fontSize: '3rem', color: '#10b981' }}>₹{stats.totalRevenue || 0}</p>
            <p style={{ fontSize: '0.85rem', color: 'var(--text3)', marginTop: '0.5rem' }}>Aggregated across all payments</p>
          </div>

          <div className="card" style={{ padding: '2rem', borderTop: '4px solid var(--text)' }}>
            <p className="label" style={{ marginBottom: '0.5rem' }}>Total Members</p>
            <p className="stat-num" style={{ fontSize: '3rem', color: 'var(--text)' }}>{stats.totalMembers}</p>
            <p style={{ fontSize: '0.85rem', color: 'var(--text3)', marginTop: '0.5rem' }}>All registered users</p>
          </div>

          <div className="card" style={{ padding: '2rem', borderTop: '4px solid var(--accent)' }}>
            <p className="label" style={{ marginBottom: '0.5rem' }}>Active Members</p>
            <p className="stat-num" style={{ fontSize: '3rem', color: 'var(--accent)' }}>{stats.activeMembers}</p>
            <p style={{ fontSize: '0.85rem', color: 'var(--text3)', marginTop: '0.5rem' }}>Currently active subscription</p>
          </div>

          <div className="card" style={{ padding: '2rem', borderTop: '4px solid var(--text)' }}>
            <p className="label" style={{ marginBottom: '0.5rem' }}>Expiring Soon</p>
            <p className="stat-num" style={{ fontSize: '3rem', color: 'var(--text)' }}>{stats.expiringSoon}</p>
            <p style={{ fontSize: '0.85rem', color: 'var(--text3)', marginTop: '0.5rem' }}>Expiring in next 7 days</p>
          </div>

          <div className="card" style={{ padding: '2rem', borderTop: '4px solid var(--text3)' }}>
            <p className="label" style={{ marginBottom: '0.5rem' }}>Expired Plans</p>
            <p className="stat-num" style={{ fontSize: '3rem', color: 'var(--text3)' }}>{stats.expiredMembers}</p>
            <p style={{ fontSize: '0.85rem', color: 'var(--text3)', marginTop: '0.5rem' }}>Lapsed memberships</p>
          </div>

        </motion.div>

        {/* Charts Section */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25, duration: 0.5 }}
          style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: '2rem' }}>
          
          {/* Revenue Trend Line Chart */}
          <div className="card" style={{ padding: '2rem', gridColumn: 'span 2' }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <BarChart2 size={20} color="var(--accent)" /> Revenue Trend
            </h3>
            <div style={{ height: 350, width: '100%' }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={stats.revenueTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                  <XAxis dataKey="name" stroke="var(--text3)" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="var(--text3)" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `₹${val}`} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '12px', color: 'var(--text)' }}
                    itemStyle={{ color: 'var(--accent)', fontWeight: 800 }}
                  />
                  <Line type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={4} dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }} activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Gender Distribution Pie Chart */}
          <div className="card" style={{ padding: '2rem' }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Users size={20} color="var(--accent)" /> Demographics
            </h3>
            <div style={{ height: 300, width: '100%' }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={stats.genderDistribution} cx="50%" cy="50%" innerRadius={70} outerRadius={100} paddingAngle={5} dataKey="count">
                    {stats.genderDistribution?.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="transparent" />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '12px', color: 'var(--text)' }}
                    itemStyle={{ fontWeight: 800 }}
                  />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Plan Distribution Bar Chart */}
          <div className="card" style={{ padding: '2rem' }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Tag size={20} color="var(--accent)" /> Plan Popularity
            </h3>
            <div style={{ height: 300, width: '100%' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.planDistribution} layout="vertical" margin={{ top: 0, right: 0, left: 30, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" horizontal={true} vertical={false} />
                  <XAxis type="number" stroke="var(--text3)" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis type="category" dataKey="name" stroke="var(--text)" fontSize={13} tickLine={false} axisLine={false} fontWeight={600} />
                  <Tooltip 
                    cursor={{ fill: 'var(--bg3)' }}
                    contentStyle={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '12px', color: 'var(--text)' }}
                    itemStyle={{ color: 'var(--accent)', fontWeight: 800 }}
                  />
                  <Bar dataKey="count" fill="var(--accent)" radius={[0, 6, 6, 0]} barSize={24} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

        </motion.div>
      </main>
    </div>
  );
}
