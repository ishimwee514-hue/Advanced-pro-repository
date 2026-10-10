export const dashboardMetrics = {
  agency: [
    { label: 'Trips today', value: '248', change: '+12.8%', icon: '↗', tone: 'blue' },
    { label: 'Passengers', value: '1,846', change: '+8.2%', icon: '◉', tone: 'violet' },
    { label: 'Revenue today', value: 'RWF 4.82M', change: '+6.4%', icon: '₣', tone: 'green' },
    { label: 'Active vehicles', value: '38 / 42', change: '90% active', icon: '▰', tone: 'orange' },
  ],
  driver: [
    { label: 'My trips today', value: '6', change: '2 completed', icon: '↗', tone: 'blue' },
    { label: 'Passengers today', value: '84', change: '+9 this trip', icon: '◉', tone: 'violet' },
    { label: 'Earnings today', value: 'RWF 48,500', change: '+4.2%', icon: '₣', tone: 'green' },
    { label: 'Vehicle status', value: 'Ready', change: 'RAB 482 C', icon: '▰', tone: 'orange' },
  ],
  passenger: [
    { label: 'Upcoming trips', value: '2', change: 'Next at 10:30', icon: '↗', tone: 'blue' },
    { label: 'Trips this month', value: '12', change: '+3 this week', icon: '◉', tone: 'violet' },
    { label: 'Wallet balance', value: 'RWF 18,500', change: 'Available', icon: '₣', tone: 'green' },
    { label: 'Saved routes', value: '4', change: 'Kigali & beyond', icon: '▰', tone: 'orange' },
  ],
}

export const trips = [
  { id: 'TR-2048', route: 'Kigali → Musanze', departure: '09:30 AM', vehicle: 'RAB 482 C', passengers: '32 / 40', status: 'On time' },
  { id: 'TR-2047', route: 'Kigali → Huye', departure: '09:00 AM', vehicle: 'RAC 917 B', passengers: '38 / 40', status: 'Boarding' },
  { id: 'TR-2046', route: 'Kigali → Rubavu', departure: '08:45 AM', vehicle: 'RAD 136 A', passengers: '28 / 36', status: 'Delayed' },
  { id: 'TR-2045', route: 'Kigali → Nyagatare', departure: '08:15 AM', vehicle: 'RAE 562 C', passengers: '35 / 40', status: 'Departed' },
]

export const routes = [
  { name: 'Kigali — Musanze', distance: '106 km', duration: '2h 30m', fare: 'RWF 2,500', trips: '18 daily', status: 'Active' },
  { name: 'Kigali — Huye', distance: '133 km', duration: '2h 45m', fare: 'RWF 3,000', trips: '14 daily', status: 'Active' },
  { name: 'Kigali — Rubavu', distance: '157 km', duration: '3h 20m', fare: 'RWF 3,500', trips: '12 daily', status: 'Active' },
  { name: 'Kigali — Nyagatare', distance: '162 km', duration: '3h 10m', fare: 'RWF 3,000', trips: '8 daily', status: 'Review' },
]

export const vehicles = [
  { plate: 'RAB 482 C', model: 'Toyota Coaster', capacity: '40 seats', driver: 'Jean Claude M.', status: 'On route' },
  { plate: 'RAC 917 B', model: 'Yutong ZK6122', capacity: '40 seats', driver: 'Eric Niyonzima', status: 'Boarding' },
  { plate: 'RAD 136 A', model: 'Toyota Coaster', capacity: '36 seats', driver: 'Patrick H.', status: 'On route' },
  { plate: 'RAE 562 C', model: 'King Long XMQ', capacity: '40 seats', driver: 'Emmanuel K.', status: 'Maintenance' },
]

export const tickets = [
  { id: 'RT-98241', passenger: 'Aline Mukamana', route: 'Kigali → Musanze', seat: '12A', amount: 'RWF 2,500', status: 'Confirmed' },
  { id: 'RT-98240', passenger: 'David Nkurunziza', route: 'Kigali → Huye', seat: '08B', amount: 'RWF 3,000', status: 'Confirmed' },
  { id: 'RT-98239', passenger: 'Claudine U.', route: 'Kigali → Rubavu', seat: '16A', amount: 'RWF 3,500', status: 'Pending' },
  { id: 'RT-98238', passenger: 'Samuel Habimana', route: 'Kigali → Musanze', seat: '04C', amount: 'RWF 2,500', status: 'Cancelled' },
]

export const payments = [
  { id: 'PAY-77102', customer: 'Aline Mukamana', method: 'MTN MoMo', date: 'Today, 09:12', amount: 'RWF 2,500', status: 'Successful' },
  { id: 'PAY-77101', customer: 'David Nkurunziza', method: 'Airtel Money', date: 'Today, 08:54', amount: 'RWF 3,000', status: 'Successful' },
  { id: 'PAY-77100', customer: 'Claudine U.', method: 'MTN MoMo', date: 'Today, 08:42', amount: 'RWF 3,500', status: 'Pending' },
  { id: 'PAY-77099', customer: 'Samuel Habimana', method: 'MTN MoMo', date: 'Today, 08:30', amount: 'RWF 2,500', status: 'Refunded' },
]
