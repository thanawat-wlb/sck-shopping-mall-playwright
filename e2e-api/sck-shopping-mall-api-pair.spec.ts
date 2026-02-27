import { test, expect } from '@playwright/test';

test("ลูกค้าเข้าสู่ระบบ หาสินค้าชื่อ balance training bicycle 3 ชิ้น เพิ่มลงตะกร้า กด checkout และดำเนินการสั่งซื้อสำเร็จ", async ( { request } ) => {

  const responseLogin = await request.post("http://139.59.225.96/api/v1/login", {
		data: {
			"username" : "user_6",
			"password" : "P@ssw0rd"
		}
	});
	expect(responseLogin.ok()).toBeTruthy();
	expect((await responseLogin.json()).access_token).toBeTruthy();
	const accessToken = (await responseLogin.json()).access_token;
	
	const responseSearchProduct = await request.get("http://139.59.225.96/api/v1/product?q=Bicycle&offset=0&limit=20", {
		headers: {
		"Authorization" : "Bearer " + accessToken,
		}
	}
	);
	expect(responseSearchProduct.ok()).toBeTruthy();
	expect((await responseSearchProduct.json()).products[0].product_name).toBe("Balance Training Bicycle");
	expect((await responseSearchProduct.json()).products[0].product_price_thb).toBe(4314.6);

});