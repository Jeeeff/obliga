import { test, expect } from '@playwright/test';

test.describe('Client Flow', () => {
  test('should login and view obligations', async ({ page }) => {
    // Diagnostics
    page.on('console', msg => console.log('PAGE LOG:', msg.text()));
    page.on('requestfailed', request => console.log('REQUEST FAILED:', request.url(), request.failure()?.errorText));

    // 1. Login
    await page.goto('/login');
    await page.fill('input[type="email"]', 'client@acme.com');
    await page.fill('input[type="password"]', 'password123');
    
    // Enhanced login wait
    const responsePromise = page.waitForResponse(resp => resp.url().includes('/auth/login'));
    await page.click('button[type="submit"]');
    const response = await responsePromise;
    
    if (response.status() !== 200) {
        console.log('Login failed status:', response.status());
        console.log('Login failed body:', await response.text());
    }
    expect(response.status()).toBe(200);
    
    await page.waitForURL('**/dashboard', { timeout: 15000 });

    // 2. View Obligations
    await page.goto('/obligations');
    
    // Client should see their obligations
    // We assume seed data exists (Acme Corp has obligations)
    await expect(page.locator('table')).toBeVisible();
    
    // 3. Submit an obligation
    // Find an obligation that is PENDING
    // This is tricky without knowing exact data.
    // We can try to find a badge "PENDING" and click the row.
    const pendingBadge = page.locator('span:has-text("pending")').first();
    if (await pendingBadge.count() > 0) {
        await pendingBadge.click();
        
        // Inside detail page
        // Look for Submit button
        const submitButton = page.locator('button:has-text("Submit")');
        if (await submitButton.count() > 0) {
            await submitButton.click();
            await expect(page.locator('text=SUBMITTED')).toBeVisible();
        }
    }
  });

  test('should view obligation detail without crash (even with 403 on activity)', async ({ page }) => {
    // Diagnostics
    page.on('console', msg => console.log('PAGE LOG:', msg.text()));
    page.on('requestfailed', request => console.log('REQUEST FAILED:', request.url(), request.failure()?.errorText));

    // 1. Login
    await page.goto('/login');
    await page.fill('input[type="email"]', 'client@acme.com');
    await page.fill('input[type="password"]', 'password123');

    // Enhanced login wait
    const responsePromise = page.waitForResponse(resp => resp.url().includes('/auth/login'));
    await page.click('button[type="submit"]');
    const response = await responsePromise;
    
    if (response.status() !== 200) {
        console.log('Login failed status:', response.status());
        console.log('Login failed body:', await response.text());
    }
    expect(response.status()).toBe(200);

    await page.waitForURL('**/dashboard', { timeout: 15000 });

    // 2. View Obligations
    await page.goto('/obligations');
    
    // 3. Click first obligation to go to detail
    // Wait for table to load
    await expect(page.locator('table')).toBeVisible();
    
    // Click on the first row's link
    const firstRowLink = page.locator('tbody tr').first().locator('a').first();
    await firstRowLink.click();
    
    // 4. Verify Detail Page Loads
    // Check for title or specific element
    await expect(page.locator('h1')).toBeVisible();
    
    // Check that Activity section exists but is likely empty or shows "No activity"
    // And importantly, the page didn't crash (we are seeing content)
    await expect(page.getByText('Activity')).toBeVisible();
    // Verify we are not redirected to dashboard (which happens on 403 if not handled, though my fix prevents crash, the old code redirected on 403)
    // My fix: if (error.message?.includes("403")) router.push("/dashboard") was in the catch block of Promise.all
    // With Promise.allSettled, I am NOT throwing/redirecting for activity 403.
    // So we should stay on the page.
    await expect(page).not.toHaveURL('/dashboard');
  });
});
