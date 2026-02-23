import { Page, Locator, expect } from '@playwright/test';

export class CartPage {
  readonly page: Page;
  readonly productName: Locator;
  readonly productPrice: Locator;
  readonly productPoint: Locator;
  readonly productQtyInput: Locator;
  readonly subtotalPrice: Locator;
  readonly checkoutBtn: Locator;

  constructor(page: Page) {
    this.page = page;
    this.productName = page.locator('#product-1-name');
    this.productPrice = page.locator('#product-1-price');
    this.productPoint = page.locator('#product-1-point');
    this.productQtyInput = page.locator('#product-1-quantity-input');
    this.subtotalPrice = page.locator('#shopping-cart-subtotal-price');
    this.checkoutBtn = page.locator('#shopping-cart-checkout-btn');
  }

  // เทียบเท่า: ตรวจสอบราคา สินค้า ... ในหน้าตระกร้า base/product/1
  async verifyCartItems(name: string, price_total: string, points_total: string, qty: string){ //,subtotal: string) {
    // รอให้ราคาโหลดขึ้นมาก่อนทำ action อื่น
    await this.productPrice.waitFor({ state: 'visible' }); 
    
    await expect(this.productName).toHaveText(name);
    await expect(this.productPrice).toHaveText(`฿${price_total}`);
    await expect(this.productPoint).toHaveText(`${points_total} Points`);
    await expect(this.productQtyInput).toHaveValue(qty);
    // await expect(this.subtotalPrice).toHaveText(`฿${subtotal}`);
  }

  // เทียบเท่า: คลิกการชำระเงิน(checkout)
  async proceedToCheckout() {
    await this.checkoutBtn.click();
  }
}