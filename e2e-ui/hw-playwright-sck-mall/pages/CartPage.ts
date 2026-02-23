import { Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * CartPage class จัดการหน้า Shopping Cart
 */
export class CartPage extends BasePage {
  // ===== Selectors =====
  private readonly SELECTORS = {
    productName: '#product-1-name',
    productPrice: '#product-1-price',
    productPoint: '#product-1-point',
    productQtyInput: '#product-1-quantity-input',
    subtotalPrice: '#shopping-cart-subtotal-price',
    checkoutBtn: '#shopping-cart-checkout-btn'
  };

  // ===== Locators =====
  private readonly productNameLocator: Locator;
  private readonly productPriceLocator: Locator;
  private readonly productPointLocator: Locator;
  private readonly productQtyInputLocator: Locator;
  private readonly subtotalPriceLocator: Locator;
  private readonly checkoutBtnLocator: Locator;

  constructor(page) {
    super(page);
    this.productNameLocator = page.locator(this.SELECTORS.productName);
    this.productPriceLocator = page.locator(this.SELECTORS.productPrice);
    this.productPointLocator = page.locator(this.SELECTORS.productPoint);
    this.productQtyInputLocator = page.locator(this.SELECTORS.productQtyInput);
    this.subtotalPriceLocator = page.locator(this.SELECTORS.subtotalPrice);
    this.checkoutBtnLocator = page.locator(this.SELECTORS.checkoutBtn);
  }

  // ===== Assertion Methods =====

  /**
   * ตรวจสอบข้อมูลสินค้าในตะกร้า (ชื่อ, ราคา, แต้ม, จำนวน)
   */
  async verifyCartItems(
    expectedName: string,
    expectedPrice: string,
    expectedPoints: string,
    expectedQuantity: string
  ): Promise<void> {
    // รอให้ราคาโหลดขึ้นมาก่อนทำ assertion
    await this.waitForVisible(this.productPriceLocator);

    await expect(this.productNameLocator).toHaveText(expectedName);
    await expect(this.productPriceLocator).toHaveText(`฿${expectedPrice}`);
    await expect(this.productPointLocator).toHaveText(`${expectedPoints} Points`);
    await expect(this.productQtyInputLocator).toHaveValue(expectedQuantity);
  }

  /**
   * ตรวจสอบราคา Subtotal (optional)
   */
  async verifySubtotalPrice(expectedSubtotal: string): Promise<void> {
    await expect(this.subtotalPriceLocator).toHaveText(`฿${expectedSubtotal}`);
  }

  // ===== Action Methods =====

  /**
   * ดำเนินการไปยังหน้า Checkout
   */
  async proceedToCheckout(): Promise<void> {
    await this.clickElement(this.checkoutBtnLocator);
  }
}