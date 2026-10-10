import ActionLink from '../components/ActionLink.jsx'
import DataTable from '../components/DataTable.jsx'
import PageHeader from '../components/PageHeader.jsx'
import SectionCard from '../components/SectionCard.jsx'
import { vehicles } from '../data/demoData.js'

const columns = [
  { key: 'plate', label: 'VEHICLE' },
  { key: 'model', label: 'MODEL' },
  { key: 'capacity', label: 'CAPACITY' },
  { key: 'driver', label: 'ASSIGNED DRIVER' },
  { key: 'status', label: 'STATUS', status: true },
]

function FleetPage() {
  return (
    <>
      <PageHeader
        eyebrow="Vehicle management"
        title="Fleet"
        description="Keep track of your vehicles, assignments and service readiness."
        action={<ActionLink to="/trips">＋  Add vehicle</ActionLink>}
      />
      <div className="summary-strip">
        <div><span>Total vehicles</span><strong>42</strong></div>
        <div><span>On route</span><strong>28</strong></div>
        <div><span>Available</span><strong>10</strong></div>
        <div><span>In maintenance</span><strong className="attention-number">4</strong></div>
      </div>
      <SectionCard title="Vehicle directory" description="Vehicle details and today's assignments." action={<button className="filter-button" type="button">☷ &nbsp; Filters</button>}>
        <DataTable columns={columns} rows={vehicles} rowKey="plate" />
      </SectionCard>
      <p className="demo-note">Vehicle locations, assignments and service status are sample data.</p>
    </>
  )
}

export default FleetPage
