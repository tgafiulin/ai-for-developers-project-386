import path from 'path';
import { fileURLToPath } from 'url';
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

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const publicDir = path.resolve(__dirname, '..', 'public');

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

app.use(express.static(publicDir));
app.use((req, res, next) => {
  if (req.method === 'GET' || req.method === 'HEAD') {
    res.sendFile(path.join(publicDir, 'index.html'), (err) => {
      if (err) next();
    });
    return;
  }
  next();
});

const server = app.listen(PORT, () => {
  console.log(`Calendar Booking API running on http://localhost:${PORT}`);
});
