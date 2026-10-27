import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import './PassengerBookingPage.css'

const departures = [
  { id: 'RUTA-101', operator: 'Volcano Express', from: 'Kigali', to: 'Huye', depart: '08:00', arrive: '10:45', duration: '2h 45m', price: 3500, seats: 12, type: 'Executive coach' },
  { id: 'RUTA-204', operator: 'Ritco', from: 'Kigali', to: 'Huye', depart: '09:30', arrive: '12:20', duration: '2h 50m', price: 3000, seats: 8, type: 'Standard coach' },
  { id: 'RUTA-310', operator: 'Volcano Express', from: 'Kigali', to: 'Musanze', depart: '10:00', arrive: '12:15', duration: '2h 15m', price: 2800, seats: 16, type: 'Executive coach' },
  { id: 'RUTA-415', operator: 'Ritco', from: 'Huye', to: 'Kigali', depart: '14:00', arrive: '16:50', duration: '2h 50m', price: 3000, seats: 10, type: 'Standard coach' },
]
const money = value => new Intl.NumberFormat('en-RW').format(value) + ' RWF'

function PassengerBookingPage() {
  const [from, setFrom] = useState('Kigali')
  const [to, setTo] = useState('Huye')
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10))
  const [passengers, setPassengers] = useState('1')
  const [searched, setSearched] = useState(false)
  const [selectedTrip, setSelectedTrip] = useState(null)
  const [selectedSeats, setSelectedSeats] = useState([])
  const [booking, setBooking] = useState(null)
  const results = useMemo(() => departures.filter(trip => trip.from === from && trip.to === to), [from, to])

  function searchTrips(event) {
    event.preventDefault()
    setSearched(true)
    setSelectedTrip(null)
    setSelectedSeats([])
    setBooking(null)
  }
  function toggleSeat(seat) {
    setSelectedSeats(current => current.includes(seat)
      ? current.filter(item => item !== seat)
      : current.length < Number(passengers) ? [...current, seat] : current)
  }
  function confirmBooking() {
    if (!selectedTrip || selectedSeats.length !== Number(passengers)) return
    setBooking({ reference: 'RT-' + Math.random().toString(36).slice(2, 8).toUpperCase(), trip: selectedTrip, seats: [...selectedSeats], date })
  }

  return (
    <main className="passenger-app">
      <header className="passenger-nav">
        <Link className="passenger-brand" to="/"><span className="passenger-brand-mark">R</span><span>ruta<small>SMART MOBILITY</small></span></Link>
        <nav aria-label="Main navigation"><a href="#find-trip">Find a trip</a><a href="#how-it-works">How it works</a><Link to="/login">Sign in</Link></nav>
        <a className="passenger-nav-cta" href="#find-trip">Book a seat <span>↗</span></a>
      </header>
      <section className="passenger-hero">
        <div className="passenger-hero-copy"><span className="passenger-kicker"><i /> YOUR JOURNEY, SIMPLIFIED</span><h1>Go further.<br /><em>Travel smarter.</em></h1><p>Find your route, choose your seat, and keep your ticket close — all in one place.</p><div className="passenger-trust"><span>✓ Clear fares</span><span>✓ Seat selection</span><span>✓ Digital ticket preview</span></div></div>
        <div className="passenger-hero-art" aria-hidden="true"><div className="hero-sun" /><div className="hero-road" /><div className="hero-bus"><span /><span /><span /><b>RUTA</b></div><div className="hero-route-tag"><span>●</span> Your next stop awaits</div></div>
      </section>
      <section className="booking-wrap" id="find-trip">
        <div className="booking-heading"><div><span className="passenger-kicker">PLAN YOUR RIDE</span><h2>Where are you going?</h2></div><span className="secure-note">⌁ Simple. Secure. Convenient.</span></div>
        <form className="trip-search-form" onSubmit={searchTrips}>
          <label><span>FROM</span><select value={from} onChange={e => setFrom(e.target.value)}><option>Kigali</option><option>Huye</option><option>Musanze</option></select></label>
          <button className="swap-route" type="button" aria-label="Swap locations" onClick={() => { setFrom(to); setTo(from) }}>⇄</button>
          <label><span>TO</span><select value={to} onChange={e => setTo(e.target.value)}><option>Huye</option><option>Kigali</option><option>Musanze</option></select></label>
          <label><span>TRAVEL DATE</span><input type="date" value={date} min={new Date().toISOString().slice(0, 10)} onChange={e => setDate(e.target.value)} required /></label>
          <label><span>PASSENGERS</span><select value={passengers} onChange={e => { setPassengers(e.target.value); setSelectedSeats([]) }}><option value="1">1 passenger</option><option value="2">2 passengers</option><option value="3">3 passengers</option><option value="4">4 passengers</option></select></label>
          <button className="search-trip-button" type="submit">Search trips <span>→</span></button>
        </form>
      </section>
      <section className="trip-results-section">
        <div className="results-heading"><div><span className="passenger-kicker">{searched ? 'AVAILABLE DEPARTURES' : 'POPULAR JOURNEYS'}</span><h2>{searched ? `${from} to ${to}` : 'Made for the way you move'}</h2></div><span className="results-date">{searched ? new Date(date + 'T12:00:00').toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' }) : 'Explore routes across Rwanda'}</span></div>
        {searched && results.length === 0 && <div className="empty-trips"><strong>No sample departures found for this route.</strong><p>Try another route. These are demonstration schedules, not live operator inventory.</p></div>}
        <div className="passenger-trip-list">{(searched ? results : departures.slice(0, 3)).map(trip => <article className="passenger-trip-card" key={trip.id}>
          <div className="operator-mark">{trip.operator.split(' ').map(word => word[0]).join('').slice(0, 2)}</div><div className="operator-info"><strong>{trip.operator}</strong><span>{trip.type}</span><small>{trip.seats} sample seats available</small></div>
          <div className="trip-time"><strong>{trip.depart}</strong><span>{trip.from}</span></div><div className="trip-duration"><span>{trip.duration}</span><div><i /></div><small>Direct trip</small></div><div className="trip-time"><strong>{trip.arrive}</strong><span>{trip.to}</span></div>
          <div className="trip-fare"><strong>{money(trip.price)}</strong><span>per passenger</span><button type="button" onClick={() => { setSelectedTrip(trip); setSelectedSeats([]); setBooking(null) }}>{selectedTrip?.id === trip.id ? 'Selected' : 'Choose seats'} <span>→</span></button></div>
        </article>)}</div>
        {!searched && <p className="sample-disclaimer">Schedules and fares shown are sample data for preview only.</p>}
      </section>
      {selectedTrip && <section className="seat-booking-panel" aria-live="polite">
        <div className="seat-panel-heading"><div><span className="passenger-kicker">STEP 2 OF 3</span><h2>Choose your seats</h2><p>{selectedTrip.operator} · {selectedTrip.from} to {selectedTrip.to} · {selectedTrip.depart}</p></div><button type="button" className="close-panel" onClick={() => setSelectedTrip(null)} aria-label="Close seat selection">×</button></div>
        <div className="seat-layout"><div className="seat-key"><span><i className="seat-free" /> Available</span><span><i className="seat-chosen" /> Selected</span><span><i className="seat-taken" /> Unavailable</span></div>
          <div className="bus-seats"><div className="driver-seat">DRIVER</div>{Array.from({ length: 20 }, (_, index) => { const seat = 'A' + (index + 1); const unavailable = [3, 7, 12, 16].includes(index + 1); return <button key={seat} type="button" disabled={unavailable} className={'seat ' + (unavailable ? 'unavailable' : selectedSeats.includes(seat) ? 'chosen' : '')} onClick={() => toggleSeat(seat)} aria-pressed={selectedSeats.includes(seat)}>{seat}</button> })}</div>
          <div className="seat-summary"><div><span>Selected seats</span><strong>{selectedSeats.length ? selectedSeats.join(', ') : 'Choose ' + passengers + ' seat(s)'}</strong></div><div><span>Total fare</span><strong>{money(selectedTrip.price * Number(passengers))}</strong></div><button type="button" disabled={selectedSeats.length !== Number(passengers)} onClick={confirmBooking}>Confirm booking <span>→</span></button></div>
        </div><p className="sample-disclaimer">Seat availability is simulated. No real seat is reserved and no payment is collected.</p>
      </section>}
      {booking && <section className="booking-confirmation" aria-live="polite"><span className="confirmation-check">✓</span><div><span className="passenger-kicker">DEMO BOOKING CREATED</span><h2>Your ticket preview is ready</h2><p>Reference <strong>{booking.reference}</strong> · {booking.trip.from} to {booking.trip.to} · {booking.seats.join(', ')} · {booking.date}</p><small>This is a local demonstration only. It is not a valid travel ticket.</small></div><button type="button" onClick={() => window.print()}>Print preview</button></section>}
      <section className="passenger-steps" id="how-it-works"><div><span>01</span><strong>Find your route</strong><p>Choose your departure, destination and date.</p></div><div><span>02</span><strong>Pick your seat</strong><p>Review the bus layout and select your seats.</p></div><div><span>03</span><strong>Keep your ticket</strong><p>Review a ticket preview before real payments are connected.</p></div></section>
      <footer className="passenger-footer"><Link className="passenger-brand" to="/"><span className="passenger-brand-mark">R</span><span>ruta<small>SMART MOBILITY</small></span></Link><span>Move with confidence.</span><span>Responsive web preview · Native apps remain separate deliverables</span></footer>
    </main>
  )
}
export default PassengerBookingPage
