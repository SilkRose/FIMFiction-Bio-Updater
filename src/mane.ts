import puppeteer from "puppeteer";
import readlineSync from "readline-sync";
import "@total-typescript/ts-reset";

const name_selector = 'input[name="username"]';
const password_selector = 'input[name="password"]';
const login_selector = "button.styled_button i.fa.fa-sign-in";
const edit_selector =
	'a.styled_button.styled_button_brown.edit-link[data-click="showEdit"]';
const text_field_selector = 'input[name="bio"]';
const save_selector = "button.styled_button i.fa.fa-save";

async function mane() {
	const browser = await puppeteer.launch({
		headless: "shell",
	});
	const page = await browser.newPage();
	await page.goto("https://www.fimfiction.net/", {
		waitUntil: "load",
	});
	await page.type(name_selector, input_username());
	await page.type(password_selector, input_password());
	await page.click(login_selector);
	await page.waitForNavigation();
	const user_profile_link = await page.evaluate(() => {
		const element = document.querySelector(".user_toolbar .fa-user");
		return element!.parentElement!.getAttribute("href");
	});
	await page.goto("https://www.fimfiction.net" + user_profile_link, {
		waitUntil: "load",
	});
	await page.click(edit_selector);
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
