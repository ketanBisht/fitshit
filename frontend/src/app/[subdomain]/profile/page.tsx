'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchApi } from '@/lib/api';
import { useRouter, useParams } from 'next/navigation';
import { Zap, User, Phone, Mail, Lock, CheckCircle2, AlertCircle, LogOut } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';
import toast from 'react-hot-toast';
// Last Sync: 2026-04-14 19:55

export default function MemberProfilePage() {
  const router = useRouter();
  const params = useParams();
  const subdomain = params?.subdomain as string;

  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  
  // Profile Update State
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [gender, setGender] = useState('');
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
        setGender(data.gender || '');
        setLoading(false);
      })
      .catch((err) => {
        console.error('Profile load error:', err);
        setError(true);
        setLoading(false);
        toast.error('Failed to load profile details');
      });
  }, [router]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdating(true);
    try {
      await fetchApi('/users/profile', {
        method: 'PATCH',
        body: JSON.stringify({ name, phone, gender })
      });
      toast.success('Profile updated successfully');
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

  if (error || !profile) return (
    <div className="page" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '2rem' }}>
      <AlertCircle size={60} color="#EF4444" />
      <div style={{ textAlign: 'center' }}>
        <h2 className="display-xl" style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Session Expired</h2>
        <p style={{ color: 'var(--text2)', marginBottom: '2rem' }}>Please log in again to view your profile settings.</p>
        <button onClick={() => router.push('/login')} className="btn btn-ink">Go to Login</button>
      </div>
    </div>
  );

  return (
    <div className="page">
      <motion.nav className="nav-bar" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{ width: 30, height: 30, borderRadius: '50%', background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Zap size={15} color="#0C0C0C" fill="#0C0C0C" />
          </div>
          <span style={{ fontFamily: 'Outfit', fontWeight: 900, fontSize: '1.05rem', letterSpacing: '-0.03em', color: 'var(--text)' }}>
            {profile.gym?.name || 'FitShit'}
          </span>
        </div>
        <div className="nav-pill-group">
          <button onClick={() => router.push('/dashboard')} className="nav-pill">Home</button>
          <span className="nav-pill active">Profile</span>
          <button onClick={handleLogout} className="nav-pill" style={{ color: '#EF4444' }}><LogOut size={14} style={{ marginRight: '4px' }} /> Logout</button>
        </div>
        <ThemeToggle />
      </motion.nav>

      <section style={{ padding: '4rem 10% 8rem', maxWidth: '1200px', margin: '0 auto', width: '100%', display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '4rem' }}>
        
        {/* Left Side: General Info & Update */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <div className="pill pill-amber" style={{ marginBottom: '1.5rem' }}>Personal Details</div>
          <h1 className="display-xl" style={{ fontSize: '3.5rem', marginBottom: '2.5rem', letterSpacing: '-0.04em' }}>Your Account</h1>
          
          <form onSubmit={handleUpdateProfile} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div className="card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <label className="label" style={{ display: 'block', marginBottom: '0.4rem' }}>Email Address (Locked)</label>
                <div className="input" style={{ opacity: 0.7, background: 'var(--bg2)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <Mail size={16} /> {profile.email}
                </div>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label className="label" style={{ display: 'block', marginBottom: '0.4rem' }}>Full Name</label>
                  <input type="text" value={name} onChange={e => setName(e.target.value)} className="input" placeholder="Enter name" />
                </div>
                <div>
                  <label className="label" style={{ display: 'block', marginBottom: '0.4rem' }}>Phone Number</label>
                  <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} className="input" placeholder="Phone number" />
                </div>
              </div>

              <div>
                <label className="label" style={{ display: 'block', marginBottom: '0.4rem' }}>Gender</label>
                <select value={gender} onChange={e => setGender(e.target.value)} className="input">
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <motion.button type="submit" disabled={updating} className="btn btn-ink" style={{ alignSelf: 'flex-start', marginTop: '0.5rem' }} whileTap={{ scale: 0.97 }}>
                {updating ? 'Updating...' : 'Save Changes'}
              </motion.button>
            </div>
          </form>

          {/* Membership Stats (If applicable) */}
          {profile.membership && (
             <div style={{ marginTop: '3rem' }}>
               <p className="label" style={{ marginBottom: '1rem' }}>Membership Status</p>
               <div style={{ padding: '2rem', background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                 <div>
                   <p style={{ color: 'var(--text3)', fontSize: '0.8rem', marginBottom: '0.25rem' }}>Current Plan</p>
                   <p style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text)' }}>{profile.membership.plan?.name || 'Standard'}</p>
                 </div>
                 <div style={{ textAlign: 'right' }}>
                   <p style={{ color: 'var(--text3)', fontSize: '0.8rem', marginBottom: '0.25rem' }}>Expires on</p>
                   <p style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text2)' }}>{new Date(profile.membership.endDate).toLocaleDateString()}</p>
                 </div>
                 <div className="pill" style={{ background: profile.membership.status === 'ACTIVE' ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)', color: profile.membership.status === 'ACTIVE' ? '#10B981' : '#EF4444', border: profile.membership.status === 'ACTIVE' ? '1px solid #10B981' : '1px solid #EF4444' }}>
                   {profile.membership.status}
                 </div>
               </div>
             </div>
          )}
        </motion.div>

        {/* Right Side: Security / Password */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
          <div className="pill" style={{ marginBottom: '1.5rem', background: 'rgba(239,68,68,0.08)', color: '#EF4444', border: 'none' }}>Security</div>
          <h2 style={{ fontFamily: 'Outfit', fontWeight: 800, fontSize: '2rem', marginBottom: '2.5rem', letterSpacing: '-0.03em' }}>Password Settings</h2>

          <div className="card" style={{ padding: '2rem', marginBottom: '1.5rem' }}>
            <form onSubmit={handleChangePassword} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <p style={{ color: 'var(--text2)', fontSize: '0.9rem', marginBottom: '0.5rem', lineHeight: 1.5 }}>
                Know your current password? Change it directly below.
              </p>
              
              <div>
                <label className="label" style={{ display: 'block', marginBottom: '0.4rem' }}>Existing Password</label>
                <input type="password" required value={oldPassword} onChange={e => setOldPassword(e.target.value)} className="input" placeholder="••••••••" />
              </div>

              <div>
                <label className="label" style={{ display: 'block', marginBottom: '0.4rem' }}>New Password</label>
                <input type="password" required value={newPassword} onChange={e => setNewPassword(e.target.value)} className="input" placeholder="••••••••" />
              </div>

              <motion.button type="submit" disabled={changingPass} className="btn btn-ink" style={{ width: '100%', justifyContent: 'center' }} whileTap={{ scale: 0.97 }}>
                {changingPass ? 'Updating Password...' : <> <Lock size={15} style={{ marginRight: '8px' }} /> Update Password </>}
              </motion.button>
            </form>
          </div>

          <div className="card" style={{ padding: '2rem', background: 'rgba(245,166,35,0.05)', border: '1px dashed var(--accent)' }}>
             <h3 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <AlertCircle size={16} color="var(--accent)" /> Forgot current password?
             </h3>
             <p style={{ fontSize: '0.85rem', color: 'var(--text2)', lineHeight: 1.5, marginBottom: '1.25rem' }}>
                If you don't know your existing password, we can send a secure reset link to your email ({profile.email}).
             </p>
             <button 
                onClick={async () => {
                   try {
                      await fetchApi('/auth/forgot-password', {
                         method: 'POST',
                         body: JSON.stringify({ email: profile.email, subdomain })
                      });
                      toast.success('Reset link sent to your email!');
                   } catch (err: any) {
                      toast.error('Failed to send reset link');
                   }
                }} 
                className="btn btn-outline" 
                style={{ width: '100%', justifyContent: 'center', background: 'transparent' }}
             >
                Send Reset Link
             </button>
          </div>

          <div style={{ marginTop: '2rem', padding: '1.5rem', background: 'var(--bg2)', borderRadius: '16px', border: '1px solid var(--border)' }}>
             <p style={{ fontSize: '0.8rem', color: 'var(--text3)', lineHeight: 1.6 }}>
               <strong>Need help?</strong> If you have any issues with your membership or account, please contact the gym front desk.
             </p>
          </div>
        </motion.div>

      </section>
    </div>
  );
}
