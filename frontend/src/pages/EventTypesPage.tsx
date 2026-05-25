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
import { api } from '@/lib/api'
import type { components } from '@/lib/types'

type EventType = components['schemas']['EventType']
type EventTypeCreate = components['schemas']['EventTypeCreate']

const emptyForm = { title: '', description: '', durationMinutes: 30 }

export default function EventTypesPage() {
  const [eventTypes, setEventTypes] = useState<EventType[]>([])
  const [open, setOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<EventTypeCreate>(emptyForm)

  useEffect(() => {
    api<EventType[]>('/event-types').then(setEventTypes)
  }, [])

  function resetForm() {
    setForm(emptyForm)
    setEditingId(null)
  }

  async function handleSubmit() {
    try {
      if (editingId) {
        const updated = await api<EventType>(`/event-types/${editingId}`, {
          method: 'PATCH',
          body: JSON.stringify(form),
        })
        setEventTypes((prev) => prev.map((e) => (e.id === editingId ? updated : e)))
        toast('Event type updated')
      } else {
        const created = await api<EventType>('/event-types', {
          method: 'POST',
          body: JSON.stringify(form),
        })
        setEventTypes((prev) => [...prev, created])
        toast('Event type created')
      }
      resetForm()
      setOpen(false)
    } catch (err) {
      toast(err instanceof Error ? err.message : 'Failed to save event type')
    }
  }

  function handleEdit(et: EventType) {
    setForm({
      title: et.title,
      description: et.description,
      durationMinutes: et.durationMinutes,
    })
    setEditingId(et.id)
    setOpen(true)
  }

  async function handleDelete(id: string) {
    await api(`/event-types/${id}`, { method: 'DELETE' })
    setEventTypes((prev) => prev.filter((e) => e.id !== id))
    toast('Event type deleted')
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">Event Types</h2>
        <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) resetForm() }}>
          <DialogTrigger asChild>
            <Button>Create Event Type</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingId ? 'Edit' : 'Create'} Event Type</DialogTitle>
            </DialogHeader>
            <form
              onSubmit={(e) => { e.preventDefault(); handleSubmit() }}
              className="space-y-4"
            >
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="duration">Duration (minutes)</Label>
                <Input
                  id="duration"
                  type="number"
                  min={5}
                  value={form.durationMinutes}
                  onChange={(e) => setForm({ ...form, durationMinutes: Number(e.target.value) })}
                  required
                />
              </div>
              <Button type="submit">{editingId ? 'Save' : 'Create'}</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Duration</TableHead>
            <TableHead className="w-32">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {eventTypes.map((et) => (
            <TableRow key={et.id}>
              <TableCell className="font-medium">{et.title}</TableCell>
              <TableCell>{et.description}</TableCell>
              <TableCell>{et.durationMinutes} min</TableCell>
              <TableCell className="space-x-1">
                <Button variant="outline" size="sm" onClick={() => handleEdit(et)}>
                  Edit
                </Button>
                <Button variant="destructive" size="sm" onClick={() => handleDelete(et.id)}>
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
          {eventTypes.length === 0 && (
            <TableRow>
              <TableCell colSpan={4} className="text-center text-muted-foreground">
                No event types yet
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}
