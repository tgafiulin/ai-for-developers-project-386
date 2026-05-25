import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { api } from '@/lib/api'
import type { components } from '@/lib/types'

type EventType = components['schemas']['EventType']
type AvailableSlot = components['schemas']['AvailableSlot']

export default function AvailabilityPage() {
  const [eventTypes, setEventTypes] = useState<EventType[]>([])
  const [eventTypeId, setEventTypeId] = useState('')
  const [date, setDate] = useState('')
  const [slots, setSlots] = useState<AvailableSlot[] | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    api<EventType[]>('/event-types').then(setEventTypes)
  }, [])

  async function handleSearch() {
    if (!eventTypeId || !date) return
    setLoading(true)
    try {
      const data = await api<AvailableSlot[]>(
        `/availability?eventTypeId=${encodeURIComponent(eventTypeId)}&date=${encodeURIComponent(date)}`
      )
      setSlots(data)
    } catch (err) {
      toast(err instanceof Error ? err.message : 'Failed to check availability')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Availability</h2>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Check Available Slots</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-end gap-4">
            <div className="space-y-2">
              <Label>Event Type</Label>
              <Select value={eventTypeId} onValueChange={setEventTypeId}>
                <SelectTrigger className="w-56">
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
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
            <Button onClick={handleSearch} disabled={loading}>
              {loading ? 'Loading...' : 'Search'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {slots !== null && (
        <Card>
          <CardHeader>
            <CardTitle>
              {slots.length === 0
                ? 'No available slots'
                : `${slots.length} slot${slots.length > 1 ? 's' : ''} available`}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-3">
              {slots.map((slot, i) => (
                <div
                  key={i}
                  className="rounded-lg border p-3 text-center text-sm"
                >
                  <div className="font-medium">
                    {new Date(slot.startTime).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </div>
                  <div className="text-muted-foreground">→</div>
                  <div>
                    {new Date(slot.endTime).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
