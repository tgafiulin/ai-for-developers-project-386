import express from 'express';
import cors from 'cors';
import {
  listEventTypes,
  getEventType,
  createEventType,
  updateEventType,
  deleteEventType,
  listBookings,
  getBooking,
  createBooking,
  getAvailableSlots,
} from './handlers.js';

const app = express();
const PORT = parseInt(process.env.PORT || '3001', 10);

app.use(cors({ origin: true }));
app.use(express.json());

app.get('/event-types', listEventTypes);
app.get('/event-types/:id', getEventType);
app.post('/event-types', createEventType);
app.patch('/event-types/:id', updateEventType);
app.delete('/event-types/:id', deleteEventType);

app.get('/bookings', listBookings);
app.get('/bookings/:id', getBooking);
app.post('/bookings', createBooking);

app.get('/availability', getAvailableSlots);

const server = app.listen(PORT, () => {
  console.log(`Calendar Booking API running on http://localhost:${PORT}`);
});
