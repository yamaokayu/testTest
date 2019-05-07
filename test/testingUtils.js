import curl from 'curl';
import puppeteer from 'puppeteer';

const url = 'http://0.0.0.0:8000';
const retryWaitSeconds = 5;

const curlTest = () => new Promise(resolve => curl.get(url, {}, err => resolve(!err)));

export const sleep = waitSeconds =>
    new Promise(resolve => {
        setTimeout(() => {
            resolve();
        }, waitSeconds * 1000);
    });

/**
 * @returns {Promise<*[Puppeteer.Browser, Puppeteer.Page]>}
 */
async function browserSetup() {
    const browser = await puppeteer.launch({headless: true});
    const page = await browser.newPage();
    await Promise.all([page.waitForNavigation(), page.goto(url)]);
    return [browser, page];
}

/**
 * @param {number} retryCount
 * @returns {Promise<*[Puppeteer.Browser, Puppeteer.Page]>}
 */
export async function waitReady(retryCount) {
    if (retryCount < 0) {
        return null;
    }
    let result = false;
    while (--retryCount >= 0 && !result) {
        result = await curlTest();
        if (!result) {
            await sleep(retryWaitSeconds);
        }
    }
    if (!result) {
        return null;
    }
    const [browser, page] = await browserSetup();
    return [browser, page];
}

/**
 * @param {Puppeteer.Page} page
 * @returns {string}
 */
export async function waitFinished(page) {
    await sleep(4);
    const resultHandle = await page.$('p#result');
    const result = await page.evaluate(element => element.innerText, resultHandle);
    return result;
}
