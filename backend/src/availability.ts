import type { AvailableSlot } from './models.js';
import { store } from './store.js';

const WORK_START_HOUR = 9;
const WORK_END_HOUR = 17;

export function isWithinWindow(dateStr: string): boolean {
  const date = new Date(dateStr + 'T00:00:00Z');
  const now = new Date();
  const today = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
  const diffDays = (date.getTime() - today.getTime()) / (1000 * 60 * 60 * 24);
  return diffDays >= 0 && diffDays <= 13;
}

export function bookingsOverlap(
  startA: Date,
  endA: Date,
  startB: Date,
  endB: Date
): boolean {
  return startA < endB && startB < endA;
}

export function hasOverlap(startTime: Date, endTime: Date): boolean {
  const bookings = store.listBookings();
  return bookings.some((b) => {
    const bStart = new Date(b.startTime);
    const bEnd = new Date(b.endTime);
    return bookingsOverlap(startTime, endTime, bStart, bEnd);
  });
}

export function generateSlots(
  dateStr: string,
  durationMinutes: number
): AvailableSlot[] {
  const slots: AvailableSlot[] = [];
  const dayStart = new Date(dateStr + 'T00:00:00Z');
  const dayEnd = new Date(dateStr + 'T23:59:59Z');

  let slotStart = new Date(
    Date.UTC(
      dayStart.getUTCFullYear(),
      dayStart.getUTCMonth(),
      dayStart.getUTCDate(),
      WORK_START_HOUR,
      0,
      0
    )
  );
  const workEnd = new Date(
    Date.UTC(
      dayStart.getUTCFullYear(),
      dayStart.getUTCMonth(),
      dayStart.getUTCDate(),
      WORK_END_HOUR,
      0,
      0
    )
  );

  while (slotStart.getTime() + durationMinutes * 60 * 1000 <= workEnd.getTime()) {
    const slotEnd = new Date(slotStart.getTime() + durationMinutes * 60 * 1000);

    if (slotEnd > dayEnd) break;

    if (!hasOverlap(slotStart, slotEnd)) {
      slots.push({
        startTime: slotStart.toISOString(),
        endTime: slotEnd.toISOString(),
      });
    }

    slotStart = slotEnd;
  }

  return slots;
}
