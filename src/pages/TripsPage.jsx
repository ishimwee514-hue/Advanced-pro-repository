import ActionLink from '../components/ActionLink.jsx'
import DataTable from '../components/DataTable.jsx'
import PageHeader from '../components/PageHeader.jsx'
import SectionCard from '../components/SectionCard.jsx'
import { trips } from '../data/demoData.js'

const columns = [
  { key: 'id', label: 'TRIP ID' },
  { key: 'route', label: 'ROUTE' },
  { key: 'departure', label: 'DEPARTURE' },
  { key: 'vehicle', label: 'VEHICLE' },
  { key: 'passengers', label: 'PASSENGERS' },
  { key: 'status', label: 'STATUS', status: true },
]

function TripsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Operations"
        title="Trips"
        description="Schedule, monitor and manage departures across your network."
        action={<ActionLink to="/routes">＋  Schedule a trip</ActionLink>}
      />
      <div className="summary-strip">
        <div><span>Scheduled today</span><strong>248</strong></div>
        <div><span>Currently boarding</span><strong>12</strong></div>
        <div><span>Completed</span><strong>164</strong></div>
        <div><span>Needs attention</span><strong className="attention-number">3</strong></div>
      </div>
      <SectionCard title="All trips" description="A live overview of scheduled departures." action={<button className="filter-button" type="button">☷ &nbsp; Filters</button>}>
        <DataTable columns={columns} rows={trips} rowKey="id" />
      </SectionCard>
      <p className="demo-note">Showing sample trips. Trip scheduling will be connected to the Ruta API in a later step.</p>
    </>
  )
}

export default TripsPage
