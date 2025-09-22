import { test, expect } from '@playwright/test';

test('sign up flow', async ({ page }) => {
  await page.goto('http://localhost:8081');
  const homeLogo = await page.getByTestId('home-logo');
  await expect(homeLogo).toBeVisible();
  // Expect h1 to contain a substring.
  const continueEmail = await page.getByTestId('continue-email');
  // expect(continueEmail.innerText()).toContain('Continue with Email');

  await continueEmail.click();

  await page.waitForURL('**/sign-in');
  expect(page.url()).toBe('http://localhost:8081/sign-in');

  const signupLink = await page.getByTestId('signup-link');

  await expect(signupLink).toBeVisible();

  await signupLink.click();

  await page.waitForURL('**/sign-up');
  expect(page.url()).toBe('http://localhost:8081/sign-up');

  await page.getByTestId('username-field').fill('testPlaywright');
  await page.getByTestId('email-field').fill('test'+ Math.random() + '@test.com');
  await page.getByTestId('password-field').fill('Test21212');

  const signupButton = await page.getByTestId('signup-button');
  await signupButton.click();

  await page.waitForURL('**/home');
  expect(page.url()).toBe('http://localhost:8081/home');

  await expect(await page.getByTestId('welcome')).toBeVisible();

});

test('sign in flow', async ({ page }) => {
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

  await page.waitForURL('**/home');
  expect(page.url()).toBe('http://localhost:8081/admin-home');

  await expect(await page.getByTestId('welcome')).toBeVisible();
})

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

  await page.getByTestId('event-title-input').fill('admin@gmail.com');
  await page.getByTestId('event-description-input').fill('Admin123');
  await page.getByTestId('event-date-input').fill('2030-12-12');
  await page.getByTestId('event-starttime-input').fill('10:00');
  await page.getByTestId('event-endtime-input').fill('12:00');
  await page.getByTestId('event-location-input').fill('Online');
  await page.getByTestId('event-capacity-input').fill('100');
  await page.getByTestId('event-campus-input').click();
  await page.getByText('Davis Campus').click();

  const createEvent = await page.getByTestId('create-event');
  await createEvent.click();

  expect(page.getByText('Event created successfully')).toBeTruthy();
})
