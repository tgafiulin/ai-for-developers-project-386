import { test, expect } from '@playwright/test'
import {
  uniqueDay, toLocalInput,
  navigateTo, openDialog, fillInput, selectTrigger, pickLastOption, submitForm,
} from './helpers'

test('complete booking flow', async ({ page }) => {
  const date = uniqueDay()

  await navigateTo(page, '/event-types')
  await openDialog(page, 'Create Event Type')
  await fillInput(page, 'Title', 'Team Sync')
  await fillInput(page, 'Description', 'Weekly sync')
  await fillInput(page, 'Duration (minutes)', '60')
  await submitForm(page)
  await expect(page.getByRole('cell', { name: 'Team Sync' }).first()).toBeVisible()

  await navigateTo(page, '/availability')
  await selectTrigger(page, 'event type')
  await pickLastOption(page, 'Team Sync')
  await page.getByLabel('Date').fill(date)
  await page.getByRole('button', { name: 'Search' }).click()
  await expect(page.getByText(/slot(s)? available/)).toBeVisible()

  const slotStart = new Date(`${date}T09:00:00Z`)
  const slotEnd = new Date(`${date}T10:00:00Z`)

  await navigateTo(page, '/bookings')
  await openDialog(page, 'Create Booking')
  await selectTrigger(page, 'event type')
  await pickLastOption(page, 'Team Sync')
  await fillInput(page, 'Guest Email', 'alice@example.com')
  await fillInput(page, 'Guest Name', 'Alice')
  await fillInput(page, 'Start Time', toLocalInput(slotStart))
  await fillInput(page, 'End Time', toLocalInput(slotEnd))
  await submitForm(page)

  await expect(page.getByRole('cell', { name: 'alice@example.com' }).first()).toBeVisible()
  await expect(page.getByRole('cell', { name: 'Alice' }).first()).toBeVisible()
})
