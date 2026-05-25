export interface EventType {
  id: string;
  title: string;
  description: string;
  durationMinutes: number;
}

export interface Booking {
  id: string;
  eventTypeId: string;
  guestEmail: string;
  guestName?: string;
  startTime: string;
  endTime: string;
}

export interface AvailableSlot {
  startTime: string;
  endTime: string;
}

export interface EventTypeCreate {
  title: string;
  description: string;
  durationMinutes: number;
}

export interface BookingCreate {
  eventTypeId: string;
  guestEmail: string;
  guestName?: string;
  startTime: string;
  endTime: string;
}

export interface ApiError {
  code: number;
  message: string;
}
