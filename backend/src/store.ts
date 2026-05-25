import type { EventType, Booking } from './models.js';

class Store {
  private eventTypes = new Map<string, EventType>();
  private bookings = new Map<string, Booking>();

  listEventTypes(): EventType[] {
    return Array.from(this.eventTypes.values());
  }

  getEventType(id: string): EventType | undefined {
    return this.eventTypes.get(id);
  }

  createEventType(data: EventType): EventType {
    this.eventTypes.set(data.id, data);
    return data;
  }

  updateEventType(id: string, data: EventType): EventType | undefined {
    if (!this.eventTypes.has(id)) return undefined;
    this.eventTypes.set(id, data);
    return data;
  }

  deleteEventType(id: string): boolean {
    return this.eventTypes.delete(id);
  }

  listBookings(): Booking[] {
    return Array.from(this.bookings.values());
  }

  getBooking(id: string): Booking | undefined {
    return this.bookings.get(id);
  }

  createBooking(data: Booking): Booking {
    this.bookings.set(data.id, data);
    return data;
  }
}

export const store = new Store();
