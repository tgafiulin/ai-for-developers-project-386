import type { Request, Response } from 'express';
import { v4 as uuid } from 'uuid';
import { store } from './store.js';
import { isWithinWindow, generateSlots, hasOverlap } from './availability.js';
import type { EventType, Booking, EventTypeCreate, BookingCreate, ApiError } from './models.js';

function error(res: Response, code: number, message: string): void {
  const body: ApiError = { code, message };
  res.status(code).json(body);
}

export function listEventTypes(_req: Request, res: Response): void {
  res.json(store.listEventTypes());
}

export function getEventType(req: Request, res: Response): void {
  const et = store.getEventType(req.params.id as string);
  if (!et) {
    error(res, 404, 'Event type not found');
    return;
  }
  res.json(et);
}

export function createEventType(req: Request, res: Response): void {
  const body = req.body as EventTypeCreate;
  if (!body.title || !body.description || typeof body.durationMinutes !== 'number') {
    error(res, 400, 'Missing required fields: title, description, durationMinutes');
    return;
  }
  const eventType: EventType = {
    id: uuid(),
    title: body.title,
    description: body.description,
    durationMinutes: body.durationMinutes,
  };
  store.createEventType(eventType);
  res.status(200).json(eventType);
}

export function updateEventType(req: Request, res: Response): void {
  const existing = store.getEventType(req.params.id as string);
  if (!existing) {
    error(res, 404, 'Event type not found');
    return;
  }
  const body = req.body as EventTypeCreate;
  if (!body.title || !body.description || typeof body.durationMinutes !== 'number') {
    error(res, 400, 'Missing required fields: title, description, durationMinutes');
    return;
  }
  const updated: EventType = {
    id: existing.id,
    title: body.title,
    description: body.description,
    durationMinutes: body.durationMinutes,
  };
  store.updateEventType(req.params.id as string, updated);
  res.json(updated);
}

export function deleteEventType(req: Request, res: Response): void {
  const deleted = store.deleteEventType(req.params.id as string);
  if (!deleted) {
    error(res, 404, 'Event type not found');
    return;
  }
  res.status(204).send();
}

export function listBookings(_req: Request, res: Response): void {
  res.json(store.listBookings());
}

export function getBooking(req: Request, res: Response): void {
  const booking = store.getBooking(req.params.id as string);
  if (!booking) {
    error(res, 404, 'Booking not found');
    return;
  }
  res.json(booking);
}

export function createBooking(req: Request, res: Response): void {
  const body = req.body as BookingCreate;

  if (!body.eventTypeId || !body.guestEmail || !body.startTime || !body.endTime) {
    error(res, 400, 'Missing required fields: eventTypeId, guestEmail, startTime, endTime');
    return;
  }

  const eventType = store.getEventType(body.eventTypeId);
  if (!eventType) {
    error(res, 404, 'Event type not found');
    return;
  }

  const startTime = new Date(body.startTime);
  const endTime = new Date(body.endTime);

  if (isNaN(startTime.getTime()) || isNaN(endTime.getTime())) {
    error(res, 400, 'Invalid startTime or endTime format');
    return;
  }

  if (startTime >= endTime) {
    error(res, 400, 'startTime must be before endTime');
    return;
  }

  if (hasOverlap(startTime, endTime)) {
    error(res, 409, 'The requested time slot overlaps with an existing booking');
    return;
  }

  const booking: Booking = {
    id: uuid(),
    eventTypeId: body.eventTypeId,
    guestEmail: body.guestEmail,
    guestName: body.guestName || undefined,
    startTime: startTime.toISOString(),
    endTime: endTime.toISOString(),
  };

  store.createBooking(booking);
  res.status(200).json(booking);
}

export function getAvailableSlots(req: Request, res: Response): void {
  const { eventTypeId, date } = req.query as Record<string, string>;

  if (!eventTypeId || !date) {
    error(res, 400, 'Missing required query parameters: eventTypeId, date');
    return;
  }

  const eventType = store.getEventType(eventTypeId);
  if (!eventType) {
    error(res, 404, 'Event type not found');
    return;
  }

  const datePattern = /^\d{4}-\d{2}-\d{2}$/;
  if (!datePattern.test(date)) {
    error(res, 400, 'date must be in YYYY-MM-DD format');
    return;
  }

  if (!isWithinWindow(date)) {
    error(res, 400, 'Date is outside the 14-day booking window');
    return;
  }

  const slots = generateSlots(date, eventType.durationMinutes);
  res.json(slots);
}
