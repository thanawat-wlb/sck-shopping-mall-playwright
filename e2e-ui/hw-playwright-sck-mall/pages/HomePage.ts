import { Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * HomePage class จัดการหน้า Login และ Product List Search
 */
export class HomePage extends BasePage {
  // ===== Selectors =====
  private readonly SELECTORS = {
    LOGIN: {
      usernameInput: '#login-username-input',
      passwordInput: '#login-password-input',
      submitBtn: '#login-btn-txt'
    },
    SEARCH: {
      searchInput: '#search-product-input',
      productCards: "[id^='product-card-name-']"
    }
  };

  // ===== Locators =====
  private readonly loginUsernameInput: Locator;
  private readonly loginPasswordInput: Locator;
  private readonly loginSubmitBtn: Locator;
  private readonly searchInput: Locator;

  constructor(page) {
    super(page);
    this.loginUsernameInput = page.locator(this.SELECTORS.LOGIN.usernameInput);
    this.loginPasswordInput = page.locator(this.SELECTORS.LOGIN.passwordInput);
    this.loginSubmitBtn = page.locator(this.SELECTORS.LOGIN.submitBtn);
    this.searchInput = page.locator(this.SELECTORS.SEARCH.searchInput);
  }

  // ===== Navigation Methods =====

  /**
   * ไปที่หน้า Login
   */
  async gotoLoginPage(): Promise<void> {
    await this.goto('/auth/login');
  }

  /**
   * ไปที่หน้า Product List
   */
  async gotoProductList(): Promise<void> {
    await this.goto('/product/list');
  }

  // ===== Authentication Methods =====

  /**
   * ทำการ Login ด้วย username และ password
   */
  async login(username: string, password: string): Promise<void> {
    await this.fillInput(this.loginUsernameInput, username);
    await this.fillInput(this.loginPasswordInput, password);
    await this.clickElement(this.loginSubmitBtn);
    await this.waitForNavigation();
  }

  // ===== Search Methods =====

  /**
   * ค้นหาสินค้า (fill และ submit โดยการกด Enter)
   */
  async searchProduct(keyword: string): Promise<void> {
    await this.fillInput(this.searchInput, keyword);
    await this.searchInput.press('Enter');
  }

  /**
   * กรอกคำค้นหาไปในช่อง search
   */
  async fillSearchKeyword(keyword: string): Promise<void> {
    await this.fillInput(this.searchInput, keyword);
  }

  /**
   * ทำการ submit search โดยการกด Enter
   */
  async submitSearchKeyword(): Promise<void> {
    await this.searchInput.press('Enter');
  }

  /**
   * เลือกสินค้าจาก search results และตรวจสอบชื่อ
   */
  async selectProductByName(productName: string): Promise<void> {
    const productCardsLocator = this.page.locator(this.SELECTORS.SEARCH.productCards);
    await this.waitForVisible(productCardsLocator.first());

    const targetProduct = this.page.locator(
      `${this.SELECTORS.SEARCH.productCards}:has-text("${productName}")`
    );
    
    await expect(targetProduct).toHaveText(productName);
    await this.clickElement(targetProduct);
  }
}