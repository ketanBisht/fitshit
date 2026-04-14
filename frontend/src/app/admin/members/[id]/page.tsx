'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { fetchApi } from '@/lib/api';
import { useRouter, useParams } from 'next/navigation';
import { Zap, User, Phone, Mail, ArrowLeft, Save, MailQuestion, CreditCard } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';
import toast from 'react-hot-toast';

export default function EditMemberPage() {
  const router = useRouter();
  const { id } = useParams();

  const [member, setMember] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  // Edit State
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [gender, setGender] = useState('');
  const [updating, setUpdating] = useState(false);
  const [sendingReset, setSendingReset] = useState(false);

  useEffect(() => {
    fetchApi(`/users/${id}`)
      .then(data => {
        setMember(data);
        setName(data.name || '');
        setPhone(data.phone || '');
        setGender(data.gender || '');
        setLoading(false);
      })
      .catch(() => {
        toast.error('Failed to load member');
        router.push('/admin');
      });
  }, [id, router]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdating(true);
    try {
      await fetchApi(`/users/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ name, phone, gender })
      });
      toast.success('Member details updated');
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setUpdating(false);
    }
  };

  const handleSendReset = async () => {
    setSendingReset(true);
    try {
      // Get current subdomain to ensure link in email is correct
      const host = window.location.hostname;
      const subdomain = host.includes('.') ? host.split('.')[0] : '';
      
      await fetchApi('/auth/forgot-password', {
        method: 'POST',
        body: JSON.stringify({ email: member.email, subdomain: subdomain === 'localhost' ? '' : subdomain })
      });
      toast.success('Password reset email sent to member');
    } catch (err: any) {
      toast.error('Failed to send reset email');
    } finally {
      setSendingReset(false);
    }
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
          <button onClick={() => router.push('/admin')} className="nav-pill">← Back to Members</button>
        </div>
        <ThemeToggle />
      </motion.nav>

      <section style={{ padding: '4rem 10% 8rem', maxWidth: '1000px', margin: '0 auto', width: '100%', display: 'grid', gridTemplateColumns: 'minmax(0, 1.25fr) minmax(0, 1fr)', gap: '4rem' }}>
        
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <div className="pill pill-amber" style={{ marginBottom: '1.5rem' }}>Member Management</div>
          <h1 className="display-xl" style={{ fontSize: '3.5rem', marginBottom: '2.5rem', letterSpacing: '-0.04em' }}>Edit Member</h1>
          
          <form onSubmit={handleUpdate} className="card" style={{ padding: '2.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
             <div>
                <label className="label" style={{ display: 'block', marginBottom: '0.4rem' }}>Email Account</label>
                <div className="input" style={{ opacity: 0.7, background: 'var(--bg2)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <Mail size={16} /> {member.email}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                <div>
                  <label className="label" style={{ display: 'block', marginBottom: '0.4rem' }}>Full Name</label>
                  <input type="text" value={name} onChange={e => setName(e.target.value)} className="input" placeholder="Member name" />
                </div>
                <div>
                  <label className="label" style={{ display: 'block', marginBottom: '0.4rem' }}>Phone</label>
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

              <motion.button type="submit" disabled={updating} className="btn btn-ink" style={{ alignSelf: 'flex-start', marginTop: '0.5rem', minWidth: '160px', justifyContent: 'center' }} whileTap={{ scale: 0.97 }}>
                {updating ? 'Saving...' : <> <Save size={16} style={{ marginRight: '8px' }} /> Update Member </>}
              </motion.button>
          </form>
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
            <div className="pill" style={{ marginBottom: '1.5rem', background: 'var(--bg2)', color: 'var(--text3)', border: 'none' }}>Quick Actions</div>
            <h2 style={{ fontFamily: 'Outfit', fontWeight: 800, fontSize: '1.75rem', marginBottom: '2.5rem', letterSpacing: '-0.03em' }}>Special Controls</h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
               {/* Password Reset Section */}
               <div className="card" style={{ padding: '2rem' }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <MailQuestion size={18} color="var(--accent)" /> Password Recovery
                  </h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text2)', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                    Send a secure password reset link to this member's registered email address. This is the safest way to reset their access.
                  </p>
                  <button onClick={handleSendReset} disabled={sendingReset} className="btn btn-outline" style={{ width: '100%', justifyContent: 'center' }}>
                    {sendingReset ? 'Sending Email...' : 'Send Reset Email'}
                  </button>
               </div>

               {/* Membership info summary */}
               {member.membership && (
                 <div className="card-ink" style={{ padding: '2rem' }}>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <CreditCard size={18} color="var(--accent)" /> Active Plan
                    </h3>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                       <div>
                         <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.75rem' }}>Membership</p>
                         <p style={{ fontSize: '1.1rem', fontWeight: 700 }}>{member.membership.plan?.name || 'Standard'}</p>
                       </div>
                       <div style={{ textAlign: 'right' }}>
                          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.75rem' }}>Status</p>
                          <p style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--accent)' }}>{member.membership.status}</p>
                       </div>
                    </div>
                 </div>
               )}
            </div>
        </motion.div>

      </section>
    </div>
  );
}
