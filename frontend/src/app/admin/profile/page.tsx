'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { fetchApi } from '@/lib/api';
import { useRouter } from 'next/navigation';
import { Zap, Mail, Lock, LogOut, LayoutDashboard } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';
import toast from 'react-hot-toast';

export default function AdminProfilePage() {
  const router = useRouter();

  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  // Profile Update State
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [updating, setUpdating] = useState(false);

  // Password Change State
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [changingPass, setChangingPass] = useState(false);

  useEffect(() => {
    fetchApi('/users/profile')
      .then(data => {
        setProfile(data);
        setName(data.name || '');
        setPhone(data.phone || '');
        setLoading(false);
      })
      .catch(() => {
        router.push('/login');
      });
  }, [router]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdating(true);
    try {
      await fetchApi('/users/profile', {
        method: 'PATCH',
        body: JSON.stringify({ name, phone })
      });
      toast.success('Admin profile updated successfully');
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setUpdating(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setChangingPass(true);
    try {
      await fetchApi('/users/change-password', {
        method: 'POST',
        body: JSON.stringify({ oldPassword, newPassword })
      });
      toast.success('Password changed successfully');
      setOldPassword('');
      setNewPassword('');
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setChangingPass(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  if (loading) return <div className="page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}><div className="spinner" /></div>;

  return (
    <div className="page">
      <motion.nav className="nav-bar" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{ width: 30, height: 30, borderRadius: '50%', background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Zap size={15} color="#0C0C0C" fill="#0C0C0C" />
          </div>
          <span style={{ fontFamily: 'Outfit', fontWeight: 900, fontSize: '1.05rem', letterSpacing: '-0.03em', color: 'var(--text)' }}>fitshit Admin</span>
        </div>
        <div className="nav-pill-group">
          <button onClick={() => router.push('/admin')} className="nav-pill"><LayoutDashboard size={14} style={{ marginRight: '4px' }} /> Dashboard</button>
          <span className="nav-pill active">Profile Settings</span>
          <button onClick={handleLogout} className="nav-pill" style={{ color: '#EF4444' }}><LogOut size={14} style={{ marginRight: '4px' }} /> Logout</button>
        </div>
        <ThemeToggle />
      </motion.nav>

      <section style={{ padding: '4rem 10% 8rem', maxWidth: '1100px', margin: '0 auto', width: '100%', display: 'flex', flexDirection: 'column', gap: '3rem' }}>
        
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="pill pill-amber" style={{ marginBottom: '1.5rem' }}>Admin Identity</div>
          <h1 className="display-xl" style={{ fontSize: '3.5rem', marginBottom: '1rem', letterSpacing: '-0.04em' }}>Your Profile</h1>
          <p style={{ color: 'var(--text2)', fontSize: '1.1rem', maxWidth: '500px' }}>Manage your administrative account details and security credentials.</p>
        </motion.div>

        <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '3rem', alignItems: 'start' }}>
          {/* General Update */}
          <motion.form onSubmit={handleUpdateProfile} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
            <div className="card" style={{ padding: '2.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{ marginBottom: '0.5rem' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.5rem' }}>General Information</h3>
                <p style={{ color: 'var(--text3)', fontSize: '0.85rem' }}>Your public identity within the gym portal.</p>
              </div>

              <div>
                <label className="label" style={{ display: 'block', marginBottom: '0.4rem' }}>Email Address (Login)</label>
                <div className="input" style={{ opacity: 0.7, background: 'var(--bg2)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <Mail size={16} /> {profile.email}
                </div>
              </div>

              <div>
                <label className="label" style={{ display: 'block', marginBottom: '0.4rem' }}>Admin Name</label>
                <input type="text" value={name} onChange={e => setName(e.target.value)} className="input" placeholder="Owner Name" />
              </div>

              <div>
                <label className="label" style={{ display: 'block', marginBottom: '0.4rem' }}>Contact Phone</label>
                <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} className="input" placeholder="Phone number" />
              </div>

              <motion.button type="submit" disabled={updating} className="btn btn-ink" style={{ alignSelf: 'flex-start', marginTop: '0.5rem' }} whileTap={{ scale: 0.97 }}>
                {updating ? 'Updating Profile...' : 'Update Admin Info'}
              </motion.button>
            </div>
          </motion.form>

          {/* Security */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
            <div className="card" style={{ padding: '2.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.5rem' }}>Security</h3>
                <p style={{ color: 'var(--text3)', fontSize: '0.85rem' }}>Keep your admin access secure.</p>
              </div>

              <form onSubmit={handleChangePassword} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div>
                  <label className="label" style={{ display: 'block', marginBottom: '0.4rem' }}>Current Password</label>
                  <input type="password" required value={oldPassword} onChange={e => setOldPassword(e.target.value)} className="input" placeholder="••••••••" />
                </div>

                <div>
                  <label className="label" style={{ display: 'block', marginBottom: '0.4rem' }}>New Admin Password</label>
                  <input type="password" required value={newPassword} onChange={e => setNewPassword(e.target.value)} className="input" placeholder="••••••••" />
                </div>

                <motion.button type="submit" disabled={changingPass} className="btn btn-outline" style={{ width: '100%', justifyContent: 'center' }} whileTap={{ scale: 0.97 }}>
                  {changingPass ? 'Saving...' : <> <Lock size={15} style={{ marginRight: '8px' }} /> Change Password </>}
                </motion.button>
              </form>
            </div>
          </motion.div>
        </div>

      </section>
    </div>
  );
}
