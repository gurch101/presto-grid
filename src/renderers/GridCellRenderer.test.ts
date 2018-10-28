import CellStyles from '../CellStyles';
import GridState from '../GridState';
import HeaderStyles from '../HeaderStyles';
import RowModel from '../RowModel';
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
        gridState.headerStyles = new HeaderStyles({});
        gridState.cellStyles = new CellStyles({horizontalPadding});
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
        it('should render header text for all visible headers', () => {
            gridCellRenderer.render({
                headers: [{
                    key: "col1",
                    x: 0,
                    y: 0,
                    width: 10,
                    height: 10
                }, {
                    key: "col2",
                    x: 10,
                    y: 0,
                    width: 10,
                    height: 10
                }],
                rows: []
            });

            expect(spyCellRenderer.renderTextCalledWith[0].text).toBe("Column 1");
            expect(spyCellRenderer.renderTextCalledWith[1].text).toBe("Column 2");
        });

        it('should render header text at the proper position and alignment', () => {
            gridCellRenderer.render({
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
            });

            expect(spyCellRenderer.renderTextCalledWith[0].align).toBe(Alignment.Center);
            expect(spyCellRenderer.renderTextCalledWith[0].x).toBe(30 / 2);
            expect(spyCellRenderer.renderTextCalledWith[1].align).toBe(Alignment.Left);
            expect(spyCellRenderer.renderTextCalledWith[1].x).toBe(30 + horizontalPadding);
            expect(spyCellRenderer.renderTextCalledWith[2].align).toBe(Alignment.Right);
            expect(spyCellRenderer.renderTextCalledWith[2].x).toBe(60 + 30 - horizontalPadding);
        });
    });

    describe('row cells', () => {
        beforeEach(() => {
            gridState.rowModel.setRows([{
                col1: "some value 1",
                col2: "some value 2",
                col3: "some value 3"
            }]);
        });

        it('should render row cell text for all visible rows', () => {
            gridCellRenderer.render({
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
            });

            expect(spyCellRenderer.renderTextCalledWith[3].text).toBe("some value 1");
            expect(spyCellRenderer.renderTextCalledWith[4].text).toBe("some value 2");
            expect(spyCellRenderer.renderTextCalledWith[5].text).toBe("some value 3");
        });

        it('should render row cell text at the proper position and alignment', () => {
            gridCellRenderer.render({
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
            });

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
            expect(spyCellRenderer.setVisibleAreaCalledWith[0].y).toBe(gridState.headerStyles.getHeaderHeight());
            expect(spyCellRenderer.setVisibleAreaCalledWith[0].width).toBe(gridState.viewport.width);
            expect(spyCellRenderer.setVisibleAreaCalledWith[0].height).toBe(gridState.viewport.height - gridState.headerStyles.getHeaderHeight());
        });
    })
});