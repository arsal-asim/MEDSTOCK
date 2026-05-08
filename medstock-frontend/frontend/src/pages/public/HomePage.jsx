import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function HomePage() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="home-page">

      {/* ── Navbar ── */}
      <nav className={`home-nav ${scrolled ? 'home-nav--scrolled' : ''}`}>
        <div className="home-nav__inner">
          <Link to="/" className="home-nav__logo">
            <span className="home-nav__logo-icon">💊</span>
            <span>MedStock</span>
          </Link>
          <div className="home-nav__links">
            <a href="#features" className="home-nav__link">Features</a>
            <a href="#how-it-works" className="home-nav__link">How It Works</a>
            <a href="#contact" className="home-nav__link">Contact</a>
          </div>
          <div className="home-nav__actions">
            <Link to="/login" className="home-btn home-btn--ghost">Sign In</Link>
            <Link to="/register" className="home-btn home-btn--primary">Register Free</Link>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="hero">
        <div className="hero__bg-grid" aria-hidden="true" />
        <div className="hero__blob hero__blob--1" aria-hidden="true" />
        <div className="hero__blob hero__blob--2" aria-hidden="true" />

        <div className="hero__content">
          <div className="hero__badge">
            <span className="hero__badge-dot" />
            Trusted by pharmacies across Pakistan
          </div>
          <h1 className="hero__title">
            Manage Inventory.<br />
            <span className="hero__title-accent">Stay Stocked.</span><br />
            Never Miss a Medicine.
          </h1>
          <p className="hero__subtitle">
            MedStock helps small pharmacies request stock on credit, track orders in real time,
            and manage repayments — all from one clean, simple dashboard.
          </p>
          <div className="hero__cta">
            <Link to="/register" className="home-btn home-btn--primary home-btn--lg">
              Get Started Free →
            </Link>
            <Link to="/login" className="home-btn home-btn--outline home-btn--lg">
              Sign In to Dashboard
            </Link>
          </div>
          <p className="hero__note">No credit card required · Set up in 2 minutes</p>
        </div>

        <div className="hero__mockup">
          <div className="mockup-window">
            <div className="mockup-bar">
              <span /><span /><span />
            </div>
            <div className="mockup-body">
              <div className="mockup-stat-row">
                <div className="mockup-stat mockup-stat--blue">
                  <div className="mockup-stat__label">Total Requests</div>
                  <div className="mockup-stat__value">48</div>
                </div>
                <div className="mockup-stat mockup-stat--green">
                  <div className="mockup-stat__label">Approved</div>
                  <div className="mockup-stat__value">31</div>
                </div>
                <div className="mockup-stat mockup-stat--amber">
                  <div className="mockup-stat__label">Pending</div>
                  <div className="mockup-stat__value">12</div>
                </div>
              </div>
              <div className="mockup-table-head">
                <span>Medicine</span><span>Qty</span><span>Status</span>
              </div>
              {[
                { name: 'Paracetamol 500mg', qty: 200, status: 'approved' },
                { name: 'Amoxicillin 250mg', qty: 150, status: 'pending'  },
                { name: 'Metformin 850mg',   qty: 100, status: 'approved' },
                { name: 'Omeprazole 20mg',   qty: 80,  status: 'pending'  },
              ].map((item, i) => (
                <div className="mockup-row" key={i}>
                  <span>{item.name}</span>
                  <span>{item.qty}</span>
                  <span className={`mockup-badge mockup-badge--${item.status}`}>{item.status}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats Strip ── */}
      <section className="stats-strip">
        {[
          { value: '500+', label: 'Pharmacies Onboarded' },
          { value: '12K+', label: 'Requests Processed' },
          { value: '98%',  label: 'Approval Rate' },
          { value: '24h',  label: 'Average Response Time' },
        ].map((s, i) => (
          <div className="stats-strip__item" key={i}>
            <div className="stats-strip__value">{s.value}</div>
            <div className="stats-strip__label">{s.label}</div>
          </div>
        ))}
      </section>

      {/* ── Features ── */}
      <section className="features" id="features">
        <div className="section-inner">
          <div className="section-header">
            <p className="section-eyebrow">Why MedStock</p>
            <h2 className="section-title">Everything a pharmacy needs, nothing it doesn't</h2>
            <p className="section-sub">Built specifically for the way small pharmacies actually operate.</p>
          </div>

          <div className="features-grid">
            {[
              {
                icon: '📦',
                title: 'Inventory Requests',
                desc: 'Submit stock requests in seconds. Specify medicine name and quantity — no paperwork, no phone calls.',
              },
              {
                icon: '📊',
                title: 'Live Status Tracking',
                desc: 'See if your request is pending, approved or rejected the moment the admin acts. No more chasing follow-ups.',
              },
              {
                icon: '💳',
                title: 'Credit & Repayments',
                desc: 'Get stock on short-term credit. Track what you owe, due dates, and payment history from one place.',
              },
              {
                icon: '🔐',
                title: 'Secure & Private',
                desc: 'Your financial data stays yours. Role-based access ensures only the right people see the right information.',
              },
              {
                icon: '👨‍💼',
                title: 'Admin Dashboard',
                desc: 'Administrators can review, approve or reject requests and mark repayments — with full visibility across all pharmacies.',
              },
              {
                icon: '📱',
                title: 'Works Everywhere',
                desc: 'Fully responsive. Use it from the counter, from home, or on your phone while on the go.',
              },
            ].map((f, i) => (
              <div className="feature-card" key={i}>
                <div className="feature-card__icon">{f.icon}</div>
                <h3 className="feature-card__title">{f.title}</h3>
                <p className="feature-card__desc">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className="how-it-works" id="how-it-works">
        <div className="section-inner">
          <div className="section-header">
            <p className="section-eyebrow">Simple Process</p>
            <h2 className="section-title">Up and running in minutes</h2>
          </div>

          <div className="steps">
            {[
              { step: '01', title: 'Register your pharmacy', desc: 'Create an account with your pharmacy name, email, and location in under 2 minutes.' },
              { step: '02', title: 'Submit a stock request',  desc: 'Fill in the medicine name and quantity you need. Your request is logged instantly with a Pending status.' },
              { step: '03', title: 'Track approval in real time', desc: 'Check your dashboard to see the latest status. Get notified when it\'s approved or if it needs changes.' },
              { step: '04', title: 'Manage repayments', desc: 'Once stock is delivered, track your credit repayments with due dates so you never miss a payment.' },
            ].map((s, i) => (
              <div className="step" key={i}>
                <div className="step__number">{s.step}</div>
                <div className="step__content">
                  <h3 className="step__title">{s.title}</h3>
                  <p className="step__desc">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="cta-banner">
        <div className="cta-banner__inner">
          <h2 className="cta-banner__title">Ready to take control of your inventory?</h2>
          <p className="cta-banner__sub">Join hundreds of pharmacies already using MedStock.</p>
          <div className="cta-banner__actions">
            <Link to="/register" className="home-btn home-btn--white home-btn--lg">Create Free Account</Link>
            <Link to="/login"    className="home-btn home-btn--outline-white home-btn--lg">Sign In</Link>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="home-footer" id="contact">
        <div className="home-footer__inner">
          <div className="home-footer__brand">
            <span className="home-footer__logo">💊 MedStock</span>
            <p>Pharmacy Inventory Finance System.<br />Built for real pharmacists, by people who care.</p>
          </div>
          <div className="home-footer__col">
            <h4>Product</h4>
            <a href="#features">Features</a>
            <a href="#how-it-works">How It Works</a>
            <Link to="/register">Register</Link>
            <Link to="/login">Sign In</Link>
          </div>
          <div className="home-footer__col">
            <h4>Support</h4>
            <a href="mailto:support@medstock.pk">support@medstock.pk</a>
            <a href="#">Documentation</a>
            <a href="#">FAQ</a>
          </div>
        </div>
        <div className="home-footer__bottom">
          <p>© {new Date().getFullYear()} MedStock. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
