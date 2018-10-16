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

const getColumnProps = async () => {
    return await page.evaluate(() => {
        return JSON.parse(document.querySelector('[data-schema]').value)
    });
};

const setColumnProps = async (newColumnProps) => {
    await page.evaluate((newColumnProps) => {
       document.querySelector('[data-schema]').value = '';
       document.querySelector('[data-schema]').value = JSON.stringify(newColumnProps, null, 2);
    }, newColumnProps);

    await page.type('[data-schema]', ' ', {delay: 0});

    return await page.click('[data-apply-changes]');
};

describe('ProntoGrid', () => {
    let columnProps;
    let originalColumnProps;
    beforeAll(async () => {
        await page.goto('http://localhost:3000');
        originalColumnProps = [...await getColumnProps()];
    });

    beforeEach(async () => {
        await scrollTo(0, 0);
        columnProps = originalColumnProps;
    });

    describe('sticky headers', () => {
        it('should render aligned headers when scrolling right and down', async () => {
            await scrollTo(500, 500);
            const grid = await getScreenshotOfGrid();

            expect(grid).toMatchImageSnapshot();
        });
    });

    describe('column styles', () => {
        it('should render left-aligned columns', async () => {
            columnProps[0].align = 'left'
            await setColumnProps(columnProps);
            const grid = await getScreenshotOfGrid();

            expect(grid).toMatchImageSnapshot();
        });

        it('should render centered columns', async () => {
            const columnProps = await getColumnProps();
            columnProps[0].align = 'center'
            await setColumnProps(columnProps);
            const grid = await getScreenshotOfGrid();

            expect(grid).toMatchImageSnapshot();
        });

        it('should render right-aligned columns', async () => {
            const columnProps = await getColumnProps();
            columnProps[0].align = 'right'
            await setColumnProps(columnProps);
            const grid = await getScreenshotOfGrid();

            expect(grid).toMatchImageSnapshot();
        });
    });
});