import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { routes } from '../data/demoData.js'

const departureTimes = ['07:00', '09:30', '13:00', '16:30']
const capacity = 40

function localDateValue() {
  const date = new Date()
  date.setMinutes(date.getMinutes() - date.getTimezoneOffset())
  return date.toISOString().slice(0, 10)
}

function makeDepartures(from, to, date) {
  const matchingRoute = routes.find((route) => {
    const [routeFrom, routeTo] = route.name.split(' — ')
    return (routeFrom === from && routeTo === to) || (routeFrom === to && routeTo === from)
  })

  if (!matchingRoute) return []

  const [routeFrom, routeTo] = matchingRoute.name.split(' — ')
  const fare = Number(matchingRoute.fare.replace(/[^\d]/g, ''))

  return departureTimes.map((time, index) => ({
    id: `${from}-${to}-${date}-${time}`,
    from,
    to,
    date,
    time,
    duration: matchingRoute.duration,
    fare,
    seatsLeft: Math.max(4, capacity - index * 7 - 3),
    operator: 'Ruta Express',
    routeFrom,
    routeTo,
  }))
}

function formatDate(date) {
  return new Date(`${date}T12:00:00`).toLocaleDateString('en', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  })
}

function EntryPage() {
  const [search, setSearch] = useState({ from: 'Kigali', to: 'Musanze', date: localDateValue(), passengers: '1' })
  const [searched, setSearched] = useState(null)
  const [selectedTrip, setSelectedTrip] = useState(null)
  const [confirmation, setConfirmation] = useState(null)
  const departuresRef = useRef(null)

  useEffect(() => {
    if (searched) departuresRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [searched])

  const availableDepartures = searched ? makeDepartures(searched.from, searched.to, searched.date) : []

  function handleSearch(event) {
    event.preventDefault()
    setSelectedTrip(null)
    setConfirmation(null)
    setSearched({ ...search })
  }

  function handleBooking(event) {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    const ticket = {
      reference: `RT-${Date.now().toString().slice(-6)}`,
      passenger: form.get('passenger').trim(),
      phone: form.get('phone').trim(),
      trip: selectedTrip,
      passengers: Number(search.passengers),
      bookedAt: new Date().toISOString(),
    }

    try {
      const previousBookings = JSON.parse(localStorage.getItem('ruta-demo-bookings') || '[]')
      localStorage.setItem('ruta-demo-bookings', JSON.stringify([ticket, ...previousBookings]))
    } catch {
      // The confirmation still works when browser storage is unavailable.
    }

    setConfirmation(ticket)
  }

  function closeDialog() {
    setSelectedTrip(null)
    setConfirmation(null)
  }

  return (
    <main className="entry-page">
      <section className="entry-hero" id="top">
        <img
          className="entry-hero-image"
          src="https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=2200&q=85"
          alt="A coach bus ready for an intercity journey"
        />
        <div className="entry-hero-shade" />
        <header className="entry-header">
          <a className="entry-brand" href="#top" aria-label="Ruta home">
            <span className="entry-brand-mark">R</span>
            <span>ruta<small>MOVE WITH EASE</small></span>
          </a>
          <nav className="entry-nav" aria-label="Main navigation">
            <a href="#how-it-works">How it works</a>
            <a href="#routes">Popular routes</a>
            <Link to="/book">Seat booking preview</Link>
            <Link to="/login">Staff sign in <span aria-hidden="true">↗</span></Link>
          </nav>
        </header>

        <div className="entry-hero-content">
          <div className="entry-intro">
            <span className="entry-eyebrow"><i /> INTERCITY TRAVEL, MADE SIMPLE</span>
            <h1>Rwanda is closer<br />than you think.</h1>
            <p>Find your bus, book your seat, and get moving. Ruta brings trusted intercity journeys together in one easy place.</p>
            <a className="entry-text-link" href="#how-it-works">Get to know Ruta <span aria-hidden="true">↓</span></a>
          </div>

          <form className="entry-search" onSubmit={handleSearch}>
            <div className="entry-search-heading">
              <span className="entry-search-icon" aria-hidden="true">↗</span>
              <div><span className="entry-eyebrow">YOUR NEXT JOURNEY</span><h2>Where are you headed?</h2></div>
            </div>
            <div className="entry-fields">
              <label>From
                <select value={search.from} onChange={(event) => setSearch({ ...search, from: event.target.value })}>
                  <option>Kigali</option><option>Musanze</option><option>Huye</option><option>Rubavu</option><option>Nyagatare</option>
                </select>
              </label>
              <label>To
                <select value={search.to} onChange={(event) => setSearch({ ...search, to: event.target.value })}>
                  <option>Musanze</option><option>Huye</option><option>Rubavu</option><option>Nyagatare</option><option>Kigali</option>
                </select>
              </label>
              <div className="entry-search-row">
                <label>Travel date
                  <input type="date" min={localDateValue()} value={search.date} onChange={(event) => setSearch({ ...search, date: event.target.value })} required />
                </label>
                <label>Passengers
                  <select value={search.passengers} onChange={(event) => setSearch({ ...search, passengers: event.target.value })}>
                    <option value="1">1 passenger</option><option value="2">2 passengers</option><option value="3">3 passengers</option><option value="4">4 passengers</option>
                  </select>
                </label>
              </div>
            </div>
            <button className="entry-search-submit" type="submit">Find a bus <span aria-hidden="true">→</span></button>
            <p className="entry-demo-hint">Demo schedules · No payment is collected</p>
          </form>
        </div>
        <div className="entry-hero-caption"><span>BUILT FOR THE JOURNEY</span><span>01 / RWANDA</span></div>
      </section>

      {searched && (
        <section className="entry-departures" ref={departuresRef} aria-live="polite">
          <div className="entry-section-heading">
            <div><span className="entry-eyebrow">DEPARTURES FOR {formatDate(searched.date).toUpperCase()}</span><h2>{searched.from} <span aria-hidden="true">→</span> {searched.to}</h2></div>
            <button className="entry-reset-search" type="button" onClick={() => setSearched(null)}>Change search</button>
          </div>
          <p className="entry-results-note">Example departures and fares for this demo. Schedules and seat counts are not live.</p>
          {availableDepartures.length ? (
            <div className="entry-departure-list">
              {availableDepartures.map((departure) => (
                <article className="entry-departure" key={departure.id}>
                  <div className="entry-departure-time"><strong>{departure.time}</strong><span>{departure.operator}</span></div>
                  <div className="entry-departure-route"><strong>{departure.from} <span aria-hidden="true">→</span> {departure.to}</strong><span>{departure.duration} · {departure.seatsLeft} example seats left</span></div>
                  <div className="entry-departure-fare"><strong>RWF {departure.fare.toLocaleString()}</strong><span>per passenger</span></div>
                  <button type="button" className="entry-select-trip" onClick={() => { setSelectedTrip(departure); setConfirmation(null) }}>Select trip <span aria-hidden="true">→</span></button>
                </article>
              ))}
            </div>
          ) : (
            <div className="entry-no-routes"><strong>No direct route in this demo yet.</strong><span>Try a journey to or from Kigali.</span></div>
          )}
        </section>
      )}

      <section className="entry-about" id="how-it-works">
        <div className="entry-about-intro">
          <span className="entry-eyebrow">A BETTER WAY TO GET THERE</span>
          <h2>One simple place<br />for the whole trip.</h2>
          <p>Ruta helps passengers discover intercity bus routes and plan ahead, while giving transport operators one place to manage trips.</p>
        </div>
        <div className="entry-steps">
          <article><span className="entry-step-number">01</span><div><h3>Choose your route</h3><p>See example departures between Rwanda's main towns.</p></div><span className="entry-step-arrow" aria-hidden="true">↗</span></article>
          <article><span className="entry-step-number">02</span><div><h3>Reserve a seat</h3><p>Enter passenger details to create a demo reservation.</p></div><span className="entry-step-arrow" aria-hidden="true">↗</span></article>
          <article><span className="entry-step-number">03</span><div><h3>Travel with confidence</h3><p>Keep your reservation reference handy for your journey.</p></div><span className="entry-step-arrow" aria-hidden="true">↗</span></article>
        </div>
      </section>

      <section className="entry-routes" id="routes">
        <div className="entry-routes-heading"><div><span className="entry-eyebrow">A FEW PLACES TO START</span><h2>Rwanda, route by route.</h2></div><a href="#top">Plan a journey <span aria-hidden="true">↑</span></a></div>
        <div className="entry-route-list">
          {routes.map((route, index) => {
            const [from, to] = route.name.split(' — ')
            return <button className="entry-route-item" key={route.name} type="button" onClick={() => { setSearch({ ...search, from, to }); window.location.hash = 'top' }}><span className="entry-route-index">0{index + 1}</span><strong>{from} <span aria-hidden="true">→</span> {to}</strong><span>{route.duration}</span><span>{route.fare}</span><span className="entry-route-arrow" aria-hidden="true">↗</span></button>
          })}
        </div>
      </section>

      <footer className="entry-footer"><a className="entry-brand entry-brand-dark" href="#top"><span className="entry-brand-mark">R</span><span>ruta<small>MOVE WITH EASE</small></span></a><span>© 2026 Ruta Mobility · Kigali, Rwanda</span><Link to="/dashboard">Operations portal <span aria-hidden="true">↗</span></Link></footer>

      {(selectedTrip || confirmation) && (
        <div className="entry-dialog-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) closeDialog() }}>
          <section className="entry-dialog" role="dialog" aria-modal="true" aria-labelledby="booking-dialog-title">
            <button className="entry-dialog-close" type="button" aria-label="Close" onClick={closeDialog}>×</button>
            {confirmation ? (
              <div className="entry-confirmation">
                <span className="entry-confirmation-mark" aria-hidden="true">✓</span>
                <span className="entry-eyebrow">DEMO RESERVATION CREATED</span>
                <h2 id="booking-dialog-title">Your trip is on the list.</h2>
                <p>Reservation reference <strong>{confirmation.reference}</strong></p>
                <div className="entry-confirmation-details"><span>{confirmation.trip.from} → {confirmation.trip.to}</span><span>{formatDate(confirmation.trip.date)} · {confirmation.trip.time}</span><span>{confirmation.passenger} · {confirmation.passengers} {confirmation.passengers === 1 ? 'passenger' : 'passengers'}</span><strong>RWF {(confirmation.trip.fare * confirmation.passengers).toLocaleString()}</strong></div>
                <p className="entry-dialog-note">Demo only: this reservation is saved in this browser. No bus operator has received it and no payment was processed.</p>
                <button className="entry-search-submit" type="button" onClick={closeDialog}>Done</button>
              </div>
            ) : (
              <>
                <span className="entry-eyebrow">ONE LAST STEP</span>
                <h2 id="booking-dialog-title">Reserve your seat.</h2>
                <p className="entry-dialog-trip">{selectedTrip.from} → {selectedTrip.to} <span>{formatDate(selectedTrip.date)} · {selectedTrip.time}</span></p>
                <form className="entry-booking-form" onSubmit={handleBooking}>
                  <label>Passenger name<input name="passenger" type="text" autoComplete="name" placeholder="Full name" required maxLength="100" /></label>
                  <label>Phone number<input name="phone" type="tel" autoComplete="tel" placeholder="e.g. +250 7XX XXX XXX" required minLength="7" maxLength="20" /></label>
                  <div className="entry-booking-total"><span>{search.passengers} {search.passengers === '1' ? 'passenger' : 'passengers'}</span><strong>RWF {(selectedTrip.fare * Number(search.passengers)).toLocaleString()}</strong></div>
                  <button className="entry-search-submit" type="submit">Create demo reservation <span aria-hidden="true">→</span></button>
                </form>
                <p className="entry-dialog-note">This is a demo reservation stored in this browser only. Payment and live ticketing are not available yet.</p>
              </>
            )}
          </section>
        </div>
      )}
    </main>
  )
}

export default EntryPage
