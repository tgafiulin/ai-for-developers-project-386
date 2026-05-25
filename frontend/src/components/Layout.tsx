import { NavLink, Outlet } from 'react-router-dom'
import { Toaster } from '@/components/ui/sonner'

const navItems = [
  { to: '/event-types', label: 'Event Types' },
  { to: '/bookings', label: 'Bookings' },
  { to: '/availability', label: 'Availability' },
]

export function Layout() {
  return (
    <div className="flex h-svh">
      <nav className="w-56 shrink-0 border-r bg-muted p-4 space-y-2">
        <h1 className="text-lg font-semibold mb-6">Calendar Booking</h1>
        {navItems.map(({ to, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `block rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'hover:bg-accent hover:text-accent-foreground'
              }`
            }
          >
            {label}
          </NavLink>
        ))}
      </nav>
      <main className="flex-1 overflow-auto p-6">
        <Outlet />
      </main>
      <Toaster />
    </div>
  )
}
