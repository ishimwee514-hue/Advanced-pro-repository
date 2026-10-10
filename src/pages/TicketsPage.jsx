import ActionLink from '../components/ActionLink.jsx'
import DataTable from '../components/DataTable.jsx'
import PageHeader from '../components/PageHeader.jsx'
import SectionCard from '../components/SectionCard.jsx'
import { tickets } from '../data/demoData.js'

const columns = [
  { key: 'id', label: 'TICKET ID' },
  { key: 'passenger', label: 'PASSENGER' },
  { key: 'route', label: 'ROUTE' },
  { key: 'seat', label: 'SEAT' },
  { key: 'amount', label: 'FARE' },
  { key: 'status', label: 'STATUS', status: true },
]

function TicketsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Passenger bookings"
        title="Tickets"
        description="Review passenger reservations and ticket status."
        action={<ActionLink to="/trips">View trips</ActionLink>}
      />
      <div className="summary-strip">
        <div><span>Tickets today</span><strong>1,846</strong></div>
        <div><span>Confirmed</span><strong>1,792</strong></div>
        <div><span>Pending</span><strong>38</strong></div>
        <div><span>Cancelled</span><strong>16</strong></div>
      </div>
      <SectionCard title="Recent tickets" description="Latest bookings across your routes." action={<button className="filter-button" type="button">☷ &nbsp; Filters</button>}>
        <DataTable columns={columns} rows={tickets} rowKey="id" />
      </SectionCard>
      <p className="demo-note">Sample ticket records only. Digital ticket generation will be added with the booking flow.</p>
    </>
  )
}

export default TicketsPage
