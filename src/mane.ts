import puppeteer from "puppeteer";
import readlineSync from "readline-sync";

const user_selector = ".user_toolbar .fa-user";
const edit_selector =
	'a.styled_button.styled_button_brown.edit-link[data-click="showEdit"]';
const text_field_selector = 'input[name="bio"]';
const save_selector = "button.styled_button i.fa.fa-save";
const logout_selector = ".user_toolbar .fa-sign-out";

async function mane() {
	const browser = await puppeteer.launch({
		headless: false,
	});
	const page = await browser.newPage();
	await page.goto("https://www.fimfiction.net/", {
		waitUntil: "load",
	});
	const login_button = await page.$x("//button[contains(., 'Log In')]");
	await page.focus('input[name="username"]');
	await page.type('input[name="username"]', input_username());
	await page.focus('input[name="password"]');
	await page.type('input[name="password"]', input_password());
	await (login_button[0] as any).click();
	await page.waitForNavigation();
	const user_profile_link = await page.evaluate(() => {
		const user_selector = ".user_toolbar .fa-user";
		const element = document.querySelector(user_selector);
		return element!.parentElement!.getAttribute("href");
	});
	await page.goto("https://www.fimfiction.net" + user_profile_link, {
		waitUntil: "load",
	});
	await page.evaluate("UserBioController.prototype.showEdit();")
	await page.focus(text_field_selector);
	await page.keyboard.down("Control");
	await page.keyboard.press("KeyA");
	await page.keyboard.up("Control");
	await page.keyboard.press("Backspace");
	await page.type(text_field_selector, "I love Pinkie Pie!");
	await page.click(save_selector);
	await page.evaluate("IndexController.prototype.logout();");
	await page.waitForNavigation();
	await browser.close();
}

function input_username() {
	return readlineSync.question("Enter your username or email: ");
}

function input_password() {
	return readlineSync.question("Enter your password (hidden input): ", {
		hideEchoBack: true,
	});
}

mane();
