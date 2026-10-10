import { getStatusTone } from '../utils/statusTone.js'

function StatusBadge({ status }) {
  return <span className={`status-badge ${getStatusTone(status)}`}>{status}</span>
}

export default StatusBadge
