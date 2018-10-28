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

        let cellIndex = 0;
        for(const boundingBox of headers) {
            const column = visibleSchema[cellIndex];
            this.cellRenderer.setFont(
                this.gridState.styles.headerStyles.getFont(),
                this.gridState.getHeaderStyle(column.key, 'color')
            );
            this.fillCell(
                this.gridState.getHeaderStyle(column.key, "backgroundColor"),
                boundingBox
            )
            this.cellRenderer.renderText(
                column.label,
                this.getCellTextX(boundingBox, column.align),
                this.gridState.styles.headerStyles.verticalPadding + (this.gridState.styles.headerStyles.fontSize / 2),
                column.align
            );
            cellIndex++;
        }
    }

    private renderRowCells(rowCells: ICellBoundingBox[], visibleSchema: ISchema[]) {
        this.cellRenderer.setVisibleArea(0, this.gridState.styles.headerStyles.getHeight(), this.gridState.viewport.width, this.gridState.viewport.height - this.gridState.styles.headerStyles.getHeight());

        let cellIndex = 0;
        for(const boundingBox of rowCells) {
            const column = visibleSchema[cellIndex % visibleSchema.length];
            this.cellRenderer.setFont(
                this.gridState.styles.rowStyles.getFont(),
                this.gridState.getRowStyle(column.key, "color")
            );
            this.fillCell(
                this.gridState.getRowStyle(column.key, "backgroundColor"),
                boundingBox
            );
            this.cellRenderer.renderText(
                this.gridState.rowModel.getCellValue(boundingBox.key as number, column.key),
                this.getCellTextX(boundingBox, column.align),
                boundingBox.y + this.gridState.styles.rowStyles.verticalPadding + (this.gridState.styles.rowStyles.fontSize / 2),
                column.align
            );
            cellIndex++;
        }
        this.cellRenderer.unsetVisibleArea();
    }

    private fillCell(color: string, boundingBox: ICellBoundingBox) {
        this.cellRenderer.fillCell(
            color,
            boundingBox.x,
            boundingBox.y,
            boundingBox.width,
            boundingBox.height
        );
    }

    private getCellTextX(boundingBox: ICellBoundingBox, alignment: Alignment): number {
        if(alignment === Alignment.Left) {
            return boundingBox.x + this.gridState.styles.rowStyles.horizontalPadding;
        } else if(alignment === Alignment.Center) {
            return boundingBox.x + boundingBox.width / 2;
        } else {
            return boundingBox.x + boundingBox.width - this.gridState.styles.rowStyles.horizontalPadding;
        }
    }
}

export default GridCellRenderer;