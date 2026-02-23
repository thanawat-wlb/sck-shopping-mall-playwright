/**
 * Payment Gateway Mock Helper
 * ช่วยในการ stub/mock payment gateway API เพื่อไม่ให้ยิง DB จริง
 */
import { Page } from '@playwright/test';

export interface MockPaymentOptions {
  successResponse?: boolean;
  delayMs?: number;
  transactionId?: string;
  errorMessage?: string;
}

export class PaymentMockHelper {
  /**
   * Stub payment gateway endpoint
   * ตัดการเชื่อมต่อ DB จริง ใช้ mock response แทน
   */
  static async stubPaymentGateway(page: Page, options: MockPaymentOptions = {}): Promise<void> {
    const {
      successResponse = true,
      delayMs = 500,
      transactionId = 'TXN-' + Date.now(),
      errorMessage = 'Invalid OTP'
    } = options;

    // Intercept payment related endpoints
    const paymentPatterns = [
      '**/payment/**',
      '**/otp/**',
      '**/checkout/**',
      '**/transaction/**'
    ];

    for (const pattern of paymentPatterns) {
      await page.route(pattern, async (route) => {
        // Simulate network delay
        if (delayMs > 0) {
          await new Promise(resolve => setTimeout(resolve, delayMs));
        }

        // ตรวจสอบ request method
        const request = route.request();
        const method = request.method();

        if (successResponse) {
          // ✅ Success response
          await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({
              success: true,
              message: 'Operation successful',
              transactionId,
              timestamp: new Date().toISOString(),
              data: {
                status: 'completed',
                amount: 12993.80,
                currency: 'THB'
              }
            })
          });
        } else {
          // ❌ Error response
          await route.fulfill({
            status: 400,
            contentType: 'application/json',
            body: JSON.stringify({
              success: false,
              message: errorMessage,
              error: true
            })
          });
        }
      });
    }
  }

  /**
   * Stub specific endpoint with custom response
   */
  static async stubEndpoint(
    page: Page,
    urlPattern: string,
    responseBody: Record<string, any>,
    statusCode: number = 200,
    delayMs: number = 0
  ): Promise<void> {
    await page.route(urlPattern, async (route) => {
      if (delayMs > 0) {
        await new Promise(resolve => setTimeout(resolve, delayMs));
      }

      await route.fulfill({
        status: statusCode,
        contentType: 'application/json',
        body: JSON.stringify(responseBody)
      });
    });
  }

  /**
   * Spy on payment requests (log without intercepting)
   */
  static async spyOnPaymentRequests(page: Page, callback?: (url: string, method: string) => void): Promise<void> {
    await page.on('request', (request) => {
      const url = request.url();
      if (url.includes('payment') || url.includes('otp') || url.includes('transaction')) {
        console.log(`[Payment Request] ${request.method()} ${url}`);
        if (callback) {
          callback(url, request.method());
        }
      }
    });
  }

  /**
   * Clear all stubs
   */
  static async clearAllStubs(page: Page): Promise<void> {
    await page.unroute('**/*');
  }

  /**
   * Stub notification endpoint
   */
  static async stubNotificationAPI(page: Page, delayMs: number = 300): Promise<void> {
    await page.route('**/notification/**', async (route) => {
      if (delayMs > 0) {
        await new Promise(resolve => setTimeout(resolve, delayMs));
      }

      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          message: 'Notification sent successfully',
          notificationId: 'NOTIF-' + Date.now()
        })
      });
    });
  }

  /**
   * Create realistic mock response delay
   */
  static getRealisticDelay(): number {
    // Random 500-1500ms to simulate real network
    return Math.floor(Math.random() * 1000) + 500;
  }
}
