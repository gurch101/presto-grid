import CellStyles from '../CellStyles';
import GridState from '../GridState';
import HeaderStyles from '../HeaderStyles';
import RowModel from '../RowModel';
import SpyTextMeasurer from "../spies/SpyTextMeasurer";
import { Alignment, ISchema } from '../types';
import GridCellMeasurer from './GridCellMeasurer';

describe('GridCellMeasurer', () => {
    let textMeasurer: SpyTextMeasurer;
    let cellMeasurer: GridCellMeasurer;
    let schema: ISchema[];
    let gridState: GridState;

    beforeEach(() => {
        schema = [{
            key: "column-key-1",
            label: "column label 1",
            align: Alignment.Center
        }, {
            key: "column-key-2",
            label: "column label 2",
            align: Alignment.Center
        }, {
            key: "column-key-3",
            label: "column label 3",
            align: Alignment.Center
        }];
        textMeasurer = new SpyTextMeasurer();
        gridState = new GridState();
        gridState.headerStyles = new HeaderStyles({});
        gridState.cellStyles = new CellStyles({horizontalPadding: 0});
        gridState.schema = schema;
        gridState.rowModel = new RowModel();
        cellMeasurer = new GridCellMeasurer(textMeasurer, gridState);
        textMeasurer.measureTextReturn.set("column label 1", 10);
        textMeasurer.measureTextReturn.set("column label 2", 10);
        textMeasurer.measureTextReturn.set("column label 3", 10);
    });

    describe('simple header measurements', () => {
        it('should get the text widths for headers within the the current viewport bounding box if all headers fit in the bounding box', () => {
            gridState.viewport = {x: 0, y: 0, width: 30, height: 100};
            const boundingBoxes = cellMeasurer.computeVisibleBoundingBoxes().headers;

            expect(boundingBoxes).toHaveLength(3);
            expect(boundingBoxes.map(box => box.key)).toEqual(schema.map(column => column.key));
            expect(boundingBoxes.map(box => box.width)).toEqual([10, 10, 10]);
            expect(boundingBoxes[0].x).toBe(0);
            expect(boundingBoxes[1].x).toBe(10);
            expect(boundingBoxes[2].x).toBe(20);
        });

        it('should get the text widths for headers within the the current viewport bounding box if only the first two headers fit in the bounding box', () => {
            gridState.viewport = {x: 0, y: 0, width: 20, height: 100};
            const boundingBoxes = cellMeasurer.computeVisibleBoundingBoxes().headers;

            expect(boundingBoxes).toHaveLength(2);
            expect(boundingBoxes.map(box => box.key)).toEqual(['column-key-1', 'column-key-2']);
            expect(boundingBoxes.map(box => box.width)).toEqual([10, 10]);
            expect(boundingBoxes[0].x).toBe(0);
            expect(boundingBoxes[1].x).toBe(10);
        });

        it('should get the text widths for data cells within the current viewport bounding box', () => {
            gridState.viewport = {x: 10, y: 0, width: 20, height: 100};
            const boundingBoxes = cellMeasurer.computeVisibleBoundingBoxes().headers;

            expect(boundingBoxes).toHaveLength(2);
            expect(boundingBoxes.map(box => box.key)).toEqual(['column-key-2', 'column-key-3']);
            expect(boundingBoxes.map(box => box.width)).toEqual([10, 10]);
            expect(boundingBoxes[0].x).toBe(0);
            expect(boundingBoxes[1].x).toBe(10);
        });

        it('should return partially visible columns', () => {
            gridState.viewport = {x: 0, y: 0, width: 20, height: 100};
            let boundingBoxes = cellMeasurer.computeVisibleBoundingBoxes().headers;
            gridState.viewport = {x: 5, y: 0, width: 20, height: 100};
            boundingBoxes = cellMeasurer.computeVisibleBoundingBoxes().headers;

            expect(boundingBoxes).toHaveLength(3);
            expect(boundingBoxes.map(box => box.key)).toEqual(['column-key-1', 'column-key-2', 'column-key-3']);
            expect(boundingBoxes.map(box => box.width)).toEqual([10, 10, 10]);
            expect(boundingBoxes.map(box => box.x)).toEqual([-5, 5, 15]);
        });

        it('should return a column that spans the entire viewport', () => {
            textMeasurer.measureTextReturn.set("column label 2", 100);
            gridState.viewport = {x: 20, y: 0, width: 20, height: 100};
            const boundingBoxes = cellMeasurer.computeVisibleBoundingBoxes().headers;

            expect(boundingBoxes).toHaveLength(1);
            expect(boundingBoxes[0].key).toBe('column-key-2');
            expect(boundingBoxes.map(box => box.width)).toEqual([100]);
            expect(boundingBoxes[0].x).toBe(-10);
        });

        it('should only compute cell widths for columns that are within the viewport', () => {
            const rows = [{
                "column-key-1": "some realllllllllly wide column"
            }];
            textMeasurer.measureTextReturn.set("some realllllllllly wide column", 20);
            textMeasurer.measureTextReturn.set("", 0);
            gridState.rowModel = new RowModel(rows);
            gridState.viewport = {x: 5, y: 0, width: 20, height: 100};

            const boundingBoxes = cellMeasurer.computeVisibleBoundingBoxes().headers;

            const numColumnsMeasured = 3;
            const numCellsMeasured = 2;
            expect(textMeasurer.measureTextCallCount).toBe(numColumnsMeasured + numCellsMeasured);
        });

        it('should not compute cell widths for rows fully hidden by the header', () => {
            gridState.headerStyles = new HeaderStyles({fontSize: 20, verticalPadding: 10});
            gridState.cellStyles = new CellStyles({fontSize: 10, verticalPadding: 5, horizontalPadding: 0});
            gridState.viewport = {x: 0, y: 20, width: 30, height: 100};

            const rows = [{
                "column-key-1": "row 1"
            },{
                "column-key-1": "row 2"
            }];

            gridState.rowModel = new RowModel(rows);
            const boundingBoxes = cellMeasurer.computeVisibleBoundingBoxes().headers;

            const numColumnsMeasured = 3;
            const numCellsMeasured = 3;
            expect(textMeasurer.measureTextCallCount).toBe(numColumnsMeasured + numCellsMeasured);
        });

        it('should compute cell widths for rows partially hidden by the header', () => {
            // header height = 40
            gridState.headerStyles = new HeaderStyles({fontSize: 20, verticalPadding: 10});
            // cell height = 20
            gridState.cellStyles = new CellStyles({fontSize: 10, verticalPadding: 5, horizontalPadding: 0});
            gridState.viewport = {x: 0, y: 10, width: 30, height: 100};

            const rows = [{
                "column-key-1": "row 1"
            },{
                "column-key-1": "row 2"
            }];

            gridState.rowModel = new RowModel(rows);
            const boundingBoxes = cellMeasurer.computeVisibleBoundingBoxes().headers;

            const numColumnsMeasured = 3;
            const numCellsMeasured = 6;
            expect(textMeasurer.measureTextCallCount).toBe(numColumnsMeasured + numCellsMeasured);
        });

        it('should not compute cell widths for rows that are beyond the viewport height', () => {
            // header height = 40
            gridState.headerStyles = new HeaderStyles({fontSize: 20, verticalPadding: 10});
            // cell height = 70
            gridState.cellStyles = new CellStyles({fontSize: 30, verticalPadding: 20, horizontalPadding: 0});
            gridState.viewport = {x: 0, y: 10, width: 30, height: 100};

            const rows = [{
                "column-key-1": "row 1"
            },{
                "column-key-1": "row 2"
            }];

            gridState.rowModel = new RowModel(rows);
            const boundingBoxes = cellMeasurer.computeVisibleBoundingBoxes().headers;

            const numColumnsMeasured = 3;
            const numCellsMeasured = 3;
            expect(textMeasurer.measureTextCallCount).toBe(numColumnsMeasured + numCellsMeasured);
        });

        it('should use header widths when data cell width is less than the header', () => {
            const rows = [{
                "column-key-1": "narrow"
            }];
            textMeasurer.measureTextReturn.set("narrow", 5);
            textMeasurer.measureTextReturn.set("", 0);
            gridState.rowModel = new RowModel(rows);
            gridState.viewport = {x: 5, y: 0, width: 30, height: 100};

            const boundingBoxes = cellMeasurer.computeVisibleBoundingBoxes().headers;

            expect(boundingBoxes).toHaveLength(3);
            expect(boundingBoxes[0].key).toBe("column-key-1");
            expect(boundingBoxes[0].x).toBe(-5);
            expect(boundingBoxes[0].width).toBe(10);
            expect(boundingBoxes[1].key).toBe("column-key-2");
            expect(boundingBoxes[1].width).toBe(10);
            expect(boundingBoxes[1].x).toBe(5);
            expect(boundingBoxes[2].key).toBe("column-key-3");
            expect(boundingBoxes[2].width).toBe(10);
            expect(boundingBoxes[2].x).toBe(15);
        });

        it('should use data cell widths when data cell width is wider than the header', () => {
            const rows = [{
                "column-key-1": "some realllllllllly wide column"
            }];
            textMeasurer.measureTextReturn.set("some realllllllllly wide column", 20);
            textMeasurer.measureTextReturn.set("", 0);
            gridState.rowModel = new RowModel(rows);
            gridState.viewport = {x: 5, y: 0, width: 30, height: 100};

            const boundingBoxes = cellMeasurer.computeVisibleBoundingBoxes().headers;

            expect(boundingBoxes).toHaveLength(3);
            expect(boundingBoxes[0].key).toBe("column-key-1");
            expect(boundingBoxes[0].x).toBe(-5);
            expect(boundingBoxes[0].width).toBe(20);
            expect(boundingBoxes[1].key).toBe("column-key-2");
            expect(boundingBoxes[1].width).toBe(10);
            expect(boundingBoxes[1].x).toBe(15);
            expect(boundingBoxes[2].key).toBe("column-key-3");
            expect(boundingBoxes[2].width).toBe(10);
            expect(boundingBoxes[2].x).toBe(25);
        });
    });

    describe('fixed header measurements', () => {
        it('should include fixed columns in the list of visible headers', () => {
            gridState.viewport = {x: 5, y: 0, width: 20, height: 100};
            gridState.fixedColumnCount = 1;
            const boundingBoxes = cellMeasurer.computeVisibleBoundingBoxes().headers;

            expect(boundingBoxes).toHaveLength(3);
            expect(boundingBoxes.map(box => box.key)).toEqual(['column-key-1', 'column-key-2', 'column-key-3']);
            expect(boundingBoxes.map(box => box.width)).toEqual([10, 10, 10]);
            expect(boundingBoxes[0].x).toBe(0);
            expect(boundingBoxes[1].x).toBe(5);
            expect(boundingBoxes[2].x).toBe(15);
        });

        it('should only include fixed columns once if x = 0', () => {
            gridState.viewport = {x: 0, y: 0, width: 30, height: 100};
            gridState.fixedColumnCount = 1;
            const boundingBoxes = cellMeasurer.computeVisibleBoundingBoxes().headers;

            expect(boundingBoxes).toHaveLength(3);
            expect(boundingBoxes.map(box => box.key)).toEqual(['column-key-1', 'column-key-2', 'column-key-3']);
            expect(boundingBoxes.map(box => box.width)).toEqual([10, 10, 10]);
            expect(boundingBoxes[0].x).toBe(0);
            expect(boundingBoxes[1].x).toBe(10);
            expect(boundingBoxes[2].x).toBe(20);
        });
    });

    describe('simple cell measurements', () => {
        it('should offset the cell y position by the header height when viewport y = 0', () => {
            const rows = [{
                "column-key-1": "c1",
                "column-key-2": "c2",
                "column-key-3": "c3",
            }];
            textMeasurer.measureTextReturn.set("c1", 5);
            textMeasurer.measureTextReturn.set("c2", 5);
            textMeasurer.measureTextReturn.set("c3", 5);
            gridState.rowModel = new RowModel(rows);
            // header height = 30
            gridState.headerStyles = new HeaderStyles({fontSize: 10, verticalPadding: 10});
            // cell height = 20
            gridState.cellStyles = new CellStyles({fontSize: 10, verticalPadding: 5, horizontalPadding: 0});
            gridState.viewport = {x: 0, y: 0, width: 30, height: 100};

            const boundingBoxes = cellMeasurer.computeVisibleBoundingBoxes().rows;

            expect(boundingBoxes).toHaveLength(3);
            expect(boundingBoxes[0].y).toBe(30);
            expect(boundingBoxes[1].y).toBe(30);
            expect(boundingBoxes[2].y).toBe(30);
        });

        it('should offset the cell y position by the header height and the viewport y position', () => {
            const rows = [{
                "column-key-1": "c1",
                "column-key-2": "c2",
                "column-key-3": "c3",
            }];
            textMeasurer.measureTextReturn.set("c1", 5);
            textMeasurer.measureTextReturn.set("c2", 5);
            textMeasurer.measureTextReturn.set("c3", 5);
            gridState.rowModel = new RowModel(rows);
            // header height = 30
            gridState.headerStyles = new HeaderStyles({fontSize: 10, verticalPadding: 10});
            // cell height = 20
            gridState.cellStyles = new CellStyles({fontSize: 10, verticalPadding: 5, horizontalPadding: 0});
            gridState.viewport = {x: 0, y: 10, width: 30, height: 100};

            const boundingBoxes = cellMeasurer.computeVisibleBoundingBoxes().rows;

            expect(boundingBoxes).toHaveLength(3);
            expect(boundingBoxes[0].y).toBe(20);
            expect(boundingBoxes[1].y).toBe(20);
            expect(boundingBoxes[2].y).toBe(20);
        });

        it('should return bounding boxes for all visible cells when viewport x = 0 and viewport y = 0', () => {
            const rows = [{
                "column-key-1": "c1",
                "column-key-2": "c2",
                "column-key-3": "c3",
            },{
                "column-key-1": "c1",
                "column-key-2": "c2",
                "column-key-3": "c3",
            },{
                "column-key-1": "c1",
                "column-key-2": "c2",
                "column-key-3": "c3",
            }];
            textMeasurer.measureTextReturn.set("c1", 5);
            textMeasurer.measureTextReturn.set("c2", 5);
            textMeasurer.measureTextReturn.set("c3", 5);
            gridState.rowModel = new RowModel(rows);
            // header height = 30
            gridState.headerStyles = new HeaderStyles({fontSize: 10, verticalPadding: 10});
            // cell height = 20
            gridState.cellStyles = new CellStyles({fontSize: 10, verticalPadding: 5, horizontalPadding: 0});
            gridState.viewport = {x: 0, y: 0, width: 30, height: 60};

            const boundingBoxes = cellMeasurer.computeVisibleBoundingBoxes().rows;

            expect(boundingBoxes).toHaveLength(6);
            expect(boundingBoxes[0].y).toBe(30);
            expect(boundingBoxes[1].y).toBe(30);
            expect(boundingBoxes[2].y).toBe(30);
        });

        it('should return bounding boxes for all visible cells when viewport x = 0 and viewport y = 0 and cells are wider than headers', () => {
            const rows = [{
                "column-key-1": "c1",
                "column-key-2": "c2",
                "column-key-3": "c3",
            },{
                "column-key-1": "c1",
                "column-key-2": "c2",
                "column-key-3": "c3",
            },{
                "column-key-1": "c1",
                "column-key-2": "c2",
                "column-key-3": "c3",
            }];
            textMeasurer.measureTextReturn.set("c1", 15);
            textMeasurer.measureTextReturn.set("c2", 15);
            textMeasurer.measureTextReturn.set("c3", 15);
            gridState.rowModel = new RowModel(rows);
            // header height = 30
            gridState.headerStyles = new HeaderStyles({fontSize: 10, verticalPadding: 10});
            // cell height = 20
            gridState.cellStyles = new CellStyles({fontSize: 10, verticalPadding: 5, horizontalPadding: 0});
            gridState.viewport = {x: 0, y: 0, width: 30, height: 60};

            const boundingBoxes = cellMeasurer.computeVisibleBoundingBoxes().rows;

            expect(boundingBoxes).toHaveLength(4);
            expect(boundingBoxes[0].x).toBe(0);
            expect(boundingBoxes[1].x).toBe(15);
            expect(boundingBoxes[0].width).toBe(15);
            expect(boundingBoxes[1].width).toBe(15);
        });

        it('should return bounding boxes for all visible cells when the viewport position has changed', () => {
            const rows = [{
                "column-key-1": "c1",
                "column-key-2": "c2",
                "column-key-3": "c3",
            },{
                "column-key-1": "c1",
                "column-key-2": "c2",
                "column-key-3": "c3",
            },{
                "column-key-1": "c1",
                "column-key-2": "c2",
                "column-key-3": "c3",
            }];
            textMeasurer.measureTextReturn.set("c1", 5);
            textMeasurer.measureTextReturn.set("c2", 5);
            textMeasurer.measureTextReturn.set("c3", 5);
            gridState.rowModel = new RowModel(rows);
            // header height = 30
            gridState.headerStyles = new HeaderStyles({fontSize: 10, verticalPadding: 10});
            // cell height = 20
            gridState.cellStyles = new CellStyles({fontSize: 10, verticalPadding: 5});
            gridState.viewport = {x: 15, y: 25, width: 30, height: 50};

            const boundingBoxes = cellMeasurer.computeVisibleBoundingBoxes();

            expect(boundingBoxes.rows).toHaveLength(4);
            expect(boundingBoxes.headers).toHaveLength(2);
        });
    });

    describe('fixed cell measurements', () => {
        it('should include fixed cells in the list of visible rows', () => {
            const rows = [{
                "column-key-1": "c1",
                "column-key-2": "c2",
                "column-key-3": "c3",
            }];
            textMeasurer.measureTextReturn.set("c1", 5);
            textMeasurer.measureTextReturn.set("c2", 5);
            textMeasurer.measureTextReturn.set("c3", 5);
            gridState.rowModel = new RowModel(rows);
            gridState.viewport = {x: 5, y: 0, width: 20, height: 100};
            gridState.fixedColumnCount = 1;
            const boundingBoxes = cellMeasurer.computeVisibleBoundingBoxes().rows;

            expect(boundingBoxes).toHaveLength(3);
            expect(boundingBoxes.map(box => box.width)).toEqual([10, 10, 10]);
            expect(boundingBoxes[0].x).toBe(0);
            expect(boundingBoxes[1].x).toBe(5);
            expect(boundingBoxes[2].x).toBe(15);
        });
    });
});