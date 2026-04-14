'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchApi } from '@/lib/api';
import { useRouter } from 'next/navigation';
import { Zap, Megaphone, Trash2 } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';
import toast from 'react-hot-toast';

export default function AnnouncementsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [content, setContent] = useState('');

  const loadAnnouncements = () => {
    fetchApi('/gyms/me/announcements')
      .then(data => { setAnnouncements(data); setLoading(false); })
      .catch(() => router.push('/login'));
  };

  useEffect(() => { loadAnnouncements(); }, [router]);

  const handlePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    setSubmitting(true);
    try {
      await fetchApi('/gyms/me/announcements', { method: 'POST', body: JSON.stringify({ content }) });
      setContent('');
      toast.success('Announcement posted');
      loadAnnouncements();
    } catch (err: any) { toast.error(err.message); } finally { setSubmitting(false); }
  };

  const handleDelete = async (id: string) => {
    toast.custom((t) => (
      <div style={{ background: 'var(--bg-card)', padding: '1.25rem', borderRadius: '12px', border: '1px solid var(--border)', boxShadow: '0 10px 40px rgba(0,0,0,0.1)' }}>
        <p style={{ fontWeight: 700, marginBottom: '0.75rem', color: 'var(--text)' }}>Delete this announcement?</p>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button className="btn btn-outline" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem', flex: 1 }} onClick={() => toast.dismiss(t.id)}>Cancel</button>
          <button className="btn" style={{ background: '#e11d48', color: '#fff', border: 'none', padding: '0.5rem 1rem', fontSize: '0.85rem', flex: 1, borderRadius: '99px' }} onClick={async () => {
            toast.dismiss(t.id);
            try {
              await fetchApi(`/gyms/me/announcements/${id}`, { method: 'DELETE' });
              loadAnnouncements();
              toast.success('Announcement deleted');
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
          <span className="nav-pill active">Announcements</span>
        </div>
        <ThemeToggle />
      </motion.nav>

      <section style={{ padding: '4rem 10% 5rem', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '5rem', maxWidth: '1400px', margin: '0 auto', width: '100%' }}>
        {/* Left */}
        <motion.div style={{ flex: 1 }} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: [0.25,0.46,0.45,0.94] }}>
          <div className="pill pill-amber" style={{ marginBottom: '1.75rem' }}>Updates</div>
          <h1 className="display-xl" style={{ fontSize: 'clamp(3rem, 5.5vw, 5.5rem)', marginBottom: '1.5rem' }}>
            Broadcast<br />Messages.
          </h1>
          <p style={{ color: 'var(--text2)', fontSize: '1rem', lineHeight: 1.75, maxWidth: '360px', marginBottom: '2.5rem' }}>
            Post holidays, price changes, and important updates. Members will see this on their dashboard.
          </p>

          <form onSubmit={handlePost} style={{ maxWidth: '420px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <textarea rows={3} value={content} onChange={e => setContent(e.target.value)} placeholder="Type new announcement here..." className="input" style={{ borderColor: content ? 'var(--accent)' : '' }} required />
            <motion.button type="submit" disabled={submitting || !content.trim()} className="btn btn-amber" whileTap={{ scale: 0.97 }} whileHover={{ scale: 1.02 }} style={{ alignSelf: 'flex-start' }}>
              {submitting ? 'Posting...' : <> <Megaphone size={16} /> Post Announcement </>}
            </motion.button>
          </form>
        </motion.div>

        {/* Right — Feed */}
        <motion.div style={{ flexShrink: 0, width: '500px' }} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1, ease: [0.25,0.46,0.45,0.94] }}>
          <p className="label" style={{ marginBottom: '1rem' }}>Active Announcements ({announcements.length})</p>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <AnimatePresence>
              {announcements.map((a, i) => (
                <motion.div key={a.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ delay: i * 0.05 }}
                  className="card" style={{ padding: '1.5rem', display: 'flex', gap: '1.25rem', alignItems: 'flex-start' }}>
                  <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--bg3)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Megaphone size={16} color="var(--text)" />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                      <p style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text3)' }}>
                        {new Date(a.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}
                      </p>
                      <button onClick={() => handleDelete(a.id)} style={{ background: 'none', border: 'none', color: 'var(--text3)', cursor: 'pointer', outline: 'none' }} title="Delete">
                        <Trash2 size={15} />
                      </button>
                    </div>
                    <p style={{ color: 'var(--text)', fontSize: '0.95rem', lineHeight: 1.5 }}>{a.content}</p>
                  </div>
                </motion.div>
              ))}
              {announcements.length === 0 && (
                <div style={{ padding: '3rem', textAlign: 'center', border: '2px dashed var(--border)', borderRadius: '22px' }}>
                  <p style={{ color: 'var(--text3)', fontSize: '0.9rem', fontWeight: 600 }}>No announcements posted yet.</p>
                </div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
