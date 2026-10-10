import { Link } from 'react-router-dom'
import ActionLink from '../components/ActionLink.jsx'
import DataTable from '../components/DataTable.jsx'
import MetricCard from '../components/MetricCard.jsx'
import PageHeader from '../components/PageHeader.jsx'
import SectionCard from '../components/SectionCard.jsx'
import StatusBadge from '../components/StatusBadge.jsx'
import { useRole } from '../context/RoleContext.jsx'
import { dashboardMetrics, trips } from '../data/demoData.js'

const roleDetails = {
  agency: {
    eyebrow: 'Saturday, 10 October 2026',
    title: 'Good morning, Alex',
    description: 'Here is what is happening across your transport network today.',
    tableTitle: 'Live trips',
    tableDescription: 'Keep an eye on today’s departures and passenger capacity.',
  },
  driver: {
    eyebrow: 'Saturday, 10 October 2026',
    title: 'Ready for the road?',
    description: 'Your daily route plan and vehicle status, all in one place.',
    tableTitle: 'Your trips today',
    tableDescription: 'A quick look at your upcoming and completed trips.',
  },
  passenger: {
    eyebrow: 'Your travel overview',
    title: 'Welcome back, Aline',
    description: 'Plan your next journey and keep your tickets close at hand.',
    tableTitle: 'Your upcoming trips',
    tableDescription: 'Your latest bookings and departure details.',
  },
}

const tripColumns = [
  { key: 'id', label: 'TRIP ID' },
  { key: 'route', label: 'ROUTE' },
  { key: 'departure', label: 'DEPARTURE' },
  { key: 'vehicle', label: 'VEHICLE' },
  { key: 'passengers', label: 'CAPACITY' },
  { key: 'status', label: 'STATUS', status: true },
]

function DashboardPage() {
  const { role } = useRole()
  const details = roleDetails[role]
  const visibleTrips = role === 'passenger' ? trips.slice(0, 2) : role === 'driver' ? trips.slice(0, 3) : trips

  return (
    <>
      <PageHeader
        eyebrow={details.eyebrow}
        title={details.title}
        description={details.description}
        action={<ActionLink to={role === 'passenger' ? '/routes' : '/trips'}>{role === 'passenger' ? 'Find a trip' : '＋  Schedule a trip'}</ActionLink>}
      />

      <div className="metric-grid">
        {dashboardMetrics[role].map((metric) => <MetricCard key={metric.label} {...metric} />)}
      </div>

      <div className="dashboard-grid">
        <SectionCard
          title={details.tableTitle}
          description={details.tableDescription}
          action={<Link className="text-link" to="/trips">View all <span aria-hidden="true">→</span></Link>}
          className="trip-section"
        >
          <DataTable columns={tripColumns} rows={visibleTrips} rowKey="id" />
        </SectionCard>

        <SectionCard title="Network status" description="Your operation at a glance." className="network-section">
          <div className="network-status">
            <span className="network-pulse" />
            <div><strong>All systems operational</strong><span>Updated just now</span></div>
          </div>
          <div className="network-item"><span>Routes running</span><strong>12 <small>/ 14</small></strong></div>
          <div className="network-item"><span>Vehicles in service</span><strong>38 <small>/ 42</small></strong></div>
          <div className="network-item"><span>Average on-time</span><strong>96.4%</strong></div>
          <Link className="network-link" to="/routes">View route status <span aria-hidden="true">→</span></Link>
        </SectionCard>
      </div>

      <section className="banner-card">
        <div className="banner-art" aria-hidden="true"><span>R</span><i>↗</i></div>
        <div className="banner-copy">
          <span className="banner-kicker">MOVE SMARTER WITH RUTA</span>
          <h2>Every journey starts with a better connection.</h2>
          <p>Manage your routes, vehicles and passengers from one simple workspace.</p>
        </div>
        <Link className="banner-link" to="/routes">Explore routes <span aria-hidden="true">→</span></Link>
      </section>
      <p className="demo-note">Sample workspace data for preview only. Live trips, payments and vehicle locations are not connected yet.</p>
    </>
  )
}

export default DashboardPage
