'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchApi } from '@/lib/api';
import { useRouter } from 'next/navigation';
import { Zap, Tag, Trash2, Plus } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';
import toast from 'react-hot-toast';

export default function PlansPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [plans, setPlans] = useState<any[]>([]);
  
  // Form State
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [duration, setDuration] = useState('1');
  const [features, setFeatures] = useState('');

  const loadPlans = () => {
    fetchApi('/gyms/me/plans')
      .then(data => { setPlans(data); setLoading(false); })
      .catch(() => router.push('/login'));
  };

  useEffect(() => { loadPlans(); }, [router]);

  const handlePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !price) return;
    setSubmitting(true);
    try {
      await fetchApi('/gyms/me/plans', { 
        method: 'POST', 
        body: JSON.stringify({ 
          name, 
          price: parseFloat(price), 
          durationMonths: parseInt(duration, 10), 
          features 
        }) 
      });
      setName(''); setPrice(''); setDuration('1'); setFeatures('');
      toast.success('Plan created');
      loadPlans();
    } catch (err: any) { toast.error(err.message); } finally { setSubmitting(false); }
  };

  const handleDelete = async (id: string) => {
    toast.custom((t) => (
      <div style={{ background: 'var(--bg-card)', padding: '1.25rem', borderRadius: '12px', border: '1px solid var(--border)', boxShadow: '0 10px 40px rgba(0,0,0,0.1)' }}>
        <p style={{ fontWeight: 700, marginBottom: '0.75rem', color: 'var(--text)' }}>Delete this plan?</p>
        <p style={{ fontSize: '0.85rem', color: 'var(--text2)', marginBottom: '1rem' }}>Existing members keep access until expiry.</p>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button className="btn btn-outline" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem', flex: 1 }} onClick={() => toast.dismiss(t.id)}>Cancel</button>
          <button className="btn" style={{ background: '#e11d48', color: '#fff', border: 'none', padding: '0.5rem 1rem', fontSize: '0.85rem', flex: 1, borderRadius: '99px' }} onClick={async () => {
            toast.dismiss(t.id);
            try {
              await fetchApi(`/gyms/me/plans/${id}`, { method: 'DELETE' });
              loadPlans();
              toast.success('Plan deleted');
            } catch (err: any) {
              toast.error(err.message);
            }
          }}>Delete</button>
        </div>
      </div>
    ), { duration: Infinity });
  };

  if (loading) return <div className="page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}><div className="spinner" /></div>;

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
          <button className="nav-pill" onClick={() => router.push('/admin')}>← Dashboard</button>
          <span className="nav-pill active">Pricing Plans</span>
        </div>
        <ThemeToggle />
      </motion.nav>

      <section style={{ padding: '4rem 10% 5rem', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '5rem', maxWidth: '1400px', margin: '0 auto', width: '100%' }}>
        {/* Left: Form */}
        <motion.div style={{ flex: 1, maxWidth: '420px' }} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: [0.25,0.46,0.45,0.94] }}>
          <div className="pill pill-amber" style={{ marginBottom: '1.75rem' }}>Commerce</div>
          <h1 className="display-xl" style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', marginBottom: '1.5rem' }}>
            Fee<br />Structures.
          </h1>
          <p style={{ color: 'var(--text2)', fontSize: '1rem', lineHeight: 1.75, marginBottom: '2.5rem' }}>
            Create custom membership plans. These will be visible on your public website and available when adding new members.
          </p>

          <form onSubmit={handlePost} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label className="label" style={{ display: 'block', marginBottom: '0.4rem' }}>Plan Name</label>
              <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Monthly Pro, Annual Saver" className="input" required />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label className="label" style={{ display: 'block', marginBottom: '0.4rem' }}>Price (₹)</label>
                <input type="number" step="1" value={price} onChange={e => setPrice(e.target.value)} placeholder="1499" className="input" required />
              </div>
              <div>
                <label className="label" style={{ display: 'block', marginBottom: '0.4rem' }}>Duration (Months)</label>
                <select value={duration} onChange={e => setDuration(e.target.value)} className="input" required>
                  <option value="1">1 Month</option>
                  <option value="3">3 Months</option>
                  <option value="6">6 Months</option>
                  <option value="12">12 Months</option>
                </select>
              </div>
            </div>
            <div>
              <label className="label" style={{ display: 'block', marginBottom: '0.4rem' }}>Features (comma separated)</label>
              <textarea rows={2} value={features} onChange={e => setFeatures(e.target.value)} placeholder="24/7 Access, Free Towels, Personal Locker..." className="input" required />
            </div>
            <motion.button type="submit" disabled={submitting} className="btn btn-amber" whileTap={{ scale: 0.97 }} whileHover={{ scale: 1.02 }} style={{ marginTop: '0.5rem' }}>
              {submitting ? 'Creating...' : <> <Plus size={16} /> Create Plan </>}
            </motion.button>
          </form>
        </motion.div>

        {/* Right: Existing Plans Grid */}
        <motion.div style={{ flexShrink: 0, width: '550px' }} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1, ease: [0.25,0.46,0.45,0.94] }}>
          <p className="label" style={{ marginBottom: '1rem' }}>Active Plans ({plans.length})</p>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <AnimatePresence>
              {plans.map((p, i) => (
                <motion.div key={p.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ delay: i * 0.05 }}
                  className="card" style={{ padding: '1.5rem', position: 'relative' }}>
                  <button onClick={() => handleDelete(p.id)} style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', color: 'var(--text3)', cursor: 'pointer', zIndex: 10 }}>
                    <Trash2 size={16} />
                  </button>
                  <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                    <Tag size={16} color="#0C0C0C" />
                  </div>
                  <h3 style={{ fontFamily: 'Outfit', fontWeight: 800, fontSize: '1.25rem', color: 'var(--text)', marginBottom: '0.25rem' }}>{p.name}</h3>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.25rem', marginBottom: '1rem' }}>
                    <span style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--text)' }}>₹{p.price}</span>
                    <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text3)', textTransform: 'uppercase' }}>/ {p.durationMonths}mo</span>
                  </div>
                  <ul style={{ padding: 0, margin: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                    {p.features.split(',').map((f: string, idx: number) => (
                      <li key={idx} style={{ fontSize: '0.8rem', color: 'var(--text2)', display: 'flex', gap: '0.3rem' }}>
                        <span style={{ color: 'var(--accent)' }}>✓</span> {f.trim()}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
              {plans.length === 0 && (
                <div style={{ gridColumn: '1 / -1', padding: '3rem', textAlign: 'center', border: '2px dashed var(--border)', borderRadius: '22px' }}>
                  <p style={{ color: 'var(--text3)', fontSize: '0.9rem', fontWeight: 600 }}>No custom plans created yet.</p>
                </div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
