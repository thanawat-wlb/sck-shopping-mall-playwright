import { test } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { ProductPage } from '../pages/ProductPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';

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

// ===== Test Suite =====
test.describe('SCK-Shopping Mall - Complete Checkout Flow', () => {
  test('ลูกค้าสามารถซื้อสินค้าในเว็บไซต์ SCK-Shopping Mall ได้สำเร็จ', async ({ page }) => {
    // Init Page Objects
    const homePage = new HomePage(page);
    const productPage = new ProductPage(page);
    const cartPage = new CartPage(page);
    const checkoutPage = new CheckoutPage(page);

    await test.step('01. ลูกค้าเข้าสู่ระบบ', async () => {
      await homePage.gotoLoginPage();
      await homePage.login('user_6', 'P@ssw0rd');
    });

    await test.step('02. ไปที่หน้าค้นหาสินค้าและค้นหา "Balance Training Bicycle"', async () => {
      await homePage.gotoProductList();
      await homePage.fillSearchKeyword(PRODUCT_DATA.name);
      await homePage.submitSearchKeyword();
    });

    await test.step('03. เลือกสินค้าจากผลลัพธ์การค้นหา', async () => {
      await homePage.selectProductByName(PRODUCT_DATA.name);
    });

    await test.step('04. ตรวจสอบรายละเอียดสินค้า', async () => {
      await productPage.verifyProductDetails(
        PRODUCT_DATA.name,
        `฿${PRODUCT_DATA.price}`,
        `${PRODUCT_DATA.point} Points`
      );
    });

    await test.step('05. เพิ่มสินค้าลงตะกร้า', async () => {
      await productPage.increaseQuantityTo(PRODUCT_DATA.qty);
      await productPage.addToCart();
      await productPage.verifyCartCountAndNavigateToCart('1');
    });

    await test.step('06. ตรวจสอบข้อมูลสินค้าในตะกร้า', async () => {
      await cartPage.verifyCartItems(
        PRODUCT_DATA.name,
        PRODUCT_DATA.price_total,
        PRODUCT_DATA.points_total,
        PRODUCT_DATA.qty
      );
      await cartPage.proceedToCheckout();
    });

    await test.step('07. ตรวจสอบข้อมูลสินค้าในหน้า Checkout', async () => {
      await checkoutPage.verifyInitialCheckoutInfo();
    });

    await test.step('08. กรอกข้อมูลการจัดส่งและบัตรเครดิต', async () => {
      await checkoutPage.fillShippingAndPaymentInfo(PAYMENT_DATA.cvv);
    });

    await test.step('09. ตรวจสอบ Order Summary และชำระเงิน', async () => {
      await checkoutPage.verifyOrderSummaryAndPay();
    });

    await test.step('10. กรอกรหัส OTP', async () => {
      await checkoutPage.submitOTP(OTP_CODE);
    });

    await test.step('11. ลงทะเบียนอีเมลและเบอร์โทรเพื่อรับข่าวสาร', async () => {
      await checkoutPage.subscribeToNotification(NOTIFICATION_EMAIL, NOTIFICATION_MOBILE);
    });
  });
});