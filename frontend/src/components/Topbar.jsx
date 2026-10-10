import { Link, useLocation } from 'react-router-dom'
import { useRole } from '../context/RoleContext.jsx'
import RoleSelector from './RoleSelector.jsx'

const titles = {
  '/dashboard': 'Overview',
  '/trips': 'Trips',
  '/routes': 'Routes',
  '/fleet': 'Fleet',
  '/tickets': 'Tickets',
  '/payments': 'Payments',
}

function Topbar() {
  const { pathname } = useLocation()
  const { role, setRole } = useRole()

  return (
    <header className="topbar">
      <div className="breadcrumbs">
        <span>Workspace</span><span className="crumb-divider">/</span><strong>{titles[pathname] ?? 'Overview'}</strong>
      </div>
      <div className="topbar-actions">
        <RoleSelector value={role} onChange={setRole} label="View as" className="role-picker" />
        <button className="icon-button notification-button" type="button" aria-label="Notifications">
          ♧<span className="notification-dot" />
        </button>
        <Link className="profile-button" to="/login" aria-label="Open sign in page">
          <span className="avatar">AM</span><span className="profile-name">Alex Morgan</span><span className="chevron">⌄</span>
        </Link>
      </div>
    </header>
  )
}

export default Topbar
