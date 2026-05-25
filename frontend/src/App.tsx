import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Layout } from './components/Layout'
import EventTypesPage from './pages/EventTypesPage'
import BookingsPage from './pages/BookingsPage'
import AvailabilityPage from './pages/AvailabilityPage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Navigate to="/event-types" replace />} />
          <Route path="/event-types" element={<EventTypesPage />} />
          <Route path="/bookings" element={<BookingsPage />} />
          <Route path="/availability" element={<AvailabilityPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
