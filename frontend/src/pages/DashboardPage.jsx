import { Link } from 'react-router-dom'
import ActionLink from '../components/ActionLink.jsx'
import DataTable from '../components/DataTable.jsx'
import MetricCard from '../components/MetricCard.jsx'
import PageHeader from '../components/PageHeader.jsx'
import SectionCard from '../components/SectionCard.jsx'
import { useRole } from '../context/RoleContext.jsx'
import { dashboardMetrics, trips } from '../data/demoData.js'
import { agencyDashboard } from './Agency/Dashboard.jsx'
import { driverDashboard } from './Driver/Dashboard.jsx'
import { passengerDashboard } from './Passenger/Dashboard.jsx'

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
  const roleDetails = { agency: agencyDashboard, driver: driverDashboard, passenger: passengerDashboard }
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
