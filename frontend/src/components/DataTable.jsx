import StatusBadge from './StatusBadge.jsx'

function DataTable({ columns, rows, rowKey }) {
  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>{columns.map((column) => <th key={column.key}>{column.label}</th>)}</tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row[rowKey]}>
              {columns.map((column) => (
                <td key={column.key}>
                  {column.status
                    ? <StatusBadge status={row[column.key]} />
                    : column.render
                      ? column.render(row)
                      : row[column.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {rows.length === 0 && <div className="empty-state">No records to show yet.</div>}
    </div>
  )
}

export default DataTable
