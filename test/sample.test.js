import {waitReady, waitFinished} from './testingUtils';
import assert from 'assert';
import chai from 'chai';
const expect = chai.expect;
chai.should();

/**
 * @param {Puppeteer.Page} page
 */
function browserTest(page) {
    console.log('browserTest1');
    it('browser values()', async () => {
        console.log('waitFinished');
        const elem = await waitFinished(page);
        console.log('evaluate');
        const scrapingData = await page.evaluate(() => {
            const dataList = [];
            const nodeList = document.querySelectorAll('.result');
            nodeList.forEach(_node => {
                dataList.push(_node.innerText);
            });
            return dataList;
        });
        console.log(scrapingData);
    });
}

/**
 */
function testing() {
    console.log('testing');
    describe('client test()', () => {
        let page = undefined;
        let browser = undefined;
        before(async () => {
            if (!page) {
                [browser, page] = await waitReady(5);
            }
        });

        it('browser result()', async () => {
            const result = await waitFinished(page);
            expect(result).to.equal('OK');
        });
        // ...
        after(async() => {
            await browser.close();
        });
    });
}

async function startTesting(cb) {
    const page = await waitReady(5);
    cb(page);
}

testing();
