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
}
