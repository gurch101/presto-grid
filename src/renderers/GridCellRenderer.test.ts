import GridState from '../GridState';
import HeaderStyles from '../HeaderStyles';
import RowModel from '../RowModel';
import RowStyles from '../RowStyles';
import SpyCellRenderer from "../spies/SpyCellRenderer";
import { Alignment } from '../types';
import GridCellRenderer from './GridCellRenderer';

describe('GridCellRenderer', () => {
    let spyCellRenderer: SpyCellRenderer;
    let gridState: GridState;
    let gridCellRenderer: GridCellRenderer;
    const horizontalPadding = 10;

    beforeEach(() => {
        spyCellRenderer = new SpyCellRenderer();
        gridState = new GridState();
        gridState.styles.headerStyles = new HeaderStyles({
            backgroundColor: "red",
            color: "white"
        });
        gridState.styles.rowStyles = new RowStyles({
            horizontalPadding,
            backgroundColor: "green",
            color: "black"
        });
        gridState.schema = [{
            key: "col1",
            label: "Column 1",
            align: Alignment.Center
        }, {
            key: "col2",
            label: "Column 2",
            align: Alignment.Left
        }, {
            key: "col3",
            label: "Column 3",
            align: Alignment.Right
        }];
        gridState.rowModel = new RowModel();
        gridState.rowModel.setSchema(gridState.schema);
        gridCellRenderer = new GridCellRenderer(spyCellRenderer, gridState);
    });

    describe('header cells', () => {
        const visibleBoundingBoxes = {
            headers: [{
                key: "col1",
                x: 0,
                y: 0,
                width: 30,
                height: 10
            }, {
                key: "col2",
                x: 30,
                y: 0,
                width: 30,
                height: 10
            }, {
                key: "col3",
                x: 60,
                y: 0,
                width: 30,
                height: 10
            }],
            rows: []
        };
        it('should render header text in the correct font color for all visible headers', () => {
            gridCellRenderer.render(visibleBoundingBoxes);

            expect(spyCellRenderer.renderTextCalledWith[0].text).toBe("Column 1");
            expect(spyCellRenderer.renderTextCalledWith[1].text).toBe("Column 2");
            expect(spyCellRenderer.setFontCalledWith[0].color).toBe("white");
            expect(spyCellRenderer.setFontCalledWith[1].color).toBe("white");
        });

        it('should render header text at the proper position and alignment', () => {
            gridCellRenderer.render(visibleBoundingBoxes);

            expect(spyCellRenderer.renderTextCalledWith[0].align).toBe(Alignment.Center);
            expect(spyCellRenderer.renderTextCalledWith[0].x).toBe(30 / 2);
            expect(spyCellRenderer.renderTextCalledWith[1].align).toBe(Alignment.Left);
            expect(spyCellRenderer.renderTextCalledWith[1].x).toBe(30 + horizontalPadding);
            expect(spyCellRenderer.renderTextCalledWith[2].align).toBe(Alignment.Right);
            expect(spyCellRenderer.renderTextCalledWith[2].x).toBe(60 + 30 - horizontalPadding);
        });

        it('should fill header cells with the header background color', () => {
            gridCellRenderer.render(visibleBoundingBoxes);

            visibleBoundingBoxes.headers.forEach((header, i) => {
                expect(spyCellRenderer.fillCellCalledWith[i].color).toBe("red");
                expect(spyCellRenderer.fillCellCalledWith[i].x).toBe(header.x);
                expect(spyCellRenderer.fillCellCalledWith[i].y).toBe(header.y);
                expect(spyCellRenderer.fillCellCalledWith[i].width).toBe(header.width);
                expect(spyCellRenderer.fillCellCalledWith[i].height).toBe(header.height);
            });
        });
    });

    describe('row cells', () => {
        const visibleBoundingBoxes = {
            rows: [{
                key: 0,
                x: 0,
                y: 10,
                width: 30,
                height: 10
            }, {
                key: 0,
                x: 30,
                y: 10,
                width: 30,
                height: 10
            }, {
                key: 0,
                x: 60,
                y: 10,
                width: 30,
                height: 10
            }],
            headers: [{
                key: "col1",
                x: 0,
                y: 0,
                width: 30,
                height: 10
            }, {
                key: "col2",
                x: 30,
                y: 0,
                width: 30,
                height: 10
            }, {
                key: "col3",
                x: 60,
                y: 0,
                width: 30,
                height: 10
            }]
        };

        beforeEach(() => {
            gridState.rowModel.setRows([{
                col1: "some value 1",
                col2: "some value 2",
                col3: "some value 3"
            }]);
        });

        it('should render row cell text in the correct font color for all visible rows', () => {
            gridCellRenderer.render(visibleBoundingBoxes);

            expect(spyCellRenderer.renderTextCalledWith[3].text).toBe("some value 1");
            expect(spyCellRenderer.renderTextCalledWith[4].text).toBe("some value 2");
            expect(spyCellRenderer.renderTextCalledWith[5].text).toBe("some value 3");
            expect(spyCellRenderer.setFontCalledWith[3].color).toBe("black");
            expect(spyCellRenderer.setFontCalledWith[4].color).toBe("black");
            expect(spyCellRenderer.setFontCalledWith[5].color).toBe("black");
        });

        it('should render row cell text at the proper position and alignment', () => {
            gridCellRenderer.render(visibleBoundingBoxes);

            expect(spyCellRenderer.renderTextCalledWith[3].align).toBe(Alignment.Center);
            expect(spyCellRenderer.renderTextCalledWith[3].x).toBe(30 / 2);
            expect(spyCellRenderer.renderTextCalledWith[4].align).toBe(Alignment.Left);
            expect(spyCellRenderer.renderTextCalledWith[4].x).toBe(30 + horizontalPadding);
            expect(spyCellRenderer.renderTextCalledWith[5].align).toBe(Alignment.Right);
            expect(spyCellRenderer.renderTextCalledWith[5].x).toBe(60 + 30 - horizontalPadding);
        });

        it('should exclude headers from the visible row text area', () => {
            gridCellRenderer.render({
                headers: [],
                rows: []
            });

            expect(spyCellRenderer.setVisibleAreaCalledWith[0].x).toBe(0);
            expect(spyCellRenderer.setVisibleAreaCalledWith[0].y).toBe(gridState.styles.headerStyles.getHeight());
            expect(spyCellRenderer.setVisibleAreaCalledWith[0].width).toBe(gridState.viewport.width);
            expect(spyCellRenderer.setVisibleAreaCalledWith[0].height).toBe(gridState.viewport.height - gridState.styles.headerStyles.getHeight());
        });

        it('should fill row cells with the row background color', () => {
            gridCellRenderer.render(visibleBoundingBoxes);
            visibleBoundingBoxes.rows.forEach((cell, i) => {
                expect(spyCellRenderer.fillCellCalledWith[i + 3].color).toBe("green");
                expect(spyCellRenderer.fillCellCalledWith[i + 3].x).toBe(cell.x);
                expect(spyCellRenderer.fillCellCalledWith[i + 3].y).toBe(cell.y);
                expect(spyCellRenderer.fillCellCalledWith[i + 3].width).toBe(cell.width);
                expect(spyCellRenderer.fillCellCalledWith[i + 3].height).toBe(cell.height);
            });
        });
    })
});