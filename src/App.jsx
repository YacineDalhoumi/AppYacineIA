import { useState } from 'react'
import Sidebar from './components/Sidebar'
import Topbar from './components/Topbar'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Today from './pages/Today'
import CallSession from './pages/CallSession'
import Prospects from './pages/Prospects'
import Pipeline from './pages/Pipeline'
import ProspectDetail from './pages/ProspectDetail'
import Settings from './pages/Settings'
import { useAuth } from './state/AuthContext'
import { useSettings } from './hooks/useSettings'

export default function App() {
  const { loading, isAuthenticated } = useAuth()
  const { settings } = useSettings()

  const [activePage, setActivePage] = useState('dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [selectedProspectId, setSelectedProspectId] = useState(null)
  const [detailOrigin, setDetailOrigin] = useState('prospects')

  function openProspect(id) {
    setDetailOrigin(activePage)
    setSelectedProspectId(id)
    setActivePage('prospectDetail')
  }

  function closeProspectDetail() {
    setActivePage(detailOrigin)
    setSelectedProspectId(null)
  }

  if (loading) {
    return <div className="auth-loading">Chargement...</div>
  }

  if (!isAuthenticated) {
    return <Login />
  }

  return (
    <div className="app-shell">
      <Sidebar
        activePage={activePage}
        onNavigate={setActivePage}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      <div className="app-main">
        <Topbar
          activePage={activePage === 'prospectDetail' ? detailOrigin : activePage}
          onOpenSidebar={() => setSidebarOpen(true)}
          userName={settings.userName}
        />
        {activePage === 'dashboard' && <Dashboard />}
        {activePage === 'today' && <Today onOpenProspect={openProspect} />}
        {activePage === 'callSession' && <CallSession onOpenProspect={openProspect} />}
        {activePage === 'prospects' && <Prospects onOpenProspect={openProspect} />}
        {activePage === 'pipeline' && <Pipeline onOpenProspect={openProspect} />}
        {activePage === 'prospectDetail' && (
          <ProspectDetail prospectId={selectedProspectId} onBack={closeProspectDetail} onDeleted={closeProspectDetail} />
        )}
        {activePage === 'settings' && <Settings />}
      </div>
    </div>
  )
}
