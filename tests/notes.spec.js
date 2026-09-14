import { expect, test } from '@playwright/test';

async function createNote(page, title, body) {
  await page.getByLabel('Title').fill(title);
  await page.getByLabel('Body').fill(body);
  await page.getByRole('button', { name: 'Save' }).click();
}

function noteNamed(page, title) {
  return page.locator('.note-card').filter({ has: page.getByRole('heading', { name: title, exact: true }) });
}

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => localStorage.clear());
  await page.reload();
});

test('A1 creates a note and A2 edits it without duplication', async ({ page }) => {
  await createNote(page, 'Shopping', 'Milk');

  await expect(noteNamed(page, 'Shopping')).toHaveCount(1);
  await expect(noteNamed(page, 'Shopping')).toContainText('Milk');

  await page.getByRole('button', { name: 'Edit Shopping' }).click();
  await expect(page.getByRole('heading', { name: 'Edit note' })).toBeVisible();
  await page.getByLabel('Body').fill('Milk and eggs');
  await page.getByRole('button', { name: 'Save' }).click();

  await expect(noteNamed(page, 'Shopping')).toHaveCount(1);
  await expect(noteNamed(page, 'Shopping')).toContainText('Milk and eggs');
});

test('A3 deletes one note and leaves other notes unchanged', async ({ page }) => {
  await createNote(page, 'Shopping', 'Milk');
  await createNote(page, 'Reminder', 'Call Sam');

  await page.getByRole('button', { name: 'Delete Shopping' }).click();

  await expect(noteNamed(page, 'Shopping')).toHaveCount(0);
  await expect(noteNamed(page, 'Reminder')).toHaveCount(1);
  await expect(noteNamed(page, 'Reminder')).toContainText('Call Sam');
  await expect(page.getByText('1 note', { exact: true })).toBeVisible();
});

test('A4 saved, edited, and deleted state survives a page reload', async ({ page }) => {
  await createNote(page, 'Shopping', 'Milk');
  await createNote(page, 'Keep me', 'Original');
  await page.getByRole('button', { name: 'Edit Keep me' }).click();
  await page.getByLabel('Body').fill('Edited');
  await page.getByRole('button', { name: 'Save' }).click();
  await page.getByRole('button', { name: 'Delete Shopping' }).click();

  await page.reload();

  await expect(noteNamed(page, 'Shopping')).toHaveCount(0);
  await expect(noteNamed(page, 'Keep me')).toHaveCount(1);
  await expect(noteNamed(page, 'Keep me')).toContainText('Edited');
});

test('A5 rejects blank and whitespace-only fields', async ({ page }) => {
  await page.getByLabel('Title').fill('   ');
  await page.getByLabel('Body').fill('\n  ');
  await page.getByRole('button', { name: 'Save' }).click();

  await expect(page.getByText('Title is required.')).toBeVisible();
  await expect(page.getByText('Body is required.')).toBeVisible();
  await expect(page.locator('.note-card')).toHaveCount(0);

  await page.getByLabel('Title').fill('Has a title');
  await page.getByRole('button', { name: 'Save' }).click();
  await expect(page.getByText('Body is required.')).toBeVisible();
  await expect(page.locator('.note-card')).toHaveCount(0);

  await page.getByLabel('Title').fill(' ');
  await page.getByLabel('Body').fill('Has a body');
  await page.getByRole('button', { name: 'Save' }).click();
  await expect(page.getByText('Title is required.')).toBeVisible();
  await expect(page.locator('.note-card')).toHaveCount(0);
});

test('A6 displays HTML-like text literally', async ({ page }) => {
  await createNote(page, '<b>Milk</b>', '<b>Milk</b>');
  const note = noteNamed(page, '<b>Milk</b>');

  await expect(note).toHaveCount(1);
  await expect(note.getByRole('heading')).toHaveText('<b>Milk</b>');
  await expect(note.locator('.note-body')).toHaveText('<b>Milk</b>');
  await expect(note.locator('b')).toHaveCount(0);
});
