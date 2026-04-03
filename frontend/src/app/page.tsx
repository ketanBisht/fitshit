'use client';
import { motion } from 'framer-motion';
import { ArrowUpRight, Zap, Target, Users, CreditCard, LayoutTemplate } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';

export default function Home() {
  return (
    <div className="page" style={{ overflowX: 'hidden' }}>
      {/* Nav */}
      <motion.nav className="nav-bar" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{ width: 30, height: 30, borderRadius: '50%', background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Zap size={15} color="#0C0C0C" fill="#0C0C0C" />
          </div>
          <span style={{ fontFamily: 'Outfit', fontWeight: 900, fontSize: '1.25rem', letterSpacing: '-0.03em', color: 'var(--text)' }}>fitshit.</span>
        </div>
        <div className="nav-pill-group" style={{ display: 'none' }}>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <ThemeToggle />
          <a href="/login" className="btn btn-outline" style={{ display: 'inline-flex' }}>Log in</a>
          <motion.a href="/signup" className="btn btn-ink" style={{ display: 'inline-flex' }} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            Try Free <ArrowUpRight size={16} />
          </motion.a>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section style={{ padding: '8rem 10% 4rem', textAlign: 'center', maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: [0.25,0.46,0.45,0.94] }} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div className="pill pill-amber" style={{ marginBottom: '2rem' }}>For Gym Owners</div>
          <h1 className="display-xl" style={{ fontSize: 'clamp(3.5rem, 8vw, 7rem)', marginBottom: '1.5rem', lineHeight: 1 }}>
            Run your <br />
            <span style={{ color: 'var(--accent)', textShadow: '0 0 40px rgba(245, 166, 35, 0.2)' }}>Gym</span> properly.
          </h1>
          <p style={{ color: 'var(--text2)', fontSize: '1.2rem', lineHeight: 1.6, maxWidth: '600px', margin: '0 auto 3rem' }}>
            The all-in-one platform to launch your branded gym website, manage memberships, construct pricing plans, and onboard members effortlessly.
          </p>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
            <motion.a href="/signup" className="btn btn-amber" style={{ padding: '1rem 2rem', fontSize: '1.05rem' }} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              Start your free trial <ArrowUpRight size={18} />
            </motion.a>
            <a href="#features" className="btn btn-outline" style={{ padding: '1rem 2rem', fontSize: '1.05rem', border: '2px solid' }}>Explore Platform</a>
          </div>
        </motion.div>
      </section>

      {/* Visual Break / Marquee */}
      <div style={{ overflow: 'hidden', padding: '4rem 0', pointerEvents: 'none' }}>
        <div className="marquee-track">
          {[...Array(8)].map((_, i) => (
            <span key={i} className="ghost-text marquee-item" style={{ fontSize: '4rem', opacity: 1, padding: '0 2rem', color: 'var(--border)' }}>
              NO MORE SPREADSHEETS · BUILT FOR OWNERS ·
            </span>
          ))}
        </div>
      </div>

      {/* Feature Grid */}
      <section id="features" style={{ padding: '5rem 10%', maxWidth: '1400px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
          <p className="label" style={{ marginBottom: '1rem', color: 'var(--accent)' }}>Capabilities</p>
          <h2 style={{ fontFamily: 'Outfit', fontWeight: 900, fontSize: 'clamp(2.5rem, 5vw, 4rem)', letterSpacing: '-0.03em' }}>Everything you need.</h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
          {[
            { icon: <LayoutTemplate size={24} color="#0C0C0C" />, title: 'Instant Website', desc: 'Get a beautiful, SEO-optimized landing page immediately under your own custom subdomain.', dark: false },
            { icon: <CreditCard size={24} color="#0C0C0C" />, title: 'Custom Pricing', desc: 'Construct your own fee structures and duration plans. Update prices dynamically.', dark: true },
            { icon: <Users size={24} color="#0C0C0C" />, title: 'Bulk CSV Imports', desc: 'Moving from another system? Upload your entire member roster in one rapid CSV import.', dark: false },
            { icon: <Target size={24} color="#0C0C0C" />, title: 'Member Dashboards', desc: 'Give your athletes a private portal to track membership expiry, view active plans, and read updates.', dark: true },
          ].map((feat, i) => (
            <motion.div key={i} className={feat.dark ? 'card-ink' : 'card'} style={{ padding: '2.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', position: 'relative', overflow: 'hidden' }}
              initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-50px' }} transition={{ delay: i * 0.1, duration: 0.6 }}>
              <div style={{ width: 54, height: 54, borderRadius: '16px', background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {feat.icon}
              </div>
              <div>
                <h3 style={{ fontFamily: 'Outfit', fontWeight: 800, fontSize: '1.5rem', marginBottom: '0.75rem', color: feat.dark ? 'var(--bg)' : 'var(--text)', letterSpacing: '-0.02em' }}>{feat.title}</h3>
                <p style={{ color: feat.dark ? 'rgba(255,255,255,0.6)' : 'var(--text2)', lineHeight: 1.6 }}>{feat.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Footer */}
      <section style={{ padding: '5rem 10% 8rem', maxWidth: '1400px', margin: '0 auto' }}>
        <motion.div className="card-amber" style={{ padding: '5rem', borderRadius: '32px', textAlign: 'center', background: 'linear-gradient(135deg, var(--accent) 0%, #D48A14 100%)' }}
          initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}>
          <h2 style={{ fontFamily: 'Outfit', fontWeight: 900, fontSize: 'clamp(2.5rem, 6vw, 5rem)', color: '#0C0C0C', letterSpacing: '-0.04em', lineHeight: 1, marginBottom: '2rem' }}>
            Built for modern<br />fitness brands.
          </h2>
          <p style={{ color: 'rgba(12,12,12,0.7)', fontSize: '1.2rem', marginBottom: '3rem', maxWidth: '500px', margin: '0 auto 3rem' }}>
            Stop wrestling with complex software. Get your gym online properly in under 5 minutes.
          </p>
          <motion.a href="/signup" className="btn btn-ink" style={{ padding: '1.25rem 3rem', fontSize: '1.1rem', borderRadius: '99px' }} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            Launch your Gym <ArrowUpRight size={20} />
          </motion.a>
        </motion.div>
      </section>
    </div>
  );
}
