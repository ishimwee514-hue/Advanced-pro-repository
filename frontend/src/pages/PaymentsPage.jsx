import DataTable from '../components/DataTable.jsx'
import PageHeader from '../components/PageHeader.jsx'
import SectionCard from '../components/SectionCard.jsx'
import { payments } from '../data/demoData.js'

const columns = [
  { key: 'id', label: 'TRANSACTION' },
  { key: 'customer', label: 'CUSTOMER' },
  { key: 'method', label: 'METHOD' },
  { key: 'date', label: 'DATE' },
  { key: 'amount', label: 'AMOUNT' },
  { key: 'status', label: 'STATUS', status: true },
]

function PaymentsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Finance"
        title="Payments"
        description="Review payment activity and settlement performance."
        action={<button className="action-button secondary" type="button">↓ &nbsp; Export report</button>}
      />
      <div className="summary-strip">
        <div><span>Collected today</span><strong>RWF 4.82M</strong></div>
        <div><span>Successful</span><strong>1,792</strong></div>
        <div><span>Pending</span><strong>38</strong></div>
        <div><span>Refunded</span><strong>RWF 124K</strong></div>
      </div>
      <SectionCard title="Recent transactions" description="Payments processed through available mobile money channels." action={<button className="filter-button" type="button">☷ &nbsp; Filters</button>}>
        <DataTable columns={columns} rows={payments} rowKey="id" />
      </SectionCard>
      <div className="notice-card"><span aria-hidden="true">ⓘ</span><p><strong>Payment providers are not connected.</strong> These sample transactions are for layout preview only. No money can be collected or transferred from this page.</p></div>
    </>
  )
}

export default PaymentsPage
