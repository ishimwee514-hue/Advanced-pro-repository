import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useRole } from '../context/RoleContext.jsx'

function LoginPage() {
  const [email, setEmail] = useState('')
  const { role, setRole } = useRole()
  const navigate = useNavigate()

  function handleSubmit(event) {
    event.preventDefault()
    navigate('/dashboard')
  }

  return (
    <main className="login-page">
      <section className="login-visual">
        <a className="brand login-brand" href="/dashboard"><span className="brand-mark">R</span><span className="brand-copy"><strong>ruta</strong><small>SMART MOBILITY</small></span></a>
        <div className="login-message">
          <span className="banner-kicker">MOVE YOUR WORLD</span>
          <h1>Better journeys,<br />connected.</h1>
          <p>One workspace to bring your routes, fleet and passengers together.</p>
        </div>
        <div className="login-visual-footer"><span>Designed for the way Rwanda moves.</span><span>Kigali · Rwanda</span></div>
        <div className="login-orbit orbit-one" /><div className="login-orbit orbit-two" />
      </section>
      <section className="login-form-side">
        <div className="login-form-wrap">
          <div className="mobile-brand brand"><span className="brand-mark">R</span><span className="brand-copy"><strong>ruta</strong><small>SMART MOBILITY</small></span></div>
          <span className="eyebrow">WELCOME TO RUTA</span>
          <h2>Sign in to your workspace</h2>
          <p className="login-intro">Choose a demo role to explore the starter experience.</p>
          <form onSubmit={handleSubmit}>
            <label htmlFor="email">Email address</label>
            <input id="email" type="email" placeholder="you@company.com" value={email} onChange={(event) => setEmail(event.target.value)} required />
            <label htmlFor="role">Explore as</label>
            <select id="role" value={role} onChange={(event) => setRole(event.target.value)}>
              <option value="agency">Agency staff</option>
              <option value="driver">Driver</option>
              <option value="passenger">Passenger</option>
            </select>
            <button className="action-button primary login-submit" type="submit">Continue to demo <span aria-hidden="true">→</span></button>
          </form>
          <p className="demo-disclaimer">This is a frontend demo. Sign-in is not authenticated and your email is not saved.</p>
          <Link to="/dashboard" className="back-link">← Back to workspace</Link>
        </div>
      </section>
    </main>
  )
}

export default LoginPage
