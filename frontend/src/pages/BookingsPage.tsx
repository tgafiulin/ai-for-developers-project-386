import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { api } from '@/lib/api'
import type { components } from '@/lib/types'

type Booking = components['schemas']['Booking']
type BookingCreate = components['schemas']['BookingCreate']
type EventType = components['schemas']['EventType']

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [eventTypes, setEventTypes] = useState<EventType[]>([])
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState<BookingCreate>({
    eventTypeId: '',
    guestEmail: '',
    guestName: '',
    startTime: '',
    endTime: '',
  })

  useEffect(() => {
    api<Booking[]>('/bookings').then(setBookings)
    api<EventType[]>('/event-types').then(setEventTypes)
  }, [])

  async function handleSubmit() {
    try {
      const created = await api<Booking>('/bookings', {
        method: 'POST',
        body: JSON.stringify(form),
      })
      setBookings((prev) => [...prev, created])
      setForm({ eventTypeId: '', guestEmail: '', guestName: '', startTime: '', endTime: '' })
      setOpen(false)
      toast('Booking created')
    } catch (err) {
      toast(err instanceof Error ? err.message : 'Failed to create booking')
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">Bookings</h2>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>Create Booking</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Booking</DialogTitle>
            </DialogHeader>
            <form
              onSubmit={(e) => { e.preventDefault(); handleSubmit() }}
              className="space-y-4"
            >
              <div className="space-y-2">
                <Label>Event Type</Label>
                <Select
                  value={form.eventTypeId}
                  onValueChange={(v) => setForm({ ...form, eventTypeId: v })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select event type" />
                  </SelectTrigger>
                  <SelectContent>
                    {eventTypes.map((et) => (
                      <SelectItem key={et.id} value={et.id}>
                        {et.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Guest Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={form.guestEmail}
                  onChange={(e) => setForm({ ...form, guestEmail: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="name">Guest Name (optional)</Label>
                <Input
                  id="name"
                  value={form.guestName}
                  onChange={(e) => setForm({ ...form, guestName: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="start">Start Time</Label>
                <Input
                  id="start"
                  type="datetime-local"
                  value={form.startTime}
                  onChange={(e) => setForm({ ...form, startTime: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="end">End Time</Label>
                <Input
                  id="end"
                  type="datetime-local"
                  value={form.endTime}
                  onChange={(e) => setForm({ ...form, endTime: e.target.value })}
                  required
                />
              </div>
              <Button type="submit">Create</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Event Type</TableHead>
            <TableHead>Guest Email</TableHead>
            <TableHead>Guest Name</TableHead>
            <TableHead>Start Time</TableHead>
            <TableHead>End Time</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {bookings.map((b) => {
            const et = eventTypes.find((e) => e.id === b.eventTypeId)
            return (
              <TableRow key={b.id}>
                <TableCell>{et?.title ?? b.eventTypeId}</TableCell>
                <TableCell>{b.guestEmail}</TableCell>
                <TableCell>{b.guestName ?? '—'}</TableCell>
                <TableCell>{new Date(b.startTime).toLocaleString()}</TableCell>
                <TableCell>{new Date(b.endTime).toLocaleString()}</TableCell>
              </TableRow>
            )
          })}
          {bookings.length === 0 && (
            <TableRow>
              <TableCell colSpan={5} className="text-center text-muted-foreground">
                No bookings yet
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}
