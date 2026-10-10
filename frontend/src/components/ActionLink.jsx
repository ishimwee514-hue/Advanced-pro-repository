import { Link } from 'react-router-dom'

function ActionLink({ to, children, variant = 'primary' }) {
  return <Link className={`action-button ${variant}`} to={to}>{children}</Link>
}

export default ActionLink
