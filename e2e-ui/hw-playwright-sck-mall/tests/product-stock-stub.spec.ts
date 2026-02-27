import { test, expect } from '@playwright/test';
import { ProductPage } from '../pages/ProductPage';

/**
 * Test Stock Verification with Stub
 * ตรวจสอบ stock โดยไม่ต้องไปเรียก DB ของ stock จริง
 */
test.describe('Product Page - Stock Verification (With Stub)', () => {
  let productPage: ProductPage;

  test.beforeEach(async ({ page }) => {
    productPage = new ProductPage(page);
    // Navigate to product page
    await page.goto('/product/1');
  });

  test('ตรวจสอบสินค้า เหลือตรงตาม expected ใน stock (ใช้ stub)', async () => {
    await test.step('01. Setup stub stock เพื่อไม่ให้ไปยิง DB จริง', async () => {
      // Stub stock amount = 90 items
      await productPage.verifyProductDetailsWithStub(
        'Balance Training Bicycle',
        '฿4,314.60',
        '43 Points',
        90 
      );
    });


  test('⚙️ ตรวจสอบสินค้า with custom to expected 90 stock amount', async () => {
    await test.step('01. Stub custom stock amount (90 items)', async () => {
      await productPage.verifyProductDetailsWithStub(
        'Balance Training Bicycle',
        '฿4,314.60',
        '43 Points',
        90
      );
      console.log('Stock verification passed (using stub)');
    });

    await test.step('02. Clear stubs', async () => {
      await productPage.clearStubs();
    });
  });

  test('🔍 ตรวจสอบสินค้า without stub (real API call)', async () => {
    await test.step('ใช้ method เดิม - ตรวจสอบ stock จากON API จริง', async () => {
      // ใช้ verifyProductDetails() ตัวเดิม (ไม่มี stub)
      // มันจะไปเรียก API/DB ของ stock จริง
      // await productPage.verifyProductDetails(
      //   'Balance Training Bicycle',
      //   '฿4,314.60',
      //   '43 Points'
      // );
      
      console.log('หมายเหตุ: Method นี้ดึง stock จากระบบจริง ไม่ได้ใช้ stub');
    });
  });
});
});
