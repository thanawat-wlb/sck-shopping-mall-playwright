import { Page, Locator, expect } from '@playwright/test';

export class HomePage {
  readonly page: Page;
  readonly searchInput: Locator;

  constructor(page: Page) {
    this.page = page;
    this.searchInput = page.locator('#search-product-input');
  }

  async goto() {
    // ไปที่หน้า Login ก่อน
    await this.page.goto('/auth/login');
  }

  async gotoProductList() {
    // ไปที่หน้า Product List
    await this.page.goto('/product/list');
  }

  async login(username: string, password: string) {
    await this.page.locator('#login-username-input').fill(username);
    await this.page.locator('#login-password-input').fill(password);
    await this.page.locator('#login-btn-txt').click();
    // รอให้ login สำเร็จและหน้าโหลด
    await this.page.waitForNavigation();
  }

  async searchProduct(keyword: string) {
    await this.searchInput.fill(keyword);
    await this.searchInput.press('Enter');
  }

  async fillSearchProduct(keyword: string) {
    await this.searchInput.fill(keyword);
  }

  async submitSearch() {
    await this.searchInput.press('Enter');
  }

  async selectLatestProductAndVerify(expectedProductName: string) {
    // รอให้สินค้าโหลด (หาจาก id ที่ขึ้นต้นด้วย product-card-name-)
    const productCards = this.page.locator("[id^='product-card-name-']");
    await productCards.first().waitFor({ state: 'visible' });

    // หาสินค้าตามชื่อ (ไม่ใช่ ID cứng)
    const targetProduct = this.page.locator(`[id^='product-card-name-']:has-text("${expectedProductName}")`);
    await expect(targetProduct).toHaveText(expectedProductName);
    await targetProduct.click();
  }
}