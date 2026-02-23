import { Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * CheckoutPage class จัดการหน้า Checkout (Shipping, Payment, OTP, Notification)
 */
export class CheckoutPage extends BasePage {
  // ===== Selectors =====
  private readonly SELECTORS = {
    // Product Info
    product: {
      name: '#product-1-name',
      qtyInput: '#product-1-quantity-input',
      price: '#product-1-price',
      point: '#product-1-point',
      stock: '#product-1-stock'
    },
    // Shipping Form
    shipping: {
      firstNameInput: '#shipping-form-first-name-input',
      lastNameInput: '#shipping-form-last-name-input',
      addressInput: '#shipping-form-address-input',
      provinceSelect: '#shipping-form-province-select',
      districtSelect: '#shipping-form-district-select',
      subDistrictSelect: '#shipping-form-sub-district-select',
      zipcodeInput: '#shipping-form-zipcode-input',
      mobileInput: '#shipping-form-mobile-input',
      shippingMethodBtn: '#shipping-method-1-name'
    },
    // Credit Card Payment Form
    payment: {
      ccNameInput: '#payment-credit-form-fullname-input',
      ccNumberInput: '#payment-credit-form-card-number-input',
      ccExpiryInput: '#payment-credit-form-expiry-input',
      ccCvvInput: '#payment-credit-form-cvv-input'
    },
    // Order Summary
    summary: {
      subtotal: '#order-summary-subtotal-price',
      point: '#order-summary-receive-point-price',
      shippingFee: '#order-summary-shipping-fee-price',
      total: '#order-summary-total-payment-price',
      payNowBtn: '#payment-now-btn'
    },
    // OTP
    otp: {
      input: '#otp-input',
      submitBtn: "button:has-text('OK')"
    },
    // Notification Subscription
    notification: {
      emailInput: '#notification-form-email-input',
      mobileInput: '#notification-form-mobile-input',
      sendBtn: '#send-notification-btn'
    }
  };

  // ===== Locators - Product Info =====
  private readonly productNameLocator: Locator;
  private readonly productQtyLocator: Locator;
  private readonly productPriceLocator: Locator;
  private readonly productPointLocator: Locator;
  private readonly productStockLocator: Locator;

  // ===== Locators - Shipping Form =====
  private readonly firstNameInputLocator: Locator;
  private readonly lastNameInputLocator: Locator;
  private readonly addressInputLocator: Locator;
  private readonly provinceSelectLocator: Locator;
  private readonly districtSelectLocator: Locator;
  private readonly subDistrictSelectLocator: Locator;
  private readonly zipcodeInputLocator: Locator;
  private readonly mobileInputLocator: Locator;
  private readonly shippingMethodBtnLocator: Locator;

  // ===== Locators - Credit Card Payment =====
  private readonly ccNameInputLocator: Locator;
  private readonly ccNumberInputLocator: Locator;
  private readonly ccExpiryInputLocator: Locator;
  private readonly ccCvvInputLocator: Locator;

  // ===== Locators - Order Summary =====
  private readonly summarySubtotalLocator: Locator;
  private readonly summaryPointLocator: Locator;
  private readonly summaryShippingFeeLocator: Locator;
  private readonly summaryTotalLocator: Locator;
  private readonly payNowBtnLocator: Locator;

  // ===== Locators - OTP & Notification =====
  private readonly otpInputLocator: Locator;
  private readonly otpSubmitBtnLocator: Locator;
  private readonly notifEmailInputLocator: Locator;
  private readonly notifMobileInputLocator: Locator;
  private readonly sendNotifBtnLocator: Locator;

  constructor(page) {
    super(page);

    // Initialize Product Info Locators
    this.productNameLocator = page.locator(this.SELECTORS.product.name);
    this.productQtyLocator = page.locator(this.SELECTORS.product.qtyInput);
    this.productPriceLocator = page.locator(this.SELECTORS.product.price);
    this.productPointLocator = page.locator(this.SELECTORS.product.point);
    this.productStockLocator = page.locator(this.SELECTORS.product.stock);

    // Initialize Shipping Form Locators
    this.firstNameInputLocator = page.locator(this.SELECTORS.shipping.firstNameInput);
    this.lastNameInputLocator = page.locator(this.SELECTORS.shipping.lastNameInput);
    this.addressInputLocator = page.locator(this.SELECTORS.shipping.addressInput);
    this.provinceSelectLocator = page.locator(this.SELECTORS.shipping.provinceSelect);
    this.districtSelectLocator = page.locator(this.SELECTORS.shipping.districtSelect);
    this.subDistrictSelectLocator = page.locator(this.SELECTORS.shipping.subDistrictSelect);
    this.zipcodeInputLocator = page.locator(this.SELECTORS.shipping.zipcodeInput);
    this.mobileInputLocator = page.locator(this.SELECTORS.shipping.mobileInput);
    this.shippingMethodBtnLocator = page.locator(this.SELECTORS.shipping.shippingMethodBtn);

    // Initialize Credit Card Payment Locators
    this.ccNameInputLocator = page.locator(this.SELECTORS.payment.ccNameInput);
    this.ccNumberInputLocator = page.locator(this.SELECTORS.payment.ccNumberInput);
    this.ccExpiryInputLocator = page.locator(this.SELECTORS.payment.ccExpiryInput);
    this.ccCvvInputLocator = page.locator(this.SELECTORS.payment.ccCvvInput);

    // Initialize Order Summary Locators
    this.summarySubtotalLocator = page.locator(this.SELECTORS.summary.subtotal);
    this.summaryPointLocator = page.locator(this.SELECTORS.summary.point);
    this.summaryShippingFeeLocator = page.locator(this.SELECTORS.summary.shippingFee);
    this.summaryTotalLocator = page.locator(this.SELECTORS.summary.total);
    this.payNowBtnLocator = page.locator(this.SELECTORS.summary.payNowBtn);

    // Initialize OTP & Notification Locators
    this.otpInputLocator = page.locator(this.SELECTORS.otp.input);
    this.otpSubmitBtnLocator = page.locator(this.SELECTORS.otp.submitBtn);
    this.notifEmailInputLocator = page.locator(this.SELECTORS.notification.emailInput);
    this.notifMobileInputLocator = page.locator(this.SELECTORS.notification.mobileInput);
    this.sendNotifBtnLocator = page.locator(this.SELECTORS.notification.sendBtn);
  }

  // ===== Assertion Methods =====

  /**
   * ตรวจสอบข้อมูลสินค้าเบื้องต้นในหน้า Checkout
   */
  async verifyInitialCheckoutInfo(): Promise<void> {
    await expect(this.productNameLocator).toHaveText('Balance Training Bicycle');
    await expect(this.productQtyLocator).toHaveValue('3');
    await expect(this.productPriceLocator).toHaveText('฿12,943.80');
    await expect(this.productPointLocator).toHaveText('129 Points');
    await expect(this.productStockLocator).not.toHaveText('0');
  }

  /**
   * ตรวจสอบข้อมูล Order Summary
   */
  async verifyOrderSummary(
    expectedPoint?: string,
    expectedShippingFee?: string,
    expectedSubtotal?: string,
    expectedTotal?: string
  ): Promise<void> {
    if (expectedPoint) {
      await expect(this.summaryPointLocator).toHaveText(expectedPoint);
    }
    if (expectedShippingFee) {
      await expect(this.summaryShippingFeeLocator).toHaveText(expectedShippingFee);
    }
    if (expectedSubtotal) {
      await expect(this.summarySubtotalLocator).toHaveText(expectedSubtotal);
    }
    if (expectedTotal) {
      await expect(this.summaryTotalLocator).toHaveText(expectedTotal);
    }
  }

  // ===== Action Methods - Shipping Form =====

  /**
   * กรอกข้อมูลการจัดส่ง (ชื่อ, นามสกุล, ที่อยู่, จังหวัด, อำเภอ, ตำบล, รหัสไปรษณีย์, เบอร์โทร)
   */
  async fillShippingInfo(
    firstName: string,
    lastName: string,
    address: string,
    province: string,
    district: string,
    subDistrict: string,
    mobile: string
  ): Promise<void> {
    await this.fillInput(this.firstNameInputLocator, firstName);
    await this.fillInput(this.lastNameInputLocator, lastName);
    await this.fillInput(this.addressInputLocator, address);
    await this.selectOption(this.provinceSelectLocator, { label: province });
    await this.selectOption(this.districtSelectLocator, { label: district });
    await this.selectOption(this.subDistrictSelectLocator, { label: subDistrict });
    await this.fillInput(this.mobileInputLocator, mobile);
  }

  /**
   * ตรวจสอบ Zipcode ที่ Auto-fill โดยระบบ
   */
  async verifyZipcode(expectedZipcode: string): Promise<void> {
    await expect(this.zipcodeInputLocator).toHaveValue(expectedZipcode);
  }

  /**
   * เลือกวิธีการจัดส่ง
   */
  async selectShippingMethod(): Promise<void> {
    await this.clickElement(this.shippingMethodBtnLocator);
  }

  // ===== Action Methods - Payment Form =====

  /**
   * กรอกข้อมูลบัตรเครดิต (ชื่อ, เลขบัตร, วันหมดอายุ, CVV)
   */
  async fillPaymentInfo(
    cardholderName: string,
    cardNumber: string,
    expiry: string,
    cvv: string
  ): Promise<void> {
    await this.fillInput(this.ccNameInputLocator, cardholderName);
    await this.fillInput(this.ccNumberInputLocator, cardNumber);
    await this.fillInput(this.ccExpiryInputLocator, expiry);
    await this.fillInput(this.ccCvvInputLocator, cvv);
  }

  // ===== Action Methods - Checkout Flow =====

  /**
   * ดำเนินการจัดส่งและชำระเงิน (شامل ข้อมูลส่วนตัว + ที่อยู่ + วิธีจัดส่ง + บัตรเครดิต)
   */
  async fillShippingAndPaymentInfo(cvv: string): Promise<void> {
    await this.fillShippingInfo(
      'Thanawat',
      'Boon',
      '205 เพชรเกษม',
      'กรุงเทพมหานคร',
      'เขตบางแค',
      'หลักสอง',
      '0812345678'
    );

    // ตรวจสอบ zipcode ที่ Auto-fill
    await this.verifyZipcode('10160');

    // เลือกวิธีการจัดส่ง
    await this.selectShippingMethod();

    // กรอกข้อมูลบัตรเครดิต
    await this.fillPaymentInfo(
      'Thanawat Boon',
      '4111111111111111',
      '12/25',
      cvv
    );
  }

  /**
   * ตรวจสอบ Order Summary และทำการชำระเงิน
   */
  async verifyOrderSummaryAndPay(): Promise<void> {
    await this.verifyOrderSummary(
      '129 Points',
      '฿50.00'
    );
    await this.clickElement(this.payNowBtnLocator);
  }

  // ===== Action Methods - OTP =====

  /**
   * กรอก OTP (One-Time Password)
   */
  async submitOTP(otpCode: string): Promise<void> {
    await this.waitForVisible(this.otpInputLocator);
    await this.fillInput(this.otpInputLocator, otpCode);
    await this.clickElement(this.otpSubmitBtnLocator);
  }

  // ===== Action Methods - Notification Subscription =====

  /**
   * ลงทะเบียนอีเมลและเบอร์โทรเพื่อรับข่าวสาร
   */
  async subscribeToNotification(email: string, mobile: string): Promise<void> {
    await this.waitForVisible(this.notifEmailInputLocator);
    await this.fillInput(this.notifEmailInputLocator, email);
    await this.fillInput(this.notifMobileInputLocator, mobile);
    await this.clickElement(this.sendNotifBtnLocator);
  }
}