import { useCallback, useState } from 'react'
import Sidebar from './components/Sidebar'
import Topbar from './components/Topbar'
import Dashboard from './pages/Dashboard'
import Tasks from './pages/Tasks'
import Prospects from './pages/Prospects'
import Pipeline from './pages/Pipeline'
import Payments from './pages/Payments'
import Settings from './pages/Settings'
import { useApp } from './state/AppContext'

export default function App() {
  const { state } = useApp()
  const [activePage, setActivePage] = useState('dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [invoicePrefill, setInvoicePrefill] = useState(null)

  const handleCreateInvoice = useCallback((prospect) => {
    setInvoicePrefill({ prospectId: prospect.id, client: prospect.entreprise })
    setActivePage('payments')
  }, [])

  const consumeInvoicePrefill = useCallback(() => setInvoicePrefill(null), [])

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
          activePage={activePage}
          onOpenSidebar={() => setSidebarOpen(true)}
          userName={state.settings.userName}
        />
        {activePage === 'dashboard' && <Dashboard onNavigate={setActivePage} />}
        {activePage === 'tasks' && <Tasks />}
        {activePage === 'prospects' && <Prospects onCreateInvoice={handleCreateInvoice} />}
        {activePage === 'pipeline' && <Pipeline />}
        {activePage === 'payments' && (
          <Payments invoicePrefill={invoicePrefill} onPrefillConsumed={consumeInvoicePrefill} />
        )}
        {activePage === 'settings' && <Settings />}
      </div>
    </div>
  )
}
