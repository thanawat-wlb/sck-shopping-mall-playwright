import { Page, Locator, expect } from '@playwright/test';

export class ProductPage {
  readonly page: Page;
  readonly productName: Locator;
  readonly productQtyInput: Locator;
  readonly productPrice: Locator;
  readonly productPoint: Locator;
  readonly productStock: Locator;
  readonly addToCartBtn: Locator;
  readonly cartIconBadge: Locator;
  readonly qtyIncrementBtn: Locator;

  constructor(page: Page) {
    this.page = page;
    this.productName = page.locator('#product-detail-product-name');
    this.productQtyInput = page.locator('#product-detail-quantity-input');
    this.productPrice = page.locator('#product-detail-price-thb');
    this.productPoint = page.locator('#product-detail-point');
    this.productStock = page.locator('#product-detail-stock');
    this.addToCartBtn = page.locator('#product-detail-add-to-cart-btn');
    this.cartIconBadge = page.locator('#header-menu-cart-btn');
    this.qtyIncrementBtn = page.locator('#product-detail-quantity-increment-btn');
  }

  // เทียบเท่า: ตรวจสอบราคา สินค้า Balance Training Bicycle...
  async verifyProductDetails(expectedName: string, expectedPrice: string, expectedPoint: string) {
    await expect(this.productName).toHaveText(expectedName);
    await expect(this.productQtyInput).toHaveValue('1'); // ตรวจสอบว่าค่าเริ่มต้นเป็น 1
    await expect(this.productPrice).toHaveText(expectedPrice);
    await expect(this.productPoint).toHaveText(expectedPoint);
    // เช็คว่าสต็อกต้องไม่เป็น 0
    await expect(this.productStock).not.toHaveText('0'); 
  }

  // เทียบเท่า: คลิกเลือกสินค้าลงตระกร้า
  async addToCart() {
    await this.addToCartBtn.click();
  }

  // เพิ่มจำนวนสินค้า โดยกดปุ่ม increment
  async increaseQuantity(targetQty: number | string) {
    // ก่อนกด increment ให้รีเซ็ตช่องจำนวนกลับเป็นค่าเริ่มต้น (1)
    // ทำแบบแข็งแกร่ง: ตั้ง value ผ่าน DOM แล้ว dispatch events เพื่อให้ component รับรู้
    // (รองรับกรณี input เป็น readonly หรือ component ใช้ event listeners)
    await this.productQtyInput.evaluate((el: HTMLInputElement) => {
      el.value = '1';
      el.dispatchEvent(new Event('input', { bubbles: true }));
      el.dispatchEvent(new Event('change', { bubbles: true }));
    });

    // รองรับการส่งเป็น string หรือ number
    const qtyNum = typeof targetQty === 'string' ? parseInt(targetQty, 10) : targetQty;

    // ค่าเริ่มต้นเป็น 1 ดังนั้นกดจำนวน (qtyNum - 1) ครั้ง
    const timesToClick = Math.max(0, qtyNum - 1);
    for (let i = 0; i < timesToClick; i++) {
      await this.qtyIncrementBtn.click();
    }

    // ตรวจสอบว่าจำนวนเท่ากับที่ต้องการ
    await expect(this.productQtyInput).toHaveValue(qtyNum.toString());
  }

  // เทียบเท่า: ตรวจสอบเลขบนตระกร้าต้องมีประเภทสินค้า 1 ประเภท และคลิกตะกร้า
  async verifyCartAndGoToCart(expectedCount: string) {
    await expect(this.cartIconBadge).toContainText(expectedCount);
    await this.cartIconBadge.click();
  }
}