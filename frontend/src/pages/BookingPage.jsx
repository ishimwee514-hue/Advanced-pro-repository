import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { bookTrip, getMyTickets, getTripSeats, getTrips } from '../services/tripService.js'
import { login, registerPassenger } from '../services/authService.js'

function todayLocal() {
  const date = new Date()
  date.setMinutes(date.getMinutes() - date.getTimezoneOffset())
  return date.toISOString().slice(0, 10)
}

function money(value) {
  return `RWF ${Number(value).toLocaleString()}`
}

function formatDeparture(value) {
  return new Date(value).toLocaleString(undefined, { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
}

function BookingPage() {
  const [filters, setFilters] = useState({ origin: 'Kigali', destination: 'Huye', date: todayLocal() })
  const [trips, setTrips] = useState([])
  const [selectedTrip, setSelectedTrip] = useState(null)
  const [seats, setSeats] = useState([])
  const [selectedSeat, setSelectedSeat] = useState('')
  const [authMode, setAuthMode] = useState('register')
  const [auth, setAuth] = useState(() => {
    try { return JSON.parse(sessionStorage.getItem('ruta-passenger-auth') || 'null') } catch { return null }
  })
  const [tickets, setTickets] = useState([])
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)

  useEffect(() => {
    if (!auth?.token) return
    getMyTickets(auth.token).then((result) => setTickets(result.tickets ?? [])).catch(() => {
      sessionStorage.removeItem('ruta-passenger-auth')
      setAuth(null)
    })
  }, [auth?.token])

  async function searchTrips(event) {
    event.preventDefault()
    setError('')
    setMessage('')
    setSelectedTrip(null)
    setSeats([])
    setSelectedSeat('')
    setLoading(true)
    try {
      const result = await getTrips(filters)
      setTrips(result.trips ?? [])
      setSearched(true)
    } catch (requestError) {
      setError(requestError.message || 'Could not search trips. Check the API and database configuration.')
    } finally { setLoading(false) }
  }

  async function chooseTrip(trip) {
    setError('')
    setMessage('')
    setSelectedSeat('')
    setSelectedTrip(trip)
    setSeats([])
    setLoading(true)
    try {
      const result = await getTripSeats(trip.id)
      setSelectedTrip(result.trip)
      setSeats(result.seats ?? [])
    } catch (requestError) {
      setError(requestError.message || 'Could not load seat availability.')
      setSelectedTrip(null)
    } finally { setLoading(false) }
  }

  async function submitAuth(event) {
    event.preventDefault()
    setError('')
    setMessage('')
    const form = new FormData(event.currentTarget)
    const details = {
      email: String(form.get('email') || '').trim(),
      password: String(form.get('password') || ''),
    }
    if (authMode === 'register') {
      details.name = String(form.get('name') || '').trim()
      details.phone = String(form.get('phone') || '').trim() || undefined
    }
    setLoading(true)
    try {
      const result = authMode === 'register' ? await registerPassenger(details) : await login(details)
      const nextAuth = { token: result.token, user: result.user }
      sessionStorage.setItem('ruta-passenger-auth', JSON.stringify(nextAuth))
      setAuth(nextAuth)
      setMessage(`Signed in as ${result.user.name}.`)
    } catch (requestError) {
      setError(requestError.message || 'Could not authenticate. Check the API configuration.')
    } finally { setLoading(false) }
  }

  async function confirmBooking() {
    if (!selectedTrip || !selectedSeat || !auth?.token) return
    setError('')
    setMessage('')
    setLoading(true)
    try {
      const result = await bookTrip(selectedTrip.id, selectedSeat, auth.token)
      setMessage(`Seat ${result.ticket.seatNumber} reserved. Ticket reference: ${result.ticket.id}. Status: ${result.ticket.status}. Payment is not yet enabled.`)
      setSelectedSeat('')
      const seatResult = await getTripSeats(selectedTrip.id)
      setSeats(seatResult.seats ?? [])
      const myTickets = await getMyTickets(auth.token)
      setTickets(myTickets.tickets ?? [])
    } catch (requestError) {
      setError(requestError.message || 'Booking failed. Refresh the seat list and try again.')
      try {
        const seatResult = await getTripSeats(selectedTrip.id)
        setSeats(seatResult.seats ?? [])
      } catch { /* Keep the original booking error visible. */ }
    } finally { setLoading(false) }
  }

  function signOut() {
    sessionStorage.removeItem('ruta-passenger-auth')
    setAuth(null)
    setTickets([])
    setMessage('You have signed out.')
  }

  return (
    <main className="booking-page">
      <header className="booking-header">
        <Link className="entry-brand booking-brand" to="/" aria-label="Ruta home"><span className="entry-brand-mark">R</span><span>ruta<small>MOVE WITH EASE</small></span></Link>
        <nav><Link to="/">Home</Link>{auth ? <><span className="booking-user">{auth.user.name}</span><button className="booking-link-button" type="button" onClick={signOut}>Sign out</button></> : <Link to="/login">Staff sign in</Link>}</nav>
      </header>
      <section className="booking-intro">
        <span className="entry-eyebrow">PASSENGER BOOKINGS</span>
        <h1>Find your trip. Choose your seat.</h1>
        <p>Search scheduled trips from the Ruta API, check current seat availability, and reserve a seat with a passenger account.</p>
      </section>

      <section className="booking-panel">
        <h2>Search trips</h2>
        <form className="booking-search-form" onSubmit={searchTrips}>
          <label>From<input value={filters.origin} onChange={(event) => setFilters({ ...filters, origin: event.target.value })} placeholder="e.g. Kigali" maxLength={100} required /></label>
          <label>To<input value={filters.destination} onChange={(event) => setFilters({ ...filters, destination: event.target.value })} placeholder="e.g. Huye" maxLength={100} required /></label>
          <label>Travel date<input type="date" min={todayLocal()} value={filters.date} onChange={(event) => setFilters({ ...filters, date: event.target.value })} required /></label>
          <button className="action-button primary" type="submit" disabled={loading}>{loading ? 'Please wait…' : 'Search trips'}</button>
        </form>
      </section>

      {error && <p className="booking-alert error" role="alert">{error}</p>}
      {message && <p className="booking-alert success" role="status">{message}</p>}

      {searched && <section className="booking-panel">
        <div className="booking-section-heading"><div><h2>Available trips</h2><p>{trips.length} result{trips.length === 1 ? '' : 's'} · live database results</p></div></div>
        {trips.length === 0 ? <p className="booking-empty">No matching trips were found. Confirm that an operator has scheduled trips for this route and date.</p> : <div className="booking-trip-list">
          {trips.map((trip) => <article className={selectedTrip?.id === trip.id ? 'booking-trip selected' : 'booking-trip'} key={trip.id}>
            <div className="booking-trip-route"><strong>{trip.origin} <span>→</span> {trip.destination}</strong><span>{formatDeparture(trip.departureAt)}</span><small>{trip.vehicle?.model || 'Bus'} · {trip.availableSeats} seats available</small></div>
            <div className="booking-trip-fare"><strong>{money(trip.fare)}</strong><span>per passenger</span></div>
            <button type="button" className="action-button secondary" onClick={() => chooseTrip(trip)} disabled={loading}>{selectedTrip?.id === trip.id ? 'Selected' : 'Choose seats'}</button>
          </article>)}
        </div>}
      </section>}

      {selectedTrip && <section className="booking-panel">
        <div className="booking-section-heading"><div><h2>Choose a seat</h2><p>{selectedTrip.origin} → {selectedTrip.destination} · {money(selectedTrip.fare)}</p></div><button className="booking-link-button" type="button" onClick={() => { setSelectedTrip(null); setSeats([]); setSelectedSeat('') }}>Change trip</button></div>
        <div className="seat-legend"><span><i className="seat-dot available" /> Available</span><span><i className="seat-dot chosen" /> Selected</span><span><i className="seat-dot booked" /> Booked</span></div>
        <div className="seat-grid" aria-label="Seat selection">
          {seats.map((seat) => <button key={seat.seatNumber} type="button" aria-pressed={selectedSeat === seat.seatNumber} disabled={seat.status !== 'AVAILABLE' || loading} className={`seat-button ${seat.status === 'BOOKED' ? 'booked' : selectedSeat === seat.seatNumber ? 'chosen' : 'available'}`} onClick={() => setSelectedSeat(seat.seatNumber)}>{seat.seatNumber}</button>)}
        </div>
        <div className="booking-confirm-row"><p>{selectedSeat ? `Seat ${selectedSeat} selected · ${money(selectedTrip.fare)}` : 'Select an available seat to continue.'}</p><button className="action-button primary" type="button" disabled={!selectedSeat || !auth?.token || loading} onClick={confirmBooking}>{loading ? 'Please wait…' : 'Reserve seat'}</button></div>
        {!auth && <div className="booking-auth">
          <div className="booking-section-heading"><div><h2>{authMode === 'register' ? 'Create a passenger account' : 'Passenger sign in'}</h2><p>Sign in is required before a seat can be reserved.</p></div></div>
          <div className="booking-auth-toggle"><button type="button" className={authMode === 'register' ? 'active' : ''} onClick={() => setAuthMode('register')}>Create account</button><button type="button" className={authMode === 'login' ? 'active' : ''} onClick={() => setAuthMode('login')}>Sign in</button></div>
          <form className="booking-auth-form" onSubmit={submitAuth}>
            {authMode === 'register' && <label>Full name<input name="name" autoComplete="name" minLength={2} maxLength={100} required /></label>}
            <label>Email<input name="email" type="email" autoComplete="email" maxLength={254} required /></label>
            {authMode === 'register' && <label>Phone (optional)<input name="phone" type="tel" autoComplete="tel" maxLength={30} /></label>}
            <label>Password<input name="password" type="password" autoComplete={authMode === 'register' ? 'new-password' : 'current-password'} minLength={8} maxLength={128} required /></label>
            <button className="action-button primary" type="submit" disabled={loading}>{loading ? 'Please wait…' : authMode === 'register' ? 'Create account' : 'Sign in'}</button>
          </form>
        </div>}
        {auth && <p className="booking-authenticated">Signed in as {auth.user.email}. Select a seat and reserve it.</p>}
        <p className="booking-payment-note">Reservations remain pending. This page does not collect payments or issue a paid/confirmed ticket.</p>
      </section>}

      {auth && <section className="booking-panel">
        <div className="booking-section-heading"><div><h2>My tickets</h2><p>Tickets linked to your passenger account.</p></div><button className="booking-link-button" type="button" onClick={() => getMyTickets(auth.token).then((result) => setTickets(result.tickets ?? [])).catch((e) => setError(e.message))}>Refresh</button></div>
        {tickets.length === 0 ? <p className="booking-empty">No tickets yet. Search for a trip and reserve a seat.</p> : <div className="booking-ticket-list">{tickets.map((ticket) => <article className="booking-ticket" key={ticket.id}><div><strong>{ticket.origin} → {ticket.destination}</strong><span>{formatDeparture(ticket.departureAt)}</span></div><div><span>Seat {ticket.seatNumber} · {money(ticket.fare)}</span><small>Reference: {ticket.id}</small></div><span className={`booking-ticket-status ${ticket.status.toLowerCase()}`}>{ticket.status}</span></article>)}</div>}
      </section>}
      <footer className="booking-footer">Ruta · Passenger booking · Payments are not enabled yet</footer>
    </main>
  )
}

export default BookingPage
