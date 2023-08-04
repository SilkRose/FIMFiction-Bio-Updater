import puppeteer, { Page } from "puppeteer";
import readlineSync from "readline-sync";
import { promises as fsPromises } from "fs";
import fs from "fs";

async function mane() {
    const browser = await puppeteer.launch({
        headless: "new",
    });
    const page = await browser.newPage();

    await check_cookies(page);

    await page.goto("https://www.fimfiction.net/", {
        waitUntil: "load",
    });

    await check_login(page);

    await page.goto("https://www.fimfiction.net/manage/stories", {
        waitUntil: "load",
    });

    await browser.close();
}

async function login(page: any) {
    const login_button = await page.$x("//button[contains(., 'Log In')]");
    await page.focus('input[name="username"]');
    await page.type('input[name="username"]', input_username());
    await page.focus('input[name="password"]');
    await page.type('input[name="password"]', input_password());
    await login_button[0].click();
    const success = await page.evaluate(() => {
        return !!!document.querySelector(".error-message");
    });
    if (!success) {
        await page.waitForSelector(".error-message");
        let error = await page.$(".error-message");
        let text = await page.evaluate(
            (el: { textContent: any }) => el.textContent,
            error
        );
        console.log(text);
    } else {
        const cookies = await page.cookies();
        await fsPromises.writeFile("cookies.json", JSON.stringify(cookies));
    }
}

async function check_cookies(page: Page) {
    if (fs.existsSync("./cookies.json")) {
        const cookies = JSON.parse(
            (await fsPromises.readFile("./cookies.json")).toString()
        );
        await page.setCookie(...cookies);
    }
}

async function check_login(page: Page) {
    const logged_in = (await page.$('input[name="username"]')) == null;
    if (logged_in) {
        console.log("User is logged in.");
    } else {
        console.log("User is not logged in.");
        await login(page);
    }
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
