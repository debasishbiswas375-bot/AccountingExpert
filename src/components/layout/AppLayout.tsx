import { Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar'

export function AppLayout() {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <main className="ml-[260px] min-h-screen transition-all duration-300">
        <div className="p-8">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
