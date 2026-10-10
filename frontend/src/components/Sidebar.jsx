import { Link, NavLink } from 'react-router-dom'

const navigation = [
  { label: 'Overview', path: '/dashboard', icon: '▦' },
  { label: 'Trips', path: '/trips', icon: '↗' },
  { label: 'Routes', path: '/routes', icon: '⌁' },
  { label: 'Fleet', path: '/fleet', icon: '▰' },
  { label: 'Tickets', path: '/tickets', icon: '▤' },
  { label: 'Payments', path: '/payments', icon: '₣' },
]

function Sidebar() {
  return (
    <aside className="sidebar">
      <Link className="brand" to="/dashboard" aria-label="Ruta home">
        <span className="brand-mark">R</span>
        <span className="brand-copy">
          <strong>ruta</strong>
          <small>SMART MOBILITY</small>
        </span>
      </Link>

      <div className="workspace-label">WORKSPACE</div>
      <nav className="side-nav" aria-label="Main navigation">
        {navigation.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
          >
            <span className="nav-icon" aria-hidden="true">{item.icon}</span>
            <span>{item.label}</span>
            {item.label === 'Trips' && <span className="nav-count">8</span>}
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-bottom">
        <div className="help-card">
          <span className="help-icon">?</span>
          <strong>Need a hand?</strong>
          <span>Our support team is here for you.</span>
          <a href="mailto:support@ruta.rw">Contact support <span aria-hidden="true">→</span></a>
        </div>
        <div className="sidebar-user">
          <span className="avatar avatar-dark">AM</span>
          <span className="user-copy"><strong>Alex Morgan</strong><small>Workspace admin</small></span>
          <span className="user-menu" aria-hidden="true">···</span>
        </div>
      </div>
    </aside>
  )
}

export default Sidebar
