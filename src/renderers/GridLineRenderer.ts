import GridState from '../GridState';
import { ICellBoundingBox, ILineRenderer, IVisibleBoundingBoxes } from '../types';

class GridLineRenderer {
    private lineRenderer: ILineRenderer;
    private gridState: GridState;

    constructor(lineRenderer: ILineRenderer, gridState: GridState) {
        this.lineRenderer = lineRenderer;
        this.gridState = gridState;
    }

    public render(visibleBoundingBoxes: IVisibleBoundingBoxes) {
        this.renderHeaderLines(visibleBoundingBoxes.headers);
        this.renderCellLines(visibleBoundingBoxes.rows);
    }

    private renderHeaderLines(headerBoundingBoxes: ICellBoundingBox[]) {
        let lastX = 0;
        for(let i = 0; i < headerBoundingBoxes.length; i++) {
            const headerBoundingBox = headerBoundingBoxes[i];
            if(headerBoundingBox.x >= lastX) {
                this.lineRenderer.renderVerticalLine(headerBoundingBox.y, headerBoundingBox.height, headerBoundingBox.x);
            }
            if(i === headerBoundingBoxes.length - 1) {
                this.lineRenderer.renderVerticalLine(headerBoundingBox.y, headerBoundingBox.height, headerBoundingBox.x + headerBoundingBox.width);
                this.lineRenderer.renderHorizontalLine(0, headerBoundingBox.x + headerBoundingBox.width, 0);
                this.lineRenderer.renderHorizontalLine(0, headerBoundingBox.x + headerBoundingBox.width, headerBoundingBox.height);
            }
            lastX = headerBoundingBox.x;
        }
    }

    private renderCellLines(cellBoundingBoxes: ICellBoundingBox[]) {
        let lastRowIndex = 0;
        const headerHeight = this.gridState.styles.headerStyles.getHeight();
        for(let i = 0; i < cellBoundingBoxes.length; i++) {
            const cellBoundingBox = cellBoundingBoxes[i];
            lastRowIndex = cellBoundingBox.key as number;
            this.lineRenderer.renderVerticalLine(cellBoundingBox.y, cellBoundingBox.y + cellBoundingBox.height, cellBoundingBox.x);

            if((i === cellBoundingBoxes.length - 1 || cellBoundingBoxes[i + 1].key !== lastRowIndex)) {
                this.lineRenderer.renderVerticalLine(cellBoundingBox.y, cellBoundingBox.y + cellBoundingBox.height, cellBoundingBox.x  + cellBoundingBox.width);
                if(cellBoundingBox.y >= headerHeight) {
                    this.lineRenderer.renderHorizontalLine(0, cellBoundingBox.x + cellBoundingBox.width, cellBoundingBox.y);
                }
            }
        }
    }
}

export default GridLineRenderer;