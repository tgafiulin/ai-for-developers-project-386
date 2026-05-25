import { test, expect } from '@playwright/test'
import {
  daysFromNow,
  seedEventType, selectTrigger, pickLastOption, navigateTo,
} from './helpers'

test('returns error when date is outside 14-day window', async ({ page }) => {
  const et = await seedEventType('Workshop', 60)
  const farDate = daysFromNow(15)

  const responsePromise = page.waitForResponse(
    (res) => res.url().includes('/availability') && res.status() === 400,
  )

  await navigateTo(page, '/availability')
  await selectTrigger(page, 'event type')
  await pickLastOption(page, 'Workshop')
  await page.getByLabel('Date').fill(farDate)
  await page.getByRole('button', { name: 'Search' }).click()

  const response = await responsePromise
  const body = await response.json()
  expect(body.message).toContain('outside the 14-day booking window')
})
