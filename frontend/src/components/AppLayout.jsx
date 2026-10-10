import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar.jsx'
import Topbar from './Topbar.jsx'

function AppLayout() {
  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-column">
        <Topbar />
        <main className="page-content">
          <Outlet />
          <footer className="page-footer">
            <span>© 2026 Ruta Mobility</span>
            <span>Demo workspace · Kigali, Rwanda</span>
          </footer>
        </main>
      </div>
    </div>
  )
}

export default AppLayout
