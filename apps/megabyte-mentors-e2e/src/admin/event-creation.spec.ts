import { test, expect } from '@playwright/test';


test('event creation flow', async ({ page }) => {
  await page.goto('http://localhost:8081');
  const homeLogo = await page.getByTestId('home-logo');
  await expect(homeLogo).toBeVisible();
  // Expect h1 to contain a substring.
  const continueEmail = await page.getByTestId('continue-email');
  // expect(continueEmail.innerText()).toContain('Continue with Email');

  await continueEmail.click();

  await page.waitForURL('**/sign-in');
  expect(page.url()).toBe('http://localhost:8081/sign-in');

  await page.getByTestId('signin-email-field').fill('admin@gmail.com');
  await page.getByTestId('signin-password-field').fill('Admin123');

  const signinButton = await page.getByTestId('signin-button');
  await signinButton.click();

  await page.waitForURL('**/admin-home');
  expect(page.url()).toBe('http://localhost:8081/admin-home');

  await expect(await page.getByTestId('welcome')).toBeVisible();

  await page.goto('http://localhost:8081/admin-event');

  await page.waitForURL('**/admin-event');
  expect(page.url()).toBe('http://localhost:8081/admin-event');

  await expect(await page.getByTestId('event-title')).toBeVisible();

  const createEventButton = await page.getByTestId('create-event-button');
  await createEventButton.click();

  await expect(await page.getByTestId('create-event-title')).toBeVisible();


  await page.getByTestId('event-title-input').fill('E2E Test Event');
  await page.getByTestId('event-description-input').fill('This is an event created during E2E testing');
  await page.getByTestId('event-date-input').fill('2030-12-12');
  await page.getByTestId('event-starttime-input').fill('10:00');
  await page.getByTestId('event-endtime-input').fill('12:00');
  await page.getByTestId('event-location-input').fill('Online');
  await page.getByTestId('event-capacity-input').fill('100');
  await page.getByTestId('event-campus-input').click();
  await page.getByText('Davis Campus').click();

  const createEvent = await page.getByTestId('create-event');
  await createEvent.click();

  expect(page.getByText('Successfully created event')).toBeTruthy();
})