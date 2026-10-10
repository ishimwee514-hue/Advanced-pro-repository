function RoleSelector({ id, label, value, onChange, options, className = '' }) {
  const roleOptions = options ?? [
    { value: 'agency', label: 'Agency' },
    { value: 'driver', label: 'Driver' },
    { value: 'passenger', label: 'Passenger' },
  ]
  const selectId = id ?? 'demo-role'

  return (
    <label className={className} htmlFor={selectId}>
      {label && <span>{label}</span>}
      <select id={selectId} value={value} onChange={(event) => onChange(event.target.value)}>
        {roleOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
      </select>
    </label>
  )
}

export default RoleSelector
