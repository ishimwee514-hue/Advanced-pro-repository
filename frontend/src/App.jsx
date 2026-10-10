import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { RoleProvider } from './context/RoleContext.jsx'
import AppLayout from './components/AppLayout.jsx'
import DashboardPage from './pages/DashboardPage.jsx'
import FleetPage from './pages/FleetPage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import NotFoundPage from './pages/NotFoundPage.jsx'
import PaymentsPage from './pages/PaymentsPage.jsx'
import RoutesPage from './pages/RoutesPage.jsx'
import TicketsPage from './pages/TicketsPage.jsx'
import TripsPage from './pages/TripsPage.jsx'
import './styles/app.css'

function App() {
  return (
    <BrowserRouter>
      <RoleProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route element={<AppLayout />}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/trips" element={<TripsPage />} />
            <Route path="/routes" element={<RoutesPage />} />
            <Route path="/fleet" element={<FleetPage />} />
            <Route path="/tickets" element={<TicketsPage />} />
            <Route path="/payments" element={<PaymentsPage />} />
          </Route>
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </RoleProvider>
    </BrowserRouter>
  )
}

export default App
