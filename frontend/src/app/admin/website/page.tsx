'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchApi } from '@/lib/api';
import { useRouter } from 'next/navigation';
import { Zap } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';

export default function WebsiteSettings() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [gymData, setGymData] = useState({ name: '', subdomain: '', description: '', facilities: '', announcement: '', instagram: '', timing: '' });

  useEffect(() => {
    fetchApi('/gyms/me').then(data => {
      setGymData({ name: data.name || '', subdomain: data.subdomain || '', description: data.description || '', facilities: data.facilities || '', announcement: data.announcement || '', instagram: data.instagram || '', timing: data.timing || '' });
      setLoading(false);
    }).catch(() => router.push('/login'));
  }, [router]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault(); setSaving(true);
    try {
      await fetchApi('/gyms/me', { method: 'PATCH', body: JSON.stringify({ name: gymData.name, description: gymData.description, facilities: gymData.facilities, announcement: gymData.announcement, instagram: gymData.instagram, timing: gymData.timing }) });
      setSaved(true); setTimeout(() => setSaved(false), 3000);
    } catch (e: any) { alert(e.message); } finally { setSaving(false); }
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
          <span className="nav-pill active">Website</span>
        </div>
        <ThemeToggle />
      </motion.nav>

      <section style={{ padding: '4rem 10% 5rem', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '5rem', maxWidth: '1400px', margin: '0 auto', width: '100%' }}>
        {/* Left */}
        <motion.div style={{ flex: 1 }} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: [0.25,0.46,0.45,0.94] }}>
          <div className="pill pill-amber" style={{ marginBottom: '1.75rem' }}>CMS</div>
          <h1 className="display-xl" style={{ fontSize: 'clamp(3rem, 5.5vw, 5.5rem)', marginBottom: '1.5rem' }}>
            Your Gym<br />Website.
          </h1>
          <p style={{ color: 'var(--text2)', fontSize: '1rem', lineHeight: 1.75, maxWidth: '360px', marginBottom: '2.5rem' }}>
            Edit what members see on your public landing page — live immediately after saving.
          </p>

          {/* Live URL */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ flex: 1 }}>
              <p className="label" style={{ marginBottom: '0.375rem' }}>Live URL</p>
              <p style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: '1rem', color: 'var(--text)' }}>{gymData.subdomain}.fitshit.com</p>
            </div>
            <motion.a href={`http://${gymData.subdomain}.fitshit.com`} target="_blank" rel="noreferrer"
              style={{ width: 44, height: 44, borderRadius: '50%', background: 'var(--accent)', color: '#0C0C0C', display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none', fontWeight: 900, fontSize: '1.1rem', flexShrink: 0 }}
              whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>↗</motion.a>
          </div>
        </motion.div>

        {/* Right — form */}
        <motion.div style={{ flexShrink: 0, width: '440px' }} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1, ease: [0.25,0.46,0.45,0.94] }}>
          <AnimatePresence>
            {saved && <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              style={{ marginBottom: '1.25rem', padding: '0.875rem 1.25rem', background: 'var(--accent-s)', borderRadius: '14px', color: 'var(--accent-d)', fontSize: '0.9rem', borderLeft: '3px solid var(--accent)', fontWeight: 600 }}>
              ✓ Changes saved and live!
            </motion.div>}
          </AnimatePresence>

          <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label className="label" style={{ display: 'block', marginBottom: '0.4rem' }}>Gym Name</label>
              <input type="text" value={gymData.name} onChange={e => setGymData({ ...gymData, name: e.target.value })} className="input" />
            </div>
            <div>
              <label className="label" style={{ display: 'block', marginBottom: '0.4rem', color: 'var(--text3)' }}>Subdomain (read-only)</label>
              <div className="input-group" style={{ opacity: 0.5, pointerEvents: 'none' }}>
                <input readOnly value={gymData.subdomain} />
                <span className="input-group-suffix">.fitshit.com</span>
              </div>
            </div>
            <div>
              <label className="label" style={{ display: 'block', marginBottom: '0.4rem' }}>Description</label>
              <textarea rows={3} value={gymData.description} onChange={e => setGymData({ ...gymData, description: e.target.value })} placeholder="Describe your gym for the public landing page..." className="input" />
            </div>
            <div>
              <label className="label" style={{ display: 'block', marginBottom: '0.4rem' }}>
                Facilities <span style={{ fontWeight: 400, textTransform: 'none', color: 'var(--text3)', letterSpacing: 0 }}>(comma separated)</span>
              </label>
              <input type="text" value={gymData.facilities} onChange={e => setGymData({ ...gymData, facilities: e.target.value })} placeholder="Free Weights, Cardio Zone, Yoga Studio" className="input" />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label className="label" style={{ display: 'block', marginBottom: '0.4rem' }}>Instagram Handle</label>
                <div className="input-group">
                  <span className="input-group-prefix" style={{ color: 'var(--text3)' }}>@</span>
                  <input type="text" value={gymData.instagram} onChange={e => setGymData({ ...gymData, instagram: e.target.value })} placeholder="gym_fit" />
                </div>
              </div>
              <div>
                <label className="label" style={{ display: 'block', marginBottom: '0.4rem' }}>Opening Hours</label>
                <input type="text" value={gymData.timing} onChange={e => setGymData({ ...gymData, timing: e.target.value })} placeholder="Mon-Sat: 6AM - 10PM" className="input" />
              </div>
            </div>
            <div style={{ display: 'flex', gap: '0.875rem', marginTop: '0.25rem' }}>
              <motion.button type="submit" disabled={saving} className="btn btn-amber" whileTap={{ scale: 0.97 }} whileHover={{ scale: 1.02 }}>
                {saving ? 'Saving...' : 'Save & Publish'}
              </motion.button>
              <button type="button" className="btn btn-outline" onClick={() => router.push('/admin')}>Cancel</button>
            </div>
          </form>
        </motion.div>
      </section>
    </div>
  );
}
