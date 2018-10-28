import GridState from '../GridState';
import GridCellMeasurer from '../measurers/GridCellMeasurer';
import TextMeasurer from '../measurers/TextMeasurer';
import { ICellStyles, ISchema } from '../types';
import CanvasRenderer from './CanvasRenderer';
import CellRenderer from './CellRenderer';
import GridCellRenderer from './GridCellRenderer';
import GridLineRenderer from './GridLineRenderer';
import LineRenderer from './LineRenderer';

class GridCanvasRenderer {
    private canvasRenderer: CanvasRenderer;
    private lineRenderer: GridLineRenderer;
    private cellRenderer: GridCellRenderer;
    private cellMeasurer: GridCellMeasurer;
    private gridState: GridState;

    public constructor(container: HTMLElement) {
        this.gridState = new GridState();
        this.canvasRenderer = new CanvasRenderer(container);
        this.cellMeasurer = new GridCellMeasurer(new TextMeasurer(this.canvasRenderer.context), this.gridState);
        this.lineRenderer = new GridLineRenderer(new LineRenderer(this.canvasRenderer.context), this.gridState);
        this.cellRenderer = new GridCellRenderer(new CellRenderer(this.canvasRenderer.context), this.gridState);
    }

    public setSchema(schema: ISchema[]) {
        this.gridState.schema = schema;
        this.gridState.rowModel.setSchema(schema);
        return this;
    }

    public setRows(rows: object[]) {
        this.gridState.rowModel.setRows(rows);
        return this;
    }

    public setStyles(cellStyles: ICellStyles) {
        this.gridState.styles = cellStyles;
        return this;
    }

    public setHeight(height: number) {
        this.gridState.viewport.height = height;
        return this;
    }

    public setWidth(width: number) {
        this.gridState.viewport.width = width;
        return this;
    }

    public onScroll(scrollLeft: number, scrollTop: number) {
        this.gridState.viewport.x = scrollLeft;
        this.gridState.viewport.y = scrollTop;
        this.refresh();
    }

    public refresh() {
        this.cellMeasurer.computeVisibleBoundingBoxes();
        this.canvasRenderer.resize(
            this.gridState.viewport.width,
            this.gridState.viewport.height,
            this.cellMeasurer.getTotalWidth(),
            this.cellMeasurer.getTotalHeight()
        );
        this.render();
    }

    private render() {
        this.canvasRenderer.clear();
        this.cellRenderer.render(this.cellMeasurer.getVisibleBoundingBoxes());
        this.lineRenderer.render(this.cellMeasurer.getVisibleBoundingBoxes());
    }
}

export default GridCanvasRenderer;
