import { useEffect, useRef, useState } from 'react'
import './index.css'
import './App.css'

// 1. Magnetic Button Component (Custom interaction)
const MagneticButton = ({ children, className, onClick, ...props }) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const ref = useRef(null);

  const handleMouseMove = (e) => {
    if (!ref.current) return;
    const { clientX, clientY } = e;
    const { width, height, left, top } = ref.current.getBoundingClientRect();
    const x = (clientX - (left + width / 2)) * 0.2; // 0.2 pull strength
    const y = (clientY - (top + height / 2)) * 0.2;
    setPosition({ x, y });
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

  return (
    <button
      ref={ref}
      className={`${className} magnetic-btn`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      style={{ transform: `translate(${position.x}px, ${position.y}px)` }}
      {...props}
    >
      {children}
    </button>
  );
};

// Main Application
function App() {
  const [activeView, setActiveView] = useState('home');
  const [isLoading, setIsLoading] = useState(true); // Feature: Skeleton Loader state
  const volumeTickerRef = useRef(null);

  // Feature: View Transitions API
  const navigateTo = (view) => {
    if (!document.startViewTransition) {
        window.scrollTo(0, 0);
        setActiveView(view);
        return;
    }
    document.startViewTransition(() => {
        window.scrollTo(0, 0);
        setActiveView(view);
    });
  };

  useEffect(() => {
    // Basic loading simulation (1.5s) for Skeleton Loader demo
    const loadTimer = setTimeout(() => {
        setIsLoading(false);
    }, 1500);

    return () => clearTimeout(loadTimer);
  }, [activeView]);

  useEffect(() => {
    if (activeView !== 'home') return;

    // Fade up elements on scroll
    const sections = document.querySelectorAll('section, .pillar-card, .asset-card, .trust-module, .detail-mockup');
    sections.forEach(sec => sec.classList.add('fade-up'));

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: "0px 0px -50px 0px" });

    sections.forEach(sec => observer.observe(sec));

    // Number ticker animation
    const animValue = (elem, endVal, duration) => {
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const current = Math.floor(easeOut * endVal);
            elem.innerHTML = `$${current.toLocaleString()}.00`;
            if (progress < 1) {
                window.requestAnimationFrame(step);
            } else {
                elem.innerHTML = `$${endVal.toLocaleString()}.00`;
            }
        };
        window.requestAnimationFrame(step);
    };

    if (volumeTickerRef.current && !isLoading) {
        animValue(volumeTickerRef.current, 142450, 2000);
    }

    return () => observer.disconnect();
  }, [activeView, isLoading]);

  return (
    <>
      <div className="bg-glow"></div>
      <div className="noise-overlay"></div>

      <header className="navbar">
          <div className="container nav-content">
              <div className="logo" style={{cursor: 'pointer'}} onClick={() => navigateTo('home')}>Asseth.</div>
              {activeView === 'home' && (
                <nav className="nav-links">
                    <a href="#ecosystem">Ecosystem</a>
                    <a href="#marketplace">Marketplace</a>
                </nav>
              )}
              <div className="nav-actions">
                  <MagneticButton className="btn btn-secondary" onClick={() => navigateTo('home')}>Sign In</MagneticButton>
                  <MagneticButton className="btn btn-primary neon-pulse">Launch App</MagneticButton>
              </div>
          </div>
      </header>

      {activeView === 'home' && (
        <main>
          {/* UPDATED HERO SECTION */}
          <section className="hero container">
              <div className="hero-left">
                  <h1 className="hero-title">The Sovereign Infrastructure<br/>for Digital Wealth.</h1>
                  <p className="hero-subtitle">The global rail for the tokenization of the $16T Private Market. Access institutional-grade Liquidity, Programmable Compliance, and AI-Driven Underwriting across every asset class.</p>
                  <div className="hero-cta-stack">
                      <div className="btn-group">
                          <MagneticButton className="btn btn-primary neon-pulse">Initiate Tokenization</MagneticButton>
                          <MagneticButton className="btn btn-glass">Institutional API Docs</MagneticButton>
                      </div>
                  </div>
              </div>

              <div className="hero-right">
                  <div className="dashboard-composition">
                      <div className="floating-card real-estate gradient-border-wrap parallax-float">
                          <div className="card-header">
                              <span className="tag">Real Estate</span>
                              <span className="ticker">NYC-34B</span>
                          </div>
                          <div className="card-body">
                              <div className="price-row">
                                  <span className={isLoading ? "skeleton price" : "price"}>$142.50</span>
                                  <span className={isLoading ? "skeleton growth positive" : "growth positive"}>+4.2%</span>
                              </div>
                              <div className={isLoading ? "skeleton mini-chart" : "mini-chart chart-1"}></div>
                          </div>
                      </div>

                      <div className="floating-card art-asset gradient-border-wrap parallax-float" style={{ animationDelay: '-2s' }}>
                          <div className="card-header">
                              <span className="tag">Fine Art</span>
                              <span className="ticker">BASQ-82</span>
                          </div>
                          <div className="card-body">
                              <div className="price-row">
                                  <span className={isLoading ? "skeleton price" : "price"}>$840.00</span>
                                  <span className={isLoading ? "skeleton growth positive" : "growth positive"}>+12.4%</span>
                              </div>
                              <div className={isLoading ? "skeleton mini-chart" : "mini-chart chart-2"}></div>
                          </div>
                      </div>

                      <div className="floating-panel portfolio-widget gradient-border-wrap parallax-float" style={{ animationDelay: '-1s' }}>
                          <div className="panel-header">
                              <span>Total Portfolio Value</span>
                              <span className={isLoading ? "skeleton volume-ticker" : "volume-ticker"} ref={volumeTickerRef}>
                                  {isLoading ? "$0.00" : "$142,450.00"}
                              </span>
                          </div>
                          <div className="panel-stats">
                              <div className="stat">
                                  <span className="stat-label">Monthly Yield</span>
                                  <span className={isLoading ? "skeleton stat-val" : "stat-val accent"}>+ $1,204.50</span>
                              </div>
                              <div className="stat">
                                  <span className="stat-label">Assets</span>
                                  <span className={isLoading ? "skeleton stat-val" : "stat-val"}>12</span>
                              </div>
                          </div>
                      </div>
                  </div>
              </div>
          </section>

          {/* ECOSYSTEM PILLARS */}
          <section className="ecosystem container" id="ecosystem">
              <div className="section-header">
                  <h2>The Asseth Ecosystem: Key Value Pillars</h2>
              </div>
              <div className="pillars-grid">
                  {/* Pillar 1 */}
                  <div className="pillar-card glass-panel card-3d fade-up">
                      <h3>1. Universal Tokenization Rail</h3>
                      <div className="pillar-list">
                          <div className="pillar-item">
                              <h4>Multi-Asset Issuance</h4>
                              <p className={isLoading ? "skeleton" : ""}>A single legal and technical framework for Real Estate, Gold, Private Equity, and Private Credit.</p>
                          </div>
                          <div className="pillar-item">
                              <h4>Digital Twin Technology</h4>
                              <p className={isLoading ? "skeleton" : ""}>Every token is a 1:1 legally binding digital representation of a physical or financial asset held in regulated custody.</p>
                          </div>
                          <div className="pillar-item">
                              <h4>Programmable Compliance (ERC-3643)</h4>
                              <p className={isLoading ? "skeleton" : ""}>Automated KYC/AML and jurisdictional restrictions are hard-coded into the asset. If the trade isn't legal, the blockchain won't execute it.</p>
                          </div>
                      </div>
                  </div>
                  
                  {/* Pillar 2 */}
                  <div className="pillar-card glass-panel card-3d fade-up">
                      <h3>2. Quantum Liquidity Engine</h3>
                      <div className="pillar-list">
                          <div className="pillar-item">
                              <h4>Instant Cross-Asset Swaps</h4>
                              <p className={isLoading ? "skeleton" : ""}>Swap your "NYC Office Bricks" for "Allocated Gold" or "Venture Capital Fractions" in sub-seconds.</p>
                          </div>
                          <div className="pillar-item">
                              <h4>Automated Market Maker (AMM)</h4>
                              <p className={isLoading ? "skeleton" : ""}>Exit positions instantly against deep liquidity pools. No more waiting for a buyer; the protocol provides the exit.</p>
                          </div>
                          <div className="pillar-item">
                              <h4>Collateral Velocity</h4>
                              <p className={isLoading ? "skeleton" : ""}>Use your tokenized holdings as instant collateral for low-interest liquidity without selling your position.</p>
                          </div>
                      </div>
                  </div>

                  {/* Pillar 3 */}
                  <div className="pillar-card glass-panel card-3d fade-up">
                      <h3>3. TrueValue™ AI Underwriting</h3>
                      <div className="pillar-list">
                          <div className="pillar-item">
                              <h4>Predictive Analysis</h4>
                              <p className={isLoading ? "skeleton" : ""}>Beyond historical data. Our AI ingests global macro-shifts, interest rates, and commodity supply chains to forecast yield.</p>
                          </div>
                          <div className="pillar-item">
                              <h4>Real-Time NAV</h4>
                              <p className={isLoading ? "skeleton" : ""}>Static annual appraisals are obsolete. Asseth provides a live Net Asset Value for every asset in your portfolio, updated by the minute.</p>
                          </div>
                          <div className="pillar-item">
                              <h4>Risk Scoring</h4>
                              <p className={isLoading ? "skeleton" : ""}>Institutional-grade risk assessment (A+ to C) for every private market opportunity, delivered instantly via the Asseth API.</p>
                          </div>
                      </div>
                  </div>
              </div>
          </section>

          {/* MARKETPLACE UI DEMONSTRATION */}
          <section className="marketplace container" id="marketplace">
              <div className="section-header">
                  <h2>Curated Marketplace</h2>
                  <MagneticButton className="btn btn-secondary">View All Assets</MagneticButton>
              </div>
              <div className="marketplace-container">
                  <div className="marketplace-grid">
                      {/* Asset 1 */}
                      <div className="asset-card card-3d neon-pulse fade-up">
                          <div className={isLoading ? "skeleton asset-image img-1" : "asset-image img-1"}></div>
                          <div className="asset-content">
                              <div className="asset-meta">
                                  <span className="category">Real Estate</span>
                                  <span className="yield">8.5% APY</span>
                              </div>
                              <h3 className={isLoading ? "skeleton asset-name" : "asset-name"}>Tribeca Luxury Loft</h3>
                              <div className="asset-data">
                                  <div className="data-point">
                                      <span className="label">Token Price</span>
                                      <span className={isLoading ? "skeleton value" : "value"}>$100.00</span>
                                  </div>
                                  <div className="data-point">
                                      <span className="label">Funded</span>
                                      <span className={isLoading ? "skeleton value" : "value"}>84%</span>
                                  </div>
                              </div>
                              <div className="progress-bar"><div className={isLoading ? "skeleton progress" : "progress"} style={{width: '84%'}}></div></div>
                              <MagneticButton className="btn btn-glass full-width mt-4" onClick={() => navigateTo('detail')}>View Details</MagneticButton>
                          </div>
                      </div>
                      
                      {/* Asset 2 */}
                      <div className="asset-card card-3d neon-pulse fade-up">
                          <div className={isLoading ? "skeleton asset-image img-2" : "asset-image img-2"}></div>
                          <div className="asset-content">
                              <div className="asset-meta">
                                  <span className="category">Commodity</span>
                                  <span className="yield">11.2% YTD</span>
                              </div>
                              <h3 className={isLoading ? "skeleton asset-name" : "asset-name"}>Physical Gold Vault</h3>
                              <div className="asset-data">
                                  <div className="data-point">
                                      <span className="label">Token Price</span>
                                      <span className={isLoading ? "skeleton value" : "value"}>$2,450.00</span>
                                  </div>
                                  <div className="data-point">
                                      <span className="label">Funded</span>
                                      <span className={isLoading ? "skeleton value" : "value"}>100%</span>
                                  </div>
                              </div>
                              <div className="progress-bar"><div className={isLoading ? "skeleton progress" : "progress"} style={{width: '100%'}}></div></div>
                              <MagneticButton className="btn btn-glass full-width mt-4" onClick={() => navigateTo('detail')}>View Details</MagneticButton>
                          </div>
                      </div>

                      {/* Asset 3 */}
                      <div className="asset-card card-3d neon-pulse fade-up">
                          <div className={isLoading ? "skeleton asset-image img-3" : "asset-image img-3"}></div>
                          <div className="asset-content">
                              <div className="asset-meta">
                                  <span className="category">Fine Art</span>
                                  <span className="yield">Historic</span>
                              </div>
                              <h3 className={isLoading ? "skeleton asset-name" : "asset-name"}>Contemporary Masterpiece</h3>
                              <div className="asset-data">
                                  <div className="data-point">
                                      <span className="label">Token Price</span>
                                      <span className={isLoading ? "skeleton value" : "value"}>$50.00</span>
                                  </div>
                                  <div className="data-point">
                                      <span className="label">Funded</span>
                                      <span className={isLoading ? "skeleton value" : "value"}>62%</span>
                                  </div>
                              </div>
                              <div className="progress-bar"><div className={isLoading ? "skeleton progress" : "progress"} style={{width: '62%'}}></div></div>
                              <MagneticButton className="btn btn-glass full-width mt-4" onClick={() => navigateTo('detail')}>View Details</MagneticButton>
                          </div>
                      </div>
                  </div>
              </div>
          </section>

          {/* ASSET CLASS DEEP DIVE */}
          <section className="deep-dive container" id="deep-dive">
              <div className="section-header">
                  <h2>The Asset Class Deep-Dive</h2>
              </div>
              <div className="glass-panel fade-up" style={{ overflowX: 'auto' }}>
                  <table className="deep-dive-table">
                      <thead>
                          <tr>
                              <th>Asset Class</th>
                              <th>Underlying Value</th>
                              <th>Utility</th>
                          </tr>
                      </thead>
                      <tbody>
                          <tr>
                              <td>Commodities</td>
                              <td className="muted">Allocated Gold / Silver / Oil</td>
                              <td>Inflation Hedge + Instant Collateral</td>
                          </tr>
                          <tr>
                              <td>Private Equity</td>
                              <td className="muted">Tokenized LP Interests</td>
                              <td>Secondary Market Liquidity for VC Funds</td>
                          </tr>
                          <tr>
                              <td>Real Estate</td>
                              <td className="muted">Grade-A Commercial / Industrial</td>
                              <td>Real-Time Yield + Capital Appreciation</td>
                          </tr>
                          <tr>
                              <td>Private Credit</td>
                              <td className="muted">SME Debt / Sharia Sukuks</td>
                              <td>Programmable, Daily Interest Distributions</td>
                          </tr>
                      </tbody>
                  </table>
              </div>
          </section>

          {/* PORTFOLIO UI */}
          <section className="portfolio container" id="portfolio">
              <div className="portfolio-dashboard glass-panel fade-up">
                  <div className="dash-grid">
                      <div className="dash-chart main-metric glass-panel-inner">
                          <div className="metric-header">
                              <span className="label">Net Asset Value Preview</span>
                              <h2 className={isLoading ? "skeleton value" : "value"}>$342,890.00</h2>
                              <span className="growth positive">+18.5% All Time</span>
                          </div>
                          <div className={isLoading ? "skeleton main-chart-mock" : "main-chart-mock"}></div>
                      </div>
                      <div className="dash-allocation glass-panel-inner">
                          <h3>Asset Allocation</h3>
                          <div className="donut-mock">
                              <div className={isLoading ? "skeleton donut" : "donut"}></div>
                              <div className={isLoading ? "skeleton legend" : "legend"}>
                                  <div className="legend-item"><span className="dot c-re"></span> Real Estate 55%</div>
                                  <div className="legend-item"><span className="dot c-art"></span> Art 25%</div>
                                  <div className="legend-item"><span className="dot c-com"></span> Commodities 20%</div>
                              </div>
                          </div>
                      </div>
                  </div>
              </div>
          </section>

          {/* SYSTEMIC ADVANTAGES */}
          <section className="advantages container" id="advantages">
              <div className="section-header">
                  <h2>Systemic Advantages</h2>
              </div>
              <div className="advantages-grid">
                  <div className="trust-module">
                      <div className="icon">⚡️</div>
                      <h4>90% Operational Alpha</h4>
                      <p className="muted mt-4 text-sm">We eliminate the "Paper-Chain." Automated registries, distributions, and reporting.</p>
                  </div>
                  <div className="trust-module">
                      <div className="icon">🏛️</div>
                      <h4>Sovereign Trust</h4>
                      <p className="muted mt-4 text-sm">Integrated with VARA (Dubai) and ADGM (Abu Dhabi) frameworks for asset-backed virtual assets (ARVA).</p>
                  </div>
                  <div className="trust-module">
                      <div className="icon">🌍</div>
                      <h4>Global Distribution</h4>
                      <p className="muted mt-4 text-sm">The Asseth API allows any private bank or family office to offer digital assets to their clients via our backend.</p>
                  </div>
              </div>
          </section>

          {/* ADMIN TOOLS */}
          <section className="admin container fade-up" id="admin">
              <div className="admin-banner glass-panel">
                  <div className="admin-content">
                      <h2>Built for operators, not just investors</h2>
                      <ul className={isLoading ? "skeleton admin-list" : "admin-list"}>
                          <li>List new tokenized assets</li>
                          <li>Review KYC submissions</li>
                          <li>Monitor users and manage transactions</li>
                          <li>Control asset operational status</li>
                      </ul>
                  </div>
                  <div className="admin-visual">
                      <div className="admin-mockup glass-panel-inner">
                          <div className="mock-row">
                              <span>User: Alex D.</span>
                              <span className="status warning">KYC Pending</span>
                              <MagneticButton className="btn-micro">Review</MagneticButton>
                          </div>
                          <div className="mock-row">
                              <span>Asset: Vault #4</span>
                              <span className="status complete">Active</span>
                              <MagneticButton className="btn-micro">Manage</MagneticButton>
                          </div>
                      </div>
                  </div>
              </div>
          </section>

          {/* FINAL CTA */}
          <section className="final-cta container fade-up">
              <h2>ASSETH.COM<br/>The New Standard for Global Wealth.</h2>
              <div className="btn-group cta-center">
                  <MagneticButton className="btn btn-primary glow-effect neon-pulse">Contact Institutional Sales</MagneticButton>
                  <MagneticButton className="btn btn-glass">View Whitepaper</MagneticButton>
              </div>
          </section>
        </main>
      )}

      {/* Asset Detail Secondary View */}
      {activeView === 'detail' && (
        <main style={{ padding: '6rem 0', minHeight: '80vh' }}>
            <div className="container section-header" style={{ marginBottom: '2rem' }}>
                <MagneticButton className="btn btn-secondary" onClick={() => navigateTo('home')}>&larr; Back to Platform</MagneticButton>
            </div>
            
            <section className="asset-detail-preview container" id="asset-detail" style={{ paddingTop: '0' }}>
                <div className="detail-mockup glass-panel fade-up visible card-3d gradient-border-wrap">
                    <div className="detail-header">
                        <div className="breadcrumb">Marketplace / Real Estate / Tribeca Luxury Loft</div>
                        <div className="detail-actions">
                            <span className={isLoading ? "skeleton status-badge" : "status-badge"}>Legal Docs Verified</span>
                        </div>
                    </div>
                    <div className="detail-body">
                        <div className="detail-main">
                            <div className={isLoading ? "skeleton large-image" : "large-image"}></div>
                            <div className="tabs">
                                <span className="tab active">Overview</span>
                                <span className="tab">Financials</span>
                                <span className="tab">Documents</span>
                            </div>
                            <div className="mock-content">
                                <h3>Investment Thesis</h3>
                                <p className={isLoading ? "skeleton muted" : "muted"}>A stabilized Class-A commercial property with long-term anchor tenants, offering consistent dividend yield and robust appreciation potential in a high-demand submarket.</p>
                                
                                <div className="projection-grid">
                                    <div className="proj-item">
                                        <span className="label">Target IRR</span>
                                        <span className={isLoading ? "skeleton value" : "value"}>14.2%</span>
                                    </div>
                                    <div className="proj-item">
                                        <span className="label">Hold Period</span>
                                        <span className={isLoading ? "skeleton value" : "value"}>5 Years</span>
                                    </div>
                                    <div className="proj-item">
                                        <span className="label">LTV</span>
                                        <span className={isLoading ? "skeleton value" : "value"}>55%</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="trade-widget glass-panel-inner">
                            <h3>Trade Tokens</h3>
                            <div className="balance-row">
                                <span>Available Balance:</span>
                                <span className={isLoading ? "skeleton accent" : "accent"}>$12,450.00</span>
                            </div>
                            <div className="input-group">
                                <input type="number" defaultValue="100" className={isLoading ? "skeleton trade-input" : "trade-input"} />
                                <span className="currency-label">Tokens</span>
                            </div>
                            <div className="summary-row">
                                <span>Total Cost</span>
                                <span>$14,250.00</span>
                            </div>
                            <MagneticButton className="btn btn-primary full-width glow-effect neon-pulse">Execute Trade</MagneticButton>
                        </div>
                    </div>
                </div>
            </section>
        </main>
      )}

      {/* Footer */}
      <footer className="footer container">
          <div className="footer-content">
              <div className="footer-brand">Asseth.</div>
              <div className="footer-text">A premium platform for discovering, trading, and managing tokenized real-world assets through a clean, secure, and modern ownership experience.</div>
          </div>
          <div className="footer-bottom">
              <span>&copy; 2026 Asseth Platforms.</span>
              <div className="footer-links">
                  <a href="#">Privacy</a>
                  <a href="#">Terms</a>
                  <a href="#">Legal Docs</a>
              </div>
          </div>
      </footer>
    </>
  )
}

export default App
