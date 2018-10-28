import GridState from '../GridState';
import { Alignment, ICellBoundingBox, ICellRenderer, ISchema, IVisibleBoundingBoxes } from '../types';

class GridCellRenderer {
    private readonly cellRenderer: ICellRenderer;
    private readonly gridState: GridState;

    constructor(cellRenderer: ICellRenderer, gridState: GridState) {
        this.cellRenderer = cellRenderer;
        this.gridState = gridState;
    }

    public render(visibleBoundingBoxes: IVisibleBoundingBoxes) {
        const visibleSchema = visibleBoundingBoxes.headers.map(headerBoundingBox => (
            this.gridState.schema.find(item => item.key === headerBoundingBox.key)!
        ));
        this.renderHeaderCells(visibleBoundingBoxes.headers, visibleSchema);
        this.renderRowCells(visibleBoundingBoxes.rows, visibleSchema);
    }

    private renderHeaderCells(headers: ICellBoundingBox[], visibleSchema: ISchema[]) {
        this.cellRenderer.setFont(this.gridState.headerStyles.getHeaderFont());

        let cellIndex = 0;
        for(const boundingBox of headers) {
            const column = visibleSchema[cellIndex];
            this.cellRenderer.renderText(
                column.label,
                this.getCellTextX(boundingBox, column.align),
                this.gridState.headerStyles.verticalPadding + (this.gridState.headerStyles.fontSize / 2),
                column.align
            );
            cellIndex++;
        }
    }

    private renderRowCells(rowCells: ICellBoundingBox[], visibleSchema: ISchema[]) {
        this.cellRenderer.setFont(this.gridState.cellStyles.getCellFont());
        this.cellRenderer.setVisibleArea(0, this.gridState.headerStyles.getHeaderHeight(), this.gridState.viewport.width, this.gridState.viewport.height - this.gridState.headerStyles.getHeaderHeight());

        let cellIndex = 0;
        for(const boundingBox of rowCells) {
            const column = visibleSchema[cellIndex % visibleSchema.length];
            this.cellRenderer.renderText(
                this.gridState.rowModel.getCellValue(boundingBox.key as number, column.key),
                this.getCellTextX(boundingBox, column.align),
                boundingBox.y + this.gridState.cellStyles.verticalPadding + (this.gridState.cellStyles.fontSize / 2),
                column.align
            );
            cellIndex++;
        }
    }

    private getCellTextX(boundingBox: ICellBoundingBox, alignment: Alignment): number {
        if(alignment === Alignment.Left) {
            return boundingBox.x + this.gridState.cellStyles.horizontalPadding;
        } else if(alignment === Alignment.Center) {
            return boundingBox.x + boundingBox.width / 2;
        } else {
            return boundingBox.x + boundingBox.width - this.gridState.cellStyles.horizontalPadding;
        }
    }
}

export default GridCellRenderer;