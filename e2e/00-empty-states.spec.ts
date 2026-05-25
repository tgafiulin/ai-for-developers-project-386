import { test, expect } from '@playwright/test'
import { navigateTo } from './helpers'

test('event types page shows empty state when no data', async ({ page }) => {
  await navigateTo(page, '/event-types')
  await expect(page.getByText('No event types yet')).toBeVisible()
})

test('bookings page shows empty state when no data', async ({ page }) => {
  await navigateTo(page, '/bookings')
  await expect(page.getByText('No bookings yet')).toBeVisible()
})
