import { Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * ProductPage class จัดการหน้า Product Details
 */
export class ProductPage extends BasePage {
  // ===== Selectors =====
  private readonly SELECTORS = {
    productName: '#product-detail-product-name',
    productQtyInput: '#product-detail-quantity-input',
    qtyIncrementBtn: '#product-detail-quantity-increment-btn',
    productPrice: '#product-detail-price-thb',
    productPoint: '#product-detail-point',
    productStock: '#product-detail-stock',
    addToCartBtn: '#product-detail-add-to-cart-btn',
    cartIconBadge: '#header-menu-cart-btn'
  };

  // ===== Locators =====
  private readonly productNameLocator: Locator;
  private readonly productQtyInputLocator: Locator;
  private readonly qtyIncrementBtnLocator: Locator;
  private readonly productPriceLocator: Locator;
  private readonly productPointLocator: Locator;
  private readonly productStockLocator: Locator;
  private readonly addToCartBtnLocator: Locator;
  private readonly cartIconBadgeLocator: Locator;

  constructor(page) {
    super(page);
    this.productNameLocator = page.locator(this.SELECTORS.productName);
    this.productQtyInputLocator = page.locator(this.SELECTORS.productQtyInput);
    this.qtyIncrementBtnLocator = page.locator(this.SELECTORS.qtyIncrementBtn);
    this.productPriceLocator = page.locator(this.SELECTORS.productPrice);
    this.productPointLocator = page.locator(this.SELECTORS.productPoint);
    this.productStockLocator = page.locator(this.SELECTORS.productStock);
    this.addToCartBtnLocator = page.locator(this.SELECTORS.addToCartBtn);
    this.cartIconBadgeLocator = page.locator(this.SELECTORS.cartIconBadge);
  }

  // ===== Assertion Methods =====

  /**
   * ตรวจสอบข้อมูลสินค้า (ชื่อ, ราคา, แต้ม)
   */
  async verifyProductDetails(
    expectedName: string,
    expectedPrice: string,
    expectedPoint: string
  ): Promise<void> {
    await expect(this.productNameLocator).toHaveText(expectedName);
    await expect(this.productQtyInputLocator).toHaveValue('1');
    await expect(this.productPriceLocator).toHaveText(expectedPrice);
    await expect(this.productPointLocator).toHaveText(expectedPoint);
    await expect(this.productStockLocator).not.toHaveText('0');
  }

  /**
   * ตรวจสอบข้อมูลสินค้า (ชื่อ, ราคา, แต้ม) โดยใช้ Stub Stock
   * ไม่ต้องไปเรียก DB ของ stock จริง - ใช้ mock response แทน
   */
  async verifyProductDetailsWithStub(
    expectedName: string,
    expectedPrice: string,
    expectedPoint: string,
    stubStockAmount: number = 56
  ): Promise<void> {
    // Stub stock API เพื่อไม่ให้ไปยิง DB จริง
    await this.stubProductStock(stubStockAmount);

    await expect(this.productNameLocator).toHaveText(expectedName);
    await expect(this.productQtyInputLocator).toHaveValue('1');
    await expect(this.productPriceLocator).toHaveText(expectedPrice);
    await expect(this.productPointLocator).toHaveText(expectedPoint);

    // ตรวจสอบว่า stock ไม่เป็น 0 (mock response ก็ส่ง stubStockAmount แล้ว)
    await expect(this.productStockLocator).not.toHaveText('0');
  }

  /**
   * ตรวจสอบสินค้า out of stock (stub stock = 0)
   */
  async verifyProductOutOfStock(
    expectedName: string
  ): Promise<void> {
    // Stub stock เป็น 0
    await this.stubProductStockOutOfStock();

    await expect(this.productNameLocator).toHaveText(expectedName);
    await expect(this.productStockLocator).toHaveText('0');
  }

  // ===== Action Methods =====

  /**
   * เพิ่มจำนวนสินค้า โดยการกดปุ่ม increment
   * @param targetQuantity จำนวนสินค้าที่ต้องการ (สามารถส่งเป็น string หรือ number)
   */
  async increaseQuantityTo(targetQuantity: string | number): Promise<void> {
    const quantity = typeof targetQuantity === 'string' ? parseInt(targetQuantity, 10) : targetQuantity;

    // Reset ค่าจำนวนกลับเป็น 1 ก่อน
    await this.productQtyInputLocator.evaluate((el: HTMLInputElement) => {
      el.value = '1';
      el.dispatchEvent(new Event('input', { bubbles: true }));
      el.dispatchEvent(new Event('change', { bubbles: true }));
    });

    // กด increment คำนวณจำนวนครั้ง (quantity - 1) เนื่องจากค่าเริ่มต้นคือ 1
    const incrementCount = Math.max(0, quantity - 1);
    for (let i = 0; i < incrementCount; i++) {
      await this.clickElement(this.qtyIncrementBtnLocator);
    }

    // ตรวจสอบว่าจำนวนถูกต้อง
    await expect(this.productQtyInputLocator).toHaveValue(quantity.toString());
  }

  /**
   * เพิ่มสินค้าลงตะกร้า
   */
  async addToCart(): Promise<void> {
    await this.clickElement(this.addToCartBtnLocator);
  }

  /**
   * ตรวจสอบจำนวนสินค้าในตะกร้า และคลิกไปที่หน้าตะกร้า
   */
  async verifyCartCountAndNavigateToCart(expectedCount: string): Promise<void> {
    await expect(this.cartIconBadgeLocator).toHaveText(expectedCount);
    await this.clickElement(this.cartIconBadgeLocator);
  }
}