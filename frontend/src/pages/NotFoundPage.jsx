import { Link } from 'react-router-dom'

function NotFoundPage() {
  return (
    <main className="not-found">
      <span className="brand-mark">R</span>
      <span className="eyebrow">404 · ROUTE NOT FOUND</span>
      <h1>This route isn’t on the map.</h1>
      <p>The page you’re looking for may have moved or is not available yet.</p>
      <Link className="action-button primary" to="/dashboard">Go to overview</Link>
    </main>
  )
}

export default NotFoundPage
