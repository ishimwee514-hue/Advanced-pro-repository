import ActionLink from '../components/ActionLink.jsx'
import DataTable from '../components/DataTable.jsx'
import PageHeader from '../components/PageHeader.jsx'
import SectionCard from '../components/SectionCard.jsx'
import { routes } from '../data/demoData.js'

const columns = [
  { key: 'name', label: 'ROUTE' },
  { key: 'distance', label: 'DISTANCE' },
  { key: 'duration', label: 'DURATION' },
  { key: 'fare', label: 'BASE FARE' },
  { key: 'trips', label: 'DAILY TRIPS' },
  { key: 'status', label: 'STATUS', status: true },
]

function RoutesPage() {
  return (
    <>
      <PageHeader
        eyebrow="Network planning"
        title="Routes"
        description="Manage the corridors connecting passengers across Rwanda."
        action={<ActionLink to="/trips">＋  Add a route</ActionLink>}
      />
      <div className="route-highlight">
        <div className="route-highlight-icon" aria-hidden="true">⌁</div>
        <div><span>YOUR NETWORK</span><strong>14 active routes</strong><small>Connecting Kigali to 9 destinations</small></div>
        <div className="route-map-line" aria-hidden="true"><i /><i /><i /><i /><i /></div>
      </div>
      <SectionCard title="All routes" description="Route details, fares and current availability." action={<button className="filter-button" type="button">☷ &nbsp; Filters</button>}>
        <DataTable columns={columns} rows={routes} rowKey="name" />
      </SectionCard>
      <p className="demo-note">Route information and fares shown are illustrative sample data.</p>
    </>
  )
}

export default RoutesPage
