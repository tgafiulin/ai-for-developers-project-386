import "@typespec/http";
import "@typespec/rest";

using Http;
using Rest;

@service(#{ title: "Calendar Booking API" })
namespace CalendarBooking;

@doc("Event type created by the calendar owner")
model EventType {
  id: string;

  @doc("Display name of the event type")
  title: string;

  @doc("Description of what this event is about")
  description: string;

  @doc("Duration in minutes")
  durationMinutes: int32;
}

@doc("Booking created by a guest")
model Booking {
  id: string;

  @doc("Reference to the event type")
  eventTypeId: string;

  @doc("Guest email for confirmation (no auth required)")
  guestEmail: string;

  @doc("Optional guest name")
  guestName?: string;

  @doc("Booking start time in UTC")
  startTime: utcDateTime;

  @doc("Booking end time in UTC")
  endTime: utcDateTime;
}

@doc("Available time slot returned to the guest")
model AvailableSlot {
  @doc("Slot start time in UTC")
  startTime: utcDateTime;

  @doc("Slot end time in UTC")
  endTime: utcDateTime;
}

@doc("Request model for creating an event type")
model EventTypeCreate {
  title: string;
  description: string;
  durationMinutes: int32;
}

@doc("Request model for creating a booking")
model BookingCreate {
  eventTypeId: string;
  guestEmail: string;
  guestName?: string;
  startTime: utcDateTime;
  endTime: utcDateTime;
}

@error
model Error {
  code: int32;
  message: string;
}

@route("/event-types")
@tag("Event Types")
interface EventTypes {
  /** List all event types (guest view of available booking types) */
  @get list(): EventType[] | Error;

  /** Get a single event type by ID */
  @get read(@path id: string): EventType | Error;

  /** Create a new event type (owner action) */
  @post create(@body body: EventTypeCreate): EventType | Error;

  /** Update an event type (owner action) */
  @patch update(@path id: string, @body body: EventTypeCreate): EventType | Error;

  /** Delete an event type (owner action) */
  @delete delete(@path id: string): void | Error;
}

@route("/bookings")
@tag("Bookings")
interface Bookings {
  /** List all upcoming bookings across all event types (owner view) */
  @get list(): Booking[] | Error;

  /** Get a single booking by ID */
  @get read(@path id: string): Booking | Error;

  /** Create a new booking on a free slot (guest action, no auth) */
  @post create(@body body: BookingCreate): Booking | Error;
}

@route("/availability")
@tag("Availability")
interface Availability {
  /** Get available slots for a given event type on a specific date.
   *  Slots are computed within a 14-day window from today.
   *  Overlapping bookings across all event types are excluded.
   */
  @get getAvailableSlots(
    @query eventTypeId: string,

    @doc("Date to check availability for (YYYY-MM-DD)")
    @query date: plainDate,
  ): AvailableSlot[] | Error;
}
