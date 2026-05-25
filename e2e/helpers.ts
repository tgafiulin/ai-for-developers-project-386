import { type Page } from '@playwright/test'

const API_URL = 'http://localhost:3001'

let dateCounter = 1

export function uniqueDay(): string {
  const d = new Date()
  d.setDate(d.getDate() + dateCounter++)
  return d.toISOString().slice(0, 10)
}

export function daysFromNow(n: number): string {
  const d = new Date()
  d.setDate(d.getDate() + n)
  return d.toISOString().slice(0, 10)
}

export function toLocalInput(d: Date): string {
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
}

export async function apiSeed<T>(method: string, path: string, body?: unknown): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  })
  if (!res.ok) throw new Error(`Seed API error: ${res.status} ${await res.text()}`)
  if (res.status === 204) return undefined as T
  return res.json() as Promise<T>
}

export async function seedEventType(title = 'Test Meeting', durationMinutes = 60) {
  return apiSeed<{ id: string; title: string; description: string; durationMinutes: number }>(
    'POST',
    '/event-types',
    { title, description: 'A test event type', durationMinutes },
  )
}

export async function seedBooking(
  eventTypeId: string,
  startTime: string,
  endTime: string,
  guestEmail = 'test@example.com',
) {
  return apiSeed<{ id: string }>('POST', '/bookings', {
    eventTypeId,
    guestEmail,
    startTime,
    endTime,
  })
}

export async function navigateTo(page: Page, path: string) {
  await page.goto(path)
  await page.waitForLoadState('networkidle')
}

export async function openDialog(page: Page, buttonName: string) {
  await page.getByRole('button', { name: buttonName }).click()
}

export async function fillInput(page: Page, label: string, value: string) {
  await page.getByLabel(label).fill(value)
}

export async function selectTrigger(page: Page, placeholder = 'event type') {
  await page.locator(`button:has-text("Select ${placeholder}")`).first().click()
}

export async function pickLastOption(page: Page, name: string) {
  await page.getByRole('option', { name }).last().click()
}

export async function submitForm(page: Page) {
  await page.getByRole('button', { name: /Create|Save|Search/ }).last().click()
}
