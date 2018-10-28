import GridState from '../GridState';
import HeaderStyles from '../HeaderStyles';
import RowStyles from '../RowStyles';
import SpyLineRenderer from '../spies/SpyLineRenderer';
import { IVisibleBoundingBoxes } from '../types';
import GridLineRenderer from './GridLineRenderer';

describe('GridLineRenderer', () => {
    let spyLineRenderer: SpyLineRenderer;
    let gridState: GridState;
    let gridLineRenderer: GridLineRenderer;

    beforeEach(() => {
        gridState = new GridState();
        gridState.styles.headerStyles = new HeaderStyles({
            borderColor: "red"
        });
        gridState.styles.rowStyles = new RowStyles({
            borderColor: "blue"
        });
        spyLineRenderer = new SpyLineRenderer();
        gridLineRenderer = new GridLineRenderer(spyLineRenderer, gridState);
    });

    describe('header lines', () => {
        const cellBoundingBoxes = {
            headers: [{
                key: "col-1",
                x: 0,
                y: 0,
                width: 10,
                height: 10
            }, {
                key: "col-2",
                x: 10,
                y: 0,
                width: 30,
                height: 10
            }],
            rows: []
        };
        it('should render a horizontal line across the total header width at 0 and the header height in the correct color', () => {
            gridLineRenderer.render(cellBoundingBoxes);

            expect(spyLineRenderer.setLineColorCalledWith[0]).toBe("red");
            expect(spyLineRenderer.renderHorizontalLineCalledWith[0].fromX).toBe(0);
            expect(spyLineRenderer.renderHorizontalLineCalledWith[0].toX).toBe(40);
            expect(spyLineRenderer.renderHorizontalLineCalledWith[0].y).toBe(0);
            expect(spyLineRenderer.renderHorizontalLineCalledWith[1].y).toBe(10);
        });

        it('should render vertical lines for each header', () => {
            gridLineRenderer.render(cellBoundingBoxes);

            expect(spyLineRenderer.renderVerticalLineCalledWith[0].fromY).toBe(0);
            expect(spyLineRenderer.renderVerticalLineCalledWith[0].toY).toBe(10);
            expect(spyLineRenderer.renderVerticalLineCalledWith[0].x).toBe(0);
            expect(spyLineRenderer.renderVerticalLineCalledWith[1].fromY).toBe(0);
            expect(spyLineRenderer.renderVerticalLineCalledWith[1].toY).toBe(10);
            expect(spyLineRenderer.renderVerticalLineCalledWith[1].x).toBe(10);
            expect(spyLineRenderer.renderVerticalLineCalledWith[2].fromY).toBe(0);
            expect(spyLineRenderer.renderVerticalLineCalledWith[2].toY).toBe(10);
            expect(spyLineRenderer.renderVerticalLineCalledWith[2].x).toBe(40);
        });
    });

    describe('row lines', () => {
        let cellBoundingBoxes: IVisibleBoundingBoxes;

        beforeEach(() => {
            cellBoundingBoxes = {
                rows: [{
                    key: 0,
                    x: 0,
                    y: gridState.styles.headerStyles.getHeight(),
                    width: 10,
                    height: 10
                }, {
                    key: 0,
                    x: 10,
                    y: gridState.styles.headerStyles.getHeight(),

                    width: 30,
                    height: 10
                }, {
                    key: 1,
                    x: 0,
                    y: gridState.styles.headerStyles.getHeight() + 10,
                    width: 10,
                    height: 10
                }, {
                    key: 1,
                    x: 10,
                    y: gridState.styles.headerStyles.getHeight() + 10,
                    width: 30,
                    height: 10
                }],
                headers: []
            };
        });

        it('should render horizontal lines across the viewport for each row in the correct color', () => {
            gridLineRenderer.render(cellBoundingBoxes);

            expect(spyLineRenderer.setLineColorCalledWith[1]).toBe("blue");
            expect(spyLineRenderer.renderHorizontalLineCalledWith[0].fromX).toBe(0);
            expect(spyLineRenderer.renderHorizontalLineCalledWith[0].toX).toBe(40);
            expect(spyLineRenderer.renderHorizontalLineCalledWith[0].y).toBe(gridState.styles.headerStyles.getHeight());
            expect(spyLineRenderer.renderHorizontalLineCalledWith[1].fromX).toBe(0);
            expect(spyLineRenderer.renderHorizontalLineCalledWith[1].toX).toBe(40);
            expect(spyLineRenderer.renderHorizontalLineCalledWith[1].y).toBe(gridState.styles.headerStyles.getHeight() + 10);
        });

        it('should not render a horizontal line if its y position overlaps with the header', () => {
            cellBoundingBoxes = {
                rows: [{
                    key: 0,
                    x: 0,
                    y: gridState.styles.headerStyles.getHeight() - 5,
                    width: 10,
                    height: 10
                }],
                headers: []
            };
            gridLineRenderer.render(cellBoundingBoxes);

            expect(spyLineRenderer.renderHorizontalLineCalledWith).toHaveLength(0);
        });

        it('should render vertical lines for each row', () => {
            gridLineRenderer.render(cellBoundingBoxes);

            expect(spyLineRenderer.renderVerticalLineCalledWith[0].x).toBe(0);
            expect(spyLineRenderer.renderVerticalLineCalledWith[0].fromY).toBe(gridState.styles.headerStyles.getHeight());
            expect(spyLineRenderer.renderVerticalLineCalledWith[0].toY).toBe(gridState.styles.headerStyles.getHeight() + 10);
            expect(spyLineRenderer.renderVerticalLineCalledWith[1].x).toBe(10);
            expect(spyLineRenderer.renderVerticalLineCalledWith[1].fromY).toBe(gridState.styles.headerStyles.getHeight());
            expect(spyLineRenderer.renderVerticalLineCalledWith[1].toY).toBe(gridState.styles.headerStyles.getHeight() + 10);
            expect(spyLineRenderer.renderVerticalLineCalledWith[2].x).toBe(40);
            expect(spyLineRenderer.renderVerticalLineCalledWith[2].fromY).toBe(gridState.styles.headerStyles.getHeight());
            expect(spyLineRenderer.renderVerticalLineCalledWith[2].toY).toBe(gridState.styles.headerStyles.getHeight() + 10);
            expect(spyLineRenderer.renderVerticalLineCalledWith[3].x).toBe(0);
            expect(spyLineRenderer.renderVerticalLineCalledWith[3].fromY).toBe(gridState.styles.headerStyles.getHeight() + 10);
            expect(spyLineRenderer.renderVerticalLineCalledWith[3].toY).toBe(gridState.styles.headerStyles.getHeight() + 20);
            expect(spyLineRenderer.renderVerticalLineCalledWith[4].x).toBe(10);
            expect(spyLineRenderer.renderVerticalLineCalledWith[4].fromY).toBe(gridState.styles.headerStyles.getHeight() + 10);
            expect(spyLineRenderer.renderVerticalLineCalledWith[4].toY).toBe(gridState.styles.headerStyles.getHeight() + 20);
            expect(spyLineRenderer.renderVerticalLineCalledWith[5].x).toBe(40);
            expect(spyLineRenderer.renderVerticalLineCalledWith[5].fromY).toBe(gridState.styles.headerStyles.getHeight() + 10);
            expect(spyLineRenderer.renderVerticalLineCalledWith[5].toY).toBe(gridState.styles.headerStyles.getHeight() + 20);
        });

        it('should exclude headers from the visible row line area', () => {
            gridLineRenderer.render(cellBoundingBoxes);

            expect(spyLineRenderer.setVisibleAreaCalledWith[0].x).toBe(0);
            expect(spyLineRenderer.setVisibleAreaCalledWith[0].y).toBe(gridState.styles.headerStyles.getHeight());
            expect(spyLineRenderer.setVisibleAreaCalledWith[0].width).toBe(gridState.viewport.width);
            expect(spyLineRenderer.setVisibleAreaCalledWith[0].height).toBe(gridState.viewport.height - gridState.styles.headerStyles.getHeight());
        });
    });
});