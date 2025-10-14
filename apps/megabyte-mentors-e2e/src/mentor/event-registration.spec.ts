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

  await page.getByTestId('signin-email-field').fill('peternguyen@gmail.com');
  await page.getByTestId('signin-password-field').fill('Thong123');

  const signinButton = await page.getByTestId('signin-button');
  await signinButton.click();

  await page.waitForURL('**/home');
  expect(page.url()).toBe('http://localhost:8081/home');

  await expect(await page.getByTestId('welcome')).toBeVisible();
  await expect(await page.getByText('Upcoming Events')).toBeVisible();

  await page.getByText('New event').click();

  const registerButton = await page.getByTestId('register-event');
  await registerButton.click();

  expect(page.getByText('Successfully registered for event')).toBeTruthy();
})