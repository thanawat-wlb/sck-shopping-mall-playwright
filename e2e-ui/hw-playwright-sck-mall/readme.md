แปลงจาก robot framework เป็น playwright

และจะต้อง รันใน path ที่เป็น project นั้น ในที่นี้คือ 
```
D:\2026\_Project\we_love_bug_\_learn\2week_7_21_02\wllb-workshop-bun\e2e-ui\hw-playwright-sck-mall
```
ซึ่งต้องมีไฟล์ playwright.config.ts นี้ (พวก set script และการอ่าน env ของ playwright)
```
bun x playwright test tests/checkout-flow.spec.ts --ui
```
.
การใช้ POM จะช่วยแยก "โค้ดส่วนที่ใช้ค้นหาหน้าเว็บ (Locators/Actions)" ออกจาก "โค้ดส่วนที่เป็นขั้นตอนการทดสอบ (Test Scenarios)" ทำให้โค้ดอ่านง่าย บำรุงรักษาได้ง่าย และนำกลับมาใช้ใหม่ได้ (Reusable) => (หาวิธีให้แบ่งตาม Flow TestScnearios ไหม?) 

โดยมีโครงสร้างคือ

playwright-sck-mall/
│
├── pages/                  # เก็บ Page Object Model (POM) 
│   ├── HomePage.ts         # จัดการหน้าแรกและการค้นหา
│   ├── ProductPage.ts      # จัดการหน้ารายละเอียดสินค้า
│   ├── CartPage.ts         # จัดการหน้าตะกร้าสินค้า
│   └── CheckoutPage.ts     # จัดการหน้าชำระเงินและ OTP
│
├── tests/                  # เก็บไฟล์ Test Scenarios (เทียบเท่า *** Test Cases ***)
│   └── checkout-flow.spec.ts 
│
├── utils/                  # เก็บฟังก์ชันช่วยเหลือต่างๆ (ถ้ามี)
│   └── helpers.ts          
│
├── data/                   # เก็บ Test Data แยกออกมาจากโค้ด (เช่น ข้อมูลบัตร, ชื่อผู้ซื้อ)
│   └── user-data.json      
│
├── playwright.config.ts    # ไฟล์ตั้งค่าหลัก (เทียบเท่า *** Settings *** และ Variables บางส่วน)
├── package.json
└── tsconfig.json
