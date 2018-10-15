const { toMatchImageSnapshot } = require('jest-image-snapshot');

expect.extend({ toMatchImageSnapshot });

const getScreenshotOfGrid = async () => {
    const boundingRect = await page.evaluate(() => {
        const rect = document.querySelector('[data-pronto-grid]').getBoundingClientRect();
        return { x: rect.x, y: rect.y, width: rect.width, height: rect.height };
    })
    return await page.screenshot({
        clip: boundingRect
    });
}

const scrollTo = async (x, y) => {
    await page.evaluate((x, y) => {
        document.querySelector('[data-pronto-grid]').scrollTop = y;
        document.querySelector('[data-pronto-grid]').scrollLeft = x;
    }, x, y);
}

describe('sticky headers', () => {
    beforeAll(async () => {
        await page.goto('http://localhost:3000');
    });

    it('it should render aligned headers when scrolling right and down', async () => {
        await scrollTo(500, 500);
        const grid = await getScreenshotOfGrid();

        expect(grid).toMatchImageSnapshot();
    });
});