import { useState } from 'react'
import './App.css'

const featureCards = [
  {
    title: 'Smart routing',
    text: 'Optimizes every trip in real time to reduce delays and improve service reliability.',
  },
  {
    title: 'Live monitoring',
    text: 'Tracks vehicles, drivers, and route performance from a single operations panel.',
  },
  {
    title: 'Passenger experience',
    text: 'Improves travel clarity with accurate updates, efficient dispatching, and transparent ETA info.',
  },
]

const metrics = [
  { label: 'Active routes', value: '128' },
  { label: 'On-time arrivals', value: '96%' },
  { label: 'Fuel savings', value: '18%' },
  { label: 'Fleet health', value: '91%' },
]

const routeStatus = [
  { name: 'North corridor', status: 'On schedule', tone: 'good' },
  { name: 'Airport loop', status: 'Needs review', tone: 'warning' },
  { name: 'University line', status: 'Delayed 6 min', tone: 'critical' },
]

function App() {
  const [isOpen, setIsOpen] = useState(false)

  if (!isOpen) {
    return (
      <main className="app-shell intro-shell">
        <header className="topbar">
          <div className="brand-wrap">
            <span className="brand-mark">R</span>
            <span>Ruta Smart Transport</span>
          </div>
          <button type="button" className="ghost-button" onClick={() => setIsOpen(true)}>
            Open in browser
          </button>
        </header>

        <section className="hero-grid">
          <div className="hero-copy">
            <span className="eyebrow">Introducing the system</span>
            <h1>Smarter transport operations for every route.</h1>
            <p>
              Ruta Smart Transport brings together route planning, vehicle tracking, and passenger
              communication in one connected platform designed to keep your network efficient and
              dependable.
            </p>

            <div className="cta-row">
              <button type="button" className="primary-button" onClick={() => setIsOpen(true)}>
                Open in browser
              </button>
              <button type="button" className="secondary-button" onClick={() => setIsOpen(true)}>
                System overview
              </button>
            </div>
          </div>

          <div className="hero-card" aria-label="System summary panel">
            <div className="mini-header">
              <span className="dot" />
              <span>Live control center</span>
            </div>
            <div className="hero-metrics">
              {metrics.map((metric) => (
                <div key={metric.label} className="mini-stat">
                  <strong>{metric.value}</strong>
                  <span>{metric.label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="feature-section">
          <div className="section-heading">
            <span className="eyebrow">Why teams choose it</span>
            <h2>The backbone of modern mobility</h2>
          </div>

          <div className="feature-grid">
            {featureCards.map((card) => (
              <article key={card.title} className="feature-card">
                <span className="feature-icon">◆</span>
                <h3>{card.title}</h3>
                <p>{card.text}</p>
              </article>
            ))}
          </div>
        </section>
      </main>
    )
  }

  return (
    <main className="app-shell dashboard-shell">
      <header className="topbar dashboard-topbar">
        <div className="brand-wrap">
          <span className="brand-mark">R</span>
          <span>Operations browser</span>
        </div>
        <button type="button" className="ghost-button" onClick={() => setIsOpen(false)}>
          Return overview
        </button>
      </header>

      <section className="dashboard-panel">
        <div className="panel-header">
          <div>
            <span className="eyebrow">System status</span>
            <h2>Route efficiency dashboard</h2>
          </div>
          <span className="status-pill">All stations online</span>
        </div>

        <div className="stats-grid">
          {metrics.map((metric) => (
            <div key={metric.label} className="stat-card">
              <span>{metric.label}</span>
              <strong>{metric.value}</strong>
            </div>
          ))}
        </div>

        <div className="route-panel">
          <div className="route-header">
            <h3>Live route monitoring</h3>
            <span>Updated 2 mins ago</span>
          </div>

          <div className="route-list">
            {routeStatus.map((route) => (
              <div key={route.name} className="route-row">
                <div>
                  <strong>{route.name}</strong>
                </div>
                <span className={`route-badge ${route.tone}`}>{route.status}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}

export default App
