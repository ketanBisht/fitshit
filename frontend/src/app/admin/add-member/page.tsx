'use client';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchApi } from '@/lib/api';
import { useRouter } from 'next/navigation';
import { ArrowUpRight, Zap, Upload, FileText, CheckCircle2 } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';
import toast from 'react-hot-toast';

export default function AddMemberPage() {
  const router = useRouter();
  const [plans, setPlans] = useState<any[]>([]);
  const [loadingConfig, setLoadingConfig] = useState(true);

  // UI Modes
  const [mode, setMode] = useState<'manual' | 'csv'>('manual');

  // Manual State
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [gender, setGender] = useState('');
  const [selectedPlanId, setSelectedPlanId] = useState('');
  
  // CSV State
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [csvPreview, setCsvPreview] = useState<any[]>([]);

  // Submission State
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetchApi('/gyms/me/plans')
      .then(data => { 
        setPlans(data); 
        if (data.length > 0) setSelectedPlanId(data[0].id);
        setLoadingConfig(false); 
      })
      .catch(() => router.push('/login'));
  }, [router]);

  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true); setError('');
    try {
      await fetchApi('/users', { 
        method: 'POST', 
        body: JSON.stringify({ 
          email,
          name, 
          password, 
          phone, 
          gender: gender || null,
          membership: { planId: selectedPlanId, startDate: new Date().toISOString(), endDate: new Date(new Date().setMonth(new Date().getMonth() + (plans.find(p => p.id === selectedPlanId)?.durationMonths || 1))).toISOString() } 
        }) 
      });
      setSuccess(true); setTimeout(() => router.push('/admin'), 1500);
    } catch (err: any) { setError(err.message); } finally { setLoading(false); }
  };

  const processCSV = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const rows = text.split('\n').filter(r => r.trim());
      const headers = rows[0].split(',').map(h => h.trim().toLowerCase());
      
      const parsed = rows.slice(1).map(row => {
        const cols = row.split(',').map(c => c.trim());
        const obj: any = {};
        headers.forEach((h, i) => obj[h] = cols[i]);
        return obj;
      });
      setCsvPreview(parsed.slice(0, 5)); // show first 5
    };
    reader.readAsText(file);
  };

  const handleFileDrop = (e: any) => {
    e.preventDefault();
    const file = e.dataTransfer?.files[0] || e.target?.files[0];
    if (file && file.type === 'text/csv') {
      setCsvFile(file);
      processCSV(file);
    } else {
      toast.error("Please upload a valid CSV file");
    }
  };

  const handleCSVSubmit = async () => {
    if (!csvFile) return;
    setLoading(true); setError('');
    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const text = e.target?.result as string;
        const rows = text.split('\n').filter(r => r.trim());
        const headers = rows[0].split(',').map(h => h.trim().toLowerCase());
        
        const members = rows.slice(1).map(row => {
          const cols = row.split(',').map(c => c.trim());
          const obj: any = {};
          headers.forEach((h, i) => obj[h] = cols[i]);
          
          // Must match backend expectations
          return {
            email: obj.email,
            name: obj.name,
            phone: obj.phone,
            gender: obj.gender,
            password: obj.password || 'welcome123',
            planId: plans.find(p => p.name.toLowerCase() === obj.plan?.toLowerCase())?.id || selectedPlanId
          };
        });

        await fetchApi('/users/bulk', { method: 'POST', body: JSON.stringify(members) });
        setSuccess(true); setTimeout(() => router.push('/admin'), 1500);
      };
      reader.readAsText(csvFile);
    } catch (err: any) { setError(err.message); setLoading(false); }
  };

  if (loadingConfig) return <div className="page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}><div className="spinner" /></div>;

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
          <span className="nav-pill active">Add Member</span>
        </div>
        <ThemeToggle />
      </motion.nav>

      <section style={{ padding: '4rem 10% 5rem', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '5rem', maxWidth: '1400px', margin: '0 auto', width: '100%' }}>
        {/* Left */}
        <motion.div style={{ flex: 1 }} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: [0.25,0.46,0.45,0.94] }}>
          <div className="pill pill-amber" style={{ marginBottom: '1.75rem' }}>Onboarding</div>
          <h1 className="display-xl" style={{ fontSize: 'clamp(3rem, 5.5vw, 5.5rem)', marginBottom: '1.5rem' }}>
            Add a<br />Member.
          </h1>
          <p style={{ color: 'var(--text2)', fontSize: '1rem', lineHeight: 1.75, maxWidth: '400px', marginBottom: '3rem' }}>
            Register single members easily or upload a full CSV to bring your entire gym roaster onboard in seconds.
          </p>

          <div style={{ display: 'flex', gap: '1rem', marginBottom: '2.5rem' }}>
            <button onClick={() => setMode('manual')} className="btn" style={{ background: mode === 'manual' ? 'var(--text)' : 'transparent', color: mode === 'manual' ? 'var(--bg)' : 'var(--text)', border: '2px solid var(--text)' }}>Manual Entry</button>
            <button onClick={() => setMode('csv')} className="btn" style={{ background: mode === 'csv' ? 'var(--text)' : 'transparent', color: mode === 'csv' ? 'var(--bg)' : 'var(--text)', border: '2px solid var(--text)' }}>CSV Upload</button>
          </div>
        </motion.div>

        {/* Right — form / upload */}
        <motion.div style={{ flexShrink: 0, width: '450px' }} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1, ease: [0.25,0.46,0.45,0.94] }}>
          <AnimatePresence>
            {success && <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              style={{ marginBottom: '1.25rem', padding: '0.875rem 1.25rem', background: 'var(--accent-s)', borderRadius: '14px', color: 'var(--accent-d)', fontSize: '0.9rem', borderLeft: '3px solid var(--accent)', fontWeight: 600 }}>
              ✓ Member(s) added! Redirecting...
            </motion.div>}
            {error && <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              style={{ marginBottom: '1.25rem', padding: '0.875rem 1.25rem', background: 'rgba(239,68,68,0.08)', borderRadius: '14px', color: '#EF4444', fontSize: '0.9rem', borderLeft: '3px solid #EF4444' }}>
              {error}
            </motion.div>}
          </AnimatePresence>

          {plans.length === 0 ? (
            <div style={{ padding: '2rem', textAlign: 'center', background: 'var(--bg2)', borderRadius: '24px', border: '1.5px solid var(--border)' }}>
              <Zap size={32} color="var(--accent)" style={{ margin: '0 auto 1rem' }} />
              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>No Plans Found</h3>
              <p style={{ color: 'var(--text3)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>You need to configure at least one fee plan before adding members.</p>
              <button className="btn btn-amber" onClick={() => router.push('/admin/plans')}>Create a Plan</button>
            </div>
          ) : mode === 'manual' ? (
            <form onSubmit={handleManualSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label className="label" style={{ display: 'block', marginBottom: '0.4rem' }}>Member Name</label>
                  <input type="text" required value={name} onChange={e => setName(e.target.value)} className="input" placeholder="John Doe" />
                </div>
                <div>
                  <label className="label" style={{ display: 'block', marginBottom: '0.4rem' }}>Member Email</label>
                  <input type="email" required value={email} onChange={e => setEmail(e.target.value)} className="input" placeholder="member@gym.com" />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label className="label" style={{ display: 'block', marginBottom: '0.4rem' }}>Phone</label>
                  <input type="tel" required value={phone} onChange={e => setPhone(e.target.value)} className="input" placeholder="555-0199" />
                </div>
                <div>
                  <label className="label" style={{ display: 'block', marginBottom: '0.4rem' }}>Gender</label>
                  <select className="input" value={gender} onChange={e => setGender(e.target.value)}>
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="label" style={{ display: 'block', marginBottom: '0.4rem' }}>Temp Password</label>
                  <input type="password" required value={password} onChange={e => setPassword(e.target.value)} className="input" placeholder="••••••••" />
                </div>
              </div>
              <div style={{ padding: '0.875rem 1.125rem', background: 'var(--accent-s)', border: '1.5px solid var(--accent)', borderRadius: '14px' }}>
                <p className="label" style={{ marginBottom: '0.5rem' }}>Select Membership Plan</p>
                <select value={selectedPlanId} onChange={e => setSelectedPlanId(e.target.value)} className="input" style={{ background: '#fff', color: '#000', borderColor: 'rgba(0,0,0,0.1)' }}>
                  {plans.map(p => (
                    <option key={p.id} value={p.id}>{p.name} (₹{p.price} / {p.durationMonths}mo)</option>
                  ))}
                </select>
              </div>
              <div style={{ display: 'flex', gap: '0.875rem', marginTop: '0.5rem' }}>
                <motion.button type="submit" disabled={loading || success} className="btn btn-ink" whileTap={{ scale: 0.97 }} whileHover={{ scale: 1.02 }}>
                  {loading ? 'Adding...' : <> Add Member <ArrowUpRight size={17} /> </>}
                </motion.button>
              </div>
            </form>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {!csvFile ? (
                <div 
                  onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
                  onDrop={handleFileDrop}
                  onClick={() => fileInputRef.current?.click()}
                  style={{ border: '2px dashed var(--border)', borderRadius: '24px', padding: '3rem 2rem', textAlign: 'center', cursor: 'pointer', transition: 'all 0.2s' }}
                  className="card"
                >
                  <Upload size={32} color="var(--text3)" style={{ margin: '0 auto 1rem' }} />
                  <p style={{ fontWeight: 600, fontSize: '1rem', marginBottom: '0.5rem' }}>Drop CSV here or click to browse</p>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text3)' }}>Format: email, name, phone, gender, password, plan</p>
                  <input type="file" accept=".csv" onChange={handleFileDrop} style={{ display: 'none' }} ref={fileInputRef} />
                </div>
              ) : (
                <div style={{ padding: '1.5rem', background: 'var(--bg2)', borderRadius: '24px', border: '1.5px solid var(--border)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                    <FileText size={24} color="var(--accent)" />
                    <div>
                      <p style={{ fontWeight: 700 }}>{csvFile.name}</p>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text3)' }}>Ready to import</p>
                    </div>
                  </div>
                  
                  {csvPreview.length > 0 && (
                    <div style={{ marginBottom: '1.5rem' }}>
                      <p className="label" style={{ marginBottom: '0.5rem' }}>Preview (First {csvPreview.length})</p>
                      <div style={{ fontSize: '0.8rem', background: 'var(--bg)', padding: '0.75rem', borderRadius: '12px', border: '1px solid var(--border)' }}>
                        {csvPreview.map((r, i) => (
                          <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.25rem 0', borderBottom: i < csvPreview.length - 1 ? '1px solid var(--border)' : 'none' }}>
                            <span style={{ color: 'var(--text2)' }}>{r.email}</span>
                            <span style={{ fontWeight: 600 }}>{r.plan}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div style={{ display: 'flex', gap: '0.875rem' }}>
                    <motion.button onClick={handleCSVSubmit} disabled={loading || success} className="btn btn-ink" style={{ flex: 1 }} whileTap={{ scale: 0.97 }} whileHover={{ scale: 1.02 }}>
                      {loading ? 'Importing...' : <><CheckCircle2 size={16} /> Import Database</>}
                    </motion.button>
                    <button className="btn btn-outline" onClick={() => setCsvFile(null)}>Clear</button>
                  </div>
                </div>
              )}
            </div>
          )}
        </motion.div>
      </section>
    </div>
  );
}
