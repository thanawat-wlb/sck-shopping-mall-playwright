import { Page, Locator, expect } from '@playwright/test';

export class CheckoutPage {
  readonly page: Page;
  
  // Locators ข้อมูลสินค้าเบื้องต้น
  readonly productName: Locator;
  readonly productQty: Locator;
  readonly productPrice: Locator;
  readonly productPoint: Locator;
  readonly productStock: Locator;

  // Locators ข้อมูลจัดส่งและบัตรเครดิต
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly addressInput: Locator;
  readonly provinceSelect: Locator;
  readonly districtSelect: Locator;
  readonly subDistrictSelect: Locator;
  readonly zipcodeInput: Locator;
  readonly mobileInput: Locator;
  readonly shippingMethodBtn: Locator;
  
  readonly ccNameInput: Locator;
  readonly ccNumberInput: Locator;
  readonly ccExpiryInput: Locator;
  readonly ccCvvInput: Locator;
  
  // Locators ยืนยันคำสั่งซื้อ
  readonly summarySubtotal: Locator;
  readonly summaryPoint: Locator;
  readonly summaryShippingFee: Locator;
  readonly summaryTotal: Locator;
  readonly payNowBtn: Locator;

  // Locators OTP และ Notification
  readonly otpInput: Locator;
  readonly otpSubmitBtn: Locator;
  readonly notifEmailInput: Locator;
  readonly notifMobileInput: Locator;
  readonly sendNotifBtn: Locator;

  constructor(page: Page) {
    this.page = page;
    
    this.productName = page.locator('#product-1-name');
    this.productQty = page.locator('#product-1-quantity-input');
    this.productPrice = page.locator('#product-1-price');
    this.productPoint = page.locator('#product-1-point');
    this.productStock = page.locator('#product-1-stock');

    this.firstNameInput = page.locator('#shipping-form-first-name-input');
    this.lastNameInput = page.locator('#shipping-form-last-name-input');
    this.addressInput = page.locator('#shipping-form-address-input');
    this.provinceSelect = page.locator('#shipping-form-province-select');
    this.districtSelect = page.locator('#shipping-form-district-select');
    this.subDistrictSelect = page.locator('#shipping-form-sub-district-select');
    this.zipcodeInput = page.locator('#shipping-form-zipcode-input');
    this.mobileInput = page.locator('#shipping-form-mobile-input');
    this.shippingMethodBtn = page.locator('#shipping-method-1-name');

    this.ccNameInput = page.locator('#payment-credit-form-fullname-input');
    this.ccNumberInput = page.locator('#payment-credit-form-card-number-input');
    this.ccExpiryInput = page.locator('#payment-credit-form-expiry-input');
    this.ccCvvInput = page.locator('#payment-credit-form-cvv-input');

    this.summarySubtotal = page.locator('#order-summary-subtotal-price');
    this.summaryPoint = page.locator('#order-summary-receive-point-price');
    this.summaryShippingFee = page.locator('#order-summary-shipping-fee-price');
    this.summaryTotal = page.locator('#order-summary-total-payment-price');
    this.payNowBtn = page.locator('#payment-now-btn');

    this.otpInput = page.locator('#otp-input');
    // Playwright สามารถค้นหาปุ่มจากข้อความได้เลย
    this.otpSubmitBtn = page.locator('button', { hasText: 'PAY NOW' }); 
    
    this.notifEmailInput = page.locator('#notification-form-email-input');
    this.notifMobileInput = page.locator('#notification-form-mobile-input');
    this.sendNotifBtn = page.locator('#send-notification-btn');
  }

  // เทียบเท่า: ตรวจสอบผลลัพธ์ในหน้าข้อมูลการจัดส่งคำสั่งซื้อ //checkout
  async verifyInitialCheckoutInfo() {
    await expect(this.productName).toHaveText('Balance Training Bicycle');
    await expect(this.productQty).toHaveValue('3');
    await expect(this.productPrice).toHaveText('฿12,943.80');
    await expect(this.productPoint).toHaveText('129 Points');
    await expect(this.productStock).not.toHaveText('0');
  }

  // เทียบเท่า: ยืนยันข้อมูลการจัดส่งคำสั่งซื้อ (กรอกข้อมูลทั้งหมด)
  async fillShippingAndPaymentInfo(cvv: string) {
    await this.firstNameInput.fill('Thanawat');
    await this.lastNameInput.fill('Boon');
    await this.addressInput.fill('205 เพชรเกษม');

    // การทำ Select Option ใน Playwright
    await this.provinceSelect.selectOption({ label: 'กรุงเทพมหานคร' });
    await this.districtSelect.selectOption({ label: 'เขตบางแค' });
    await this.subDistrictSelect.selectOption({ label: 'หลักสอง' });
    
    // ตรวจสอบ zipcode ที่ระบบ Auto-fill ให้
    await expect(this.zipcodeInput).toHaveValue('10160');
    
    await this.mobileInput.fill('0812345678');
    await this.shippingMethodBtn.click();

    // ข้อมูลบัตรเครดิต
    await this.ccNameInput.fill('Thanawat Boon');
    await this.ccNumberInput.fill('4111111111111111');
    await this.ccExpiryInput.fill('12/25');
    await this.ccCvvInput.fill(cvv);
  }

  // เทียบเท่า: ตรวจสอบ Summary และกดชำระเงิน
  async verifyOrderSummaryAndPay() {
    // await expect(this.summarySubtotal).toHaveText('฿12,943.80');
    await expect(this.summaryPoint).toHaveText('129 Points');
    await expect(this.summaryShippingFee).toHaveText('฿50.00');
    await expect(this.summaryTotal).toHaveText('฿12,993.80');
    await this.payNowBtn.click();
  }

  // เทียบเท่า: กรอกรหัสรหัสผ่านครั้งเดียว(OTP)
  async submitOTP(otpCode: string) {
    await this.otpInput.waitFor({ state: 'visible' });
    await this.otpInput.fill(otpCode);
    await this.otpSubmitBtn.click();
  }

  // เทียบเท่า: กรอกอีเมลเบอร์โทรเพื่อรับข่าวสารโปรโมชั่น
  async subscribeNotification(email: string, mobile: string) {
    await this.notifEmailInput.waitFor({ state: 'visible' });
    await this.notifEmailInput.fill(email);
    await this.notifMobileInput.fill(mobile);
    await this.sendNotifBtn.click();
  }
}