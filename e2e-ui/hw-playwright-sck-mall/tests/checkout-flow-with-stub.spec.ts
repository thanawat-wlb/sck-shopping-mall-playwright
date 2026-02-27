import { test } from '@playwright/test';
import { HomePage } from '../pages/HomePage'; // Homepage
import { ProductPage } from '../pages/ProductPage'; // http://139.59.225.96/product/1
import { CartPage } from '../pages/CartPage';  // Shopping cart หน้าตะกร้า
import { CheckoutPage } from '../pages/CheckoutPage'; // http://139.59.225.96/checkout

// ===== Test Data =====
const PRODUCT_DATA = {
  name: 'Balance Training Bicycle',
  price: '4,314.60',
  point: '43',
  qty: '3',
  price_total: '12,943.80',
  points_total: '129'
};

const SHIPPING_DATA = {
  firstName: 'Thanawat',
  lastName: 'Boon',
  address: '205 เพชรเกษม',
  province: 'กรุงเทพมหานคร',
  district: 'เขตบางแค',
  subDistrict: 'หลักสอง',
  zipcode: '10160',
  mobile: '0812345678'
};

const PAYMENT_DATA = {
  cardholderName: 'Thanawat Boon',
  cardNumber: '4111111111111111',
  expiry: '12/25',
  cvv: '123'
};

const OTP_CODE = '123456';
const NOTIFICATION_EMAIL = 'thanawat123';
const NOTIFICATION_MOBILE = '0812345678';

// ===== Test Suite with API Stubs =====
test.describe('SCK-Shopping Mall - Checkout Flow (With API Stubs)', () => {
  test('ลูกค้าสามารถซื้อสินค้า (ไม่ยิง DB จริง - มี stub)', async ({ page }) => {
    // Init Page Objects
    const homePage = new HomePage(page);
    const productPage = new ProductPage(page);
    const cartPage = new CartPage(page);
    const checkoutPage = new CheckoutPage(page);

    await test.step('01. Setup API stubs เพื่อไม่ให้ยิง DB จริง', async () => {
      // Stub payment gateway API
      await checkoutPage.stubPaymentGateway({
        successResponse: true,
        delayMs: 1000 // Simulate network delay
      });

      // (Optional) Stub อื่นๆ ถ้าต้อง
      await checkoutPage.stubApiEndpoint(
        '**/notification/**',
        {
          success: true,
          message: 'Notification sent successfully'
        },
        200
      );
    });

    await test.step('02. ลูกค้าเข้าสู่ระบบ', async () => {
      await homePage.gotoLoginPage();
      await homePage.login('user_6', 'P@ssw0rd');
    });

    await test.step('03. ค้นหาและเลือกสินค้า', async () => {
      await homePage.gotoProductList();
      await homePage.fillSearchKeyword(PRODUCT_DATA.name);
      await homePage.submitSearchKeyword();
      await homePage.selectProductByName(PRODUCT_DATA.name);
    });

    await test.step('04. ตรวจสอบรายละเอียดสินค้าและเพิ่มตะกร้า', async () => {
      await productPage.verifyProductDetails(
        PRODUCT_DATA.name,
        `฿${PRODUCT_DATA.price}`,
        `${PRODUCT_DATA.point} Points`
      );
      await productPage.increaseQuantityTo(PRODUCT_DATA.qty);
      await productPage.addToCart();
      await productPage.verifyCartCountAndNavigateToCart('1');
    });

    await test.step('05. ตรวจสอบตะกร้าและไปยัง Checkout', async () => {
      await cartPage.verifyCartItems(
        PRODUCT_DATA.name,
        PRODUCT_DATA.price_total,
        PRODUCT_DATA.points_total,
        PRODUCT_DATA.qty
      );
      await cartPage.proceedToCheckout();
    });

    await test.step('06. ตรวจสอบหน้า Checkout', async () => {
      await checkoutPage.verifyInitialCheckoutInfo();
    });

    await test.step('07. กรอกข้อมูลการจัดส่งและชำระเงิน', async () => {
      await checkoutPage.fillShippingAndPaymentInfo(PAYMENT_DATA.cvv);
    });

    await test.step('08. ตรวจสอบ Order Summary และชำระเงิน (with network logging)', async () => {
      // Attach lightweight network logging for payment-related requests
      const recorded: string[] = [];
      const onRequest = (r: any) => {
        const url = r.url();
        if (url.includes('/payment') || url.includes('/otp') || url.includes('/transaction')) {
          recorded.push(`REQ ${r.method()} ${url}`);
        }
      };
      const onResponse = (res: any) => {
        const url = res.url();
        if (url.includes('/payment') || url.includes('/otp') || url.includes('/transaction')) {
          recorded.push(`RES ${res.status()} ${url}`);
        }
      };

      page.on('request', onRequest);
      page.on('response', onResponse);

      // Click Pay and wait for possible navigation (if the app navigates to payment gateway)
      await Promise.all([
        page.waitForNavigation({ waitUntil: 'domcontentloaded', timeout: 10000 }).catch(() => {}),
        checkoutPage.verifyOrderSummaryAndPay()
      ]);

      // small pause to allow background XHRs to fire
      await page.waitForTimeout(500);

      // Log where we are and what requests occurred
      console.log('DEBUG: page.url after Pay click ->', page.url());
      console.log('DEBUG: recorded payment-related network events ->', recorded);

      // cleanup listeners to avoid duplicate logs in following steps
      page.removeListener('request', onRequest as any);
      page.removeListener('response', onResponse as any);
    });

    await test.step('09. Submit OTP (ใช้ stub - ไม่ยิง DB จริง)', async () => {
      // Wait longer for OTP input to appear (payment page may take time)
      const otpLocator = page.locator('#otp-input');
      try {
        await otpLocator.waitFor({ state: 'visible', timeout: 15000 });
      } catch (err) {
        // If OTP not visible, capture debug info and throw to fail the test with context
        const url = page.url();
        throw new Error(`OTP input did not appear within 15s. Current URL: ${url}. See earlier logs for network events.`);
      }

      // If visible, use the page object method to submit
      await checkoutPage.submitOTP(OTP_CODE);
    });

    await test.step('10. ลงทะเบียนอีเมล/โทร (ใช้ stub)', async () => {
      // ใช้ stub endpoint ที่เซ็ตไว้
      await checkoutPage.subscribeToNotification(NOTIFICATION_EMAIL, NOTIFICATION_MOBILE);
    });

    await test.step('11. (Optional) Clean up stubs', async () => {
      await checkoutPage.clearStubs();
    });
  });
});