import { Page, Locator } from '@playwright/test';

/**
 * BasePage class ที่มี common methods สำหรับการ wait, fill, click, verify ต่างๆ
 * เพื่อลดการเขียนซ้ำๆ และทำให้ code maintainable ขึ้น
 */
export class BasePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * รอให้ element มีความสามารถในการมองเห็นได้
   */
  async waitForVisible(locator: Locator, timeout: number = 5000): Promise<void> {
    await locator.waitFor({ state: 'visible', timeout });
  }

  /**
   * รอให้ element หายไป
   */
  async waitForHidden(locator: Locator, timeout: number = 5000): Promise<void> {
    await locator.waitFor({ state: 'hidden', timeout });
  }

  /**
   * Fill input field พร้อม clear ก่อนหน้า
   */
  async fillInput(locator: Locator, value: string): Promise<void> {
    await this.waitForVisible(locator);
    await locator.clear();
    await locator.fill(value);
  }

  /**
   * Click element พร้อม wait ให้มองเห็นได้ก่อน
   */
  async clickElement(locator: Locator): Promise<void> {
    await this.waitForVisible(locator);
    await locator.click();
  }

  /**
   * Select option from dropdown
   */
  async selectOption(locator: Locator, value: { label: string } | { value: string }): Promise<void> {
    await this.waitForVisible(locator);
    await locator.selectOption(value);
  }

  /**
   * Navigate to path relative to baseURL
   */
  async goto(path: string): Promise<void> {
    await this.page.goto(path);
  }

  /**
   * Wait for navigation to complete
   */
  async waitForNavigation(): Promise<void> {
    await this.page.waitForNavigation();
  }

  // ===== Stub/Mock Methods =====

  /**
   * Mock payment gateway API เพื่อไม่ให้ยิง DB จริง
   * ใช้กรณี: OTP verification, Payment processing
   */
  async stubPaymentGateway(options?: { successResponse?: boolean; delayMs?: number }): Promise<void> {
    const { successResponse = true, delayMs = 500 } = options || {};

    // Stub payment-related endpoints but do NOT fulfill navigation/document requests
    await this.page.route('**/payment/**', async (route) => {
      const request = route.request();
      const resourceType = request.resourceType();
      const acceptHeader = (request.headers()['accept'] || '').toLowerCase();

      // If the browser expects an HTML document (navigation to payment page), allow it to continue
      const isDocument = resourceType === 'document' || acceptHeader.includes('text/html');
      if (isDocument) {
        await route.continue();
        return;
      }

      // Simulate network delay only for API/XHR requests
      if (delayMs > 0) {
        await new Promise(resolve => setTimeout(resolve, delayMs));
      }

      // Only mock XHR/Fetch/API style requests; otherwise continue
      if (resourceType === 'xhr' || resourceType === 'fetch' || request.url().includes('/api/') || (request.headers()['content-type'] || '').includes('application/json')) {
        if (successResponse) {
          await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({
              success: true,
              message: 'OTP verified successfully',
              transactionId: 'TXN-' + Date.now()
            })
          });
        } else {
          await route.fulfill({
            status: 400,
            contentType: 'application/json',
            body: JSON.stringify({
              success: false,
              message: 'Invalid OTP'
            })
          });
        }
        return;
      }

      // Fallback: allow non-API requests to proceed
      await route.continue();
    });
  }

  /**
   * Mock any API endpoint with custom response
   */
  async stubApiEndpoint(
    urlPattern: string,
    responseBody: Record<string, any>,
    statusCode: number = 200
  ): Promise<void> {
    await this.page.route(urlPattern, async (route) => {
      await route.fulfill({
        status: statusCode,
        contentType: 'application/json',
        body: JSON.stringify(responseBody)
      });
    });
  }

  /**
   * Clear all route stubs
   */
  async clearStubs(): Promise<void> {
    await this.page.unroute('**/*');
  }

  // ===== Product Stock Stub Methods =====

  /**
   * Stub product stock data เพื่อไม่ให้ไปยิง DB จริง
   * Mock response ให้ stock > 0
   */
  async stubProductStock(stockAmount: number = 56): Promise<void> {
    await this.page.route('**/product/**', async (route) => {
      const request = route.request();
      const url = new URL(request.url());

      // เฉพาะ GET requests สำหรับดึง product info
      if (request.method() === 'GET') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            success: true,
            data: {
              id: 1,
              name: 'Balance Training Bicycle',
              price: 4314.60,
              points: 43,
              stock: stockAmount, // Mock stock amount
              description: 'Mock product data'
            }
          })
        });
        return;
      }

      // ส่วนอื่นให้ผ่านตามปกติ
      await route.continue();
    });
  }

  /**
   * Stub product stock ให้เป็น 0 (out of stock)
   */
  async stubProductStockOutOfStock(): Promise<void> {
    await this.stubProductStock(0);
  }

  /**
   * Mock DOM element stock text โดยตรง (ไม่ต้องเรียก API)
   * วิธีนี้เร็วกว่า ใช้สำหรับ UI test ที่ไม่ต้อง API
   */
  async mockStockTextInDOM(locator: Locator, stockAmount: number): Promise<void> {
    const displayText = stockAmount === 0 ? 'Out of Stock' : `Stock ${stockAmount} items`;
    await locator.evaluate((el, text) => {
      el.textContent = text;
    }, displayText);
  }
}
