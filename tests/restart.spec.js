import { expect, test, chromium } from '@playwright/test';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const APP_URL = 'http://127.0.0.1:5173';

async function createNote(page, title, body) {
  await page.getByLabel('Title').fill(title);
  await page.getByLabel('Body').fill(body);
  await page.getByRole('button', { name: 'Save' }).click();
}

function noteNamed(page, title) {
  return page.locator('.note-card').filter({ has: page.getByRole('heading', { name: title, exact: true }) });
}

test('A4 state survives closing and reopening Chromium with the same profile', async () => {
  const profileDirectory = await mkdtemp(join(tmpdir(), 'agent-notes-profile-'));
  let context;

  try {
    context = await chromium.launchPersistentContext(profileDirectory, { headless: true });
    let page = context.pages()[0] ?? await context.newPage();
    await page.goto(APP_URL);

    await createNote(page, 'Shopping', 'Milk');
    await createNote(page, 'Keep me', 'Original');
    await page.getByRole('button', { name: 'Edit Keep me' }).click();
    await page.getByLabel('Body').fill('Edited after save');
    await page.getByRole('button', { name: 'Save' }).click();
    await page.getByRole('button', { name: 'Delete Shopping' }).click();

    await expect(noteNamed(page, 'Shopping')).toHaveCount(0);
    await expect(noteNamed(page, 'Keep me')).toContainText('Edited after save');

    await context.close();
    context = undefined;

    context = await chromium.launchPersistentContext(profileDirectory, { headless: true });
    page = context.pages()[0] ?? await context.newPage();
    await page.goto(APP_URL);

    await expect(noteNamed(page, 'Shopping')).toHaveCount(0);
    await expect(noteNamed(page, 'Keep me')).toHaveCount(1);
    await expect(noteNamed(page, 'Keep me')).toContainText('Edited after save');
    await expect(page.getByText('1 note', { exact: true })).toBeVisible();
  } finally {
    if (context) await context.close();
    await rm(profileDirectory, { recursive: true, force: true });
  }
});
