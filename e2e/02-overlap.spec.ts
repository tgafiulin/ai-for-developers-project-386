import { test, expect } from '@playwright/test'
import {
  uniqueDay, toLocalInput,
  navigateTo, openDialog, fillInput, selectTrigger, pickLastOption, submitForm,
  seedEventType, seedBooking,
} from './helpers'

test('overlapping booking shows conflict error', async ({ page }) => {
  const date = uniqueDay()

  const et = await seedEventType('Consulting', 60)

  await seedBooking(
    et.id,
    new Date(`${date}T09:00:00Z`).toISOString(),
    new Date(`${date}T10:00:00Z`).toISOString(),
  )

  await navigateTo(page, '/bookings')
  await openDialog(page, 'Create Booking')
  await selectTrigger(page, 'event type')
  await pickLastOption(page, 'Consulting')
  await fillInput(page, 'Guest Email', 'bob@example.com')
  await fillInput(page, 'Start Time', toLocalInput(new Date(`${date}T09:30:00Z`)))
  await fillInput(page, 'End Time', toLocalInput(new Date(`${date}T10:30:00Z`)))
  await submitForm(page)

  await expect(page.getByText('The requested time slot overlaps')).toBeVisible()
})
