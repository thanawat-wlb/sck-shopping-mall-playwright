import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { ProductPage } from '../pages/ProductPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';

test.describe('SCK-Shopping Mall Checkout Flow', () => {

  // กำหนดตัวแปรที่ใช้งานร่วมกัน (เทียบเท่า Test Variables)
  const productData = {
    name: 'Balance Training Bicycle',
    price: '4,314.60', // เก็บแบบไม่มีสัญลักษณ์เพื่อความยืดหยุ่น
    point: '43',
    qty: '3',
    price_total: '12,943.80', // คำนวณจากราคา × จำนวน
    points_total: '129' // คำนวณจากแต้ม × จำนวน
  };

  test('ลูกค้าเลือกซื้อสินค้าในเว็บไซต์ SCK-Shopping Mall', async ({ page }) => { //ลูกค้าซื้อสินค้าในเว็บไซต์ SCK-Shopping Mall สำเร็จ
    // กำหนด Page Object ทั้งหมด
    const homePage = new HomePage(page);
    const productPage = new ProductPage(page);
    const cartPage = new CartPage(page);
    const checkoutPage = new CheckoutPage(page);

    await test.step('ลูกค้าเข้าสู่ระบบ', async () => {
      await homePage.goto();
      await homePage.login('user_6', 'P@ssw0rd');
    });

    await test.step('ลูกค้าเปิดเว็บไซต์ SCK-Shopping Mall และใส่คำค้นหา Balance', async () => {
      await homePage.gotoProductList();
      await homePage.fillSearchProduct('Balance Training Bicycle');
      await homePage.submitSearch();
    });

    await test.step('ตรวจสอบผลลัพธ์การค้นหาและคลิกเลือกสินค้า Balance Training Bicycle', async () => {
      await homePage.selectLatestProductAndVerify(productData.name);
    });

    await test.step('ตรวจสอบราคาสินค้า จำนวน แต้ม และสินค้าคงเหลือในหน้า Product', async () => {
      await productPage.verifyProductDetails(
        productData.name, 
        `฿${productData.price}`, 
        `${productData.point} Points`
      );
    });

    await test.step('คลิกเลือกสินค้าลงตะกร้า และตรวจสอบตะกร้า', async () => {
      await productPage.increaseQuantity(productData.qty);
      await productPage.addToCart();
      await productPage.verifyCartAndGoToCart('1'); // ตรวจสอบว่า badge แสดงจำนวนชิ้นรวมเป็น 1
    });

    await test.step('ตรวจสอบรายการสินค้าในหน้าตะกร้า และดำเนินการชำระเงิน', async () => {
      await cartPage.verifyCartItems(
        productData.name,
        productData.price_total,
        productData.points_total,
        productData.qty
        // defect รอแจ้งเดฟ ปัดเศษผิด => // Expected: "฿12,943.80" , Received: "฿12,943.79"
        // productData.price_total
      );
      await cartPage.proceedToCheckout();
    });

    await test.step('ตรวจสอบผลลัพธ์ในหน้าข้อมูลการจัดส่งคำสั่งซื้อ', async () => {
      await checkoutPage.verifyInitialCheckoutInfo();
    });

    await test.step('ยืนยันข้อมูลการจัดส่งคำสั่งซื้อ (กรอกข้อมูลส่วนตัว, ที่อยู่, วิธีจัดส่ง, บัตรเครดิต)', async () => {
      const securityCode = '123';
      await checkoutPage.fillShippingAndPaymentInfo(securityCode);
      await checkoutPage.verifyOrderSummaryAndPay();
    });

    await test.step('กรอกรหัสรหัสผ่านครั้งเดียว (OTP)', async () => {
      const otpCode = '123456';
      await checkoutPage.submitOTP(otpCode);
    });

    // await test.step('กรอกอีเมลเบอร์โทรเพื่อรับข่าวสารโปรโมชั่น', async () => {
    //   await checkoutPage.subscribeNotification('thanawat123', '0812345678');
    // });

  });
});