import GridState from '../GridState';
import { ITextMeasurer, IVisibleBoundingBoxes } from '../types';

interface IWidthCache {
    [key: string]: number
}

/*
TODO:
cleanup
deal with minWidth/width/maxWidth
support line wrapping/dynamic row heights
support cell renderer
caching
test performance of 100k x 100k grid
*/
class GridCellMeasurer {
    private gridState: GridState;
    private widthCache: IWidthCache = {}
    private measurer: ITextMeasurer
    private visibleBoundingBoxes: IVisibleBoundingBoxes;

    constructor(measurer: ITextMeasurer, gridState: GridState) {
        this.measurer = measurer;
        this.gridState = gridState;
    }

    public computeVisibleBoundingBoxes(): IVisibleBoundingBoxes {
        const { startingIndex, initialXOffset } = this.computeSchemaTextWidths();
        const { startingRowIndex, endingRowIndex, endingColumnIndex, initialYOffset } = this.computeCellTextWidths(startingIndex, initialXOffset);

        let startingColumnIndex = startingIndex;
        let currentX = initialXOffset;
        let currentY = initialYOffset;
        let fixedColumnXPosition = 0;
        const columnBoundingBoxes = [];
        const rowBoundingBoxes = [];
        const headerHeight = this.gridState.styles.headerStyles.getHeight();
        const rowHeight = this.gridState.styles.rowStyles.getHeight();

        for(let i = 0; i < this.gridState.fixedColumnCount; i++) {
            const column = this.gridState.schema[i];
            columnBoundingBoxes.push({
                key: column.key,
                x: fixedColumnXPosition,
                y: 0,
                width: this.widthCache[column.key],
                height: headerHeight
            });

            if(startingColumnIndex === i) {
                startingColumnIndex++;
            }
            fixedColumnXPosition += this.widthCache[column.key];
            currentX += this.widthCache[column.key];
        }

        for(let i = startingColumnIndex; i < this.gridState.schema.length && currentX < this.gridState.viewport.width; i++) {
            const column = this.gridState.schema[i];
            columnBoundingBoxes.push({
                key: column.key,
                x: currentX,
                y: 0,
                width: this.widthCache[column.key],
                height: headerHeight
            });
            currentX += this.widthCache[column.key];
        }

        for(let i = startingRowIndex; i < this.gridState.rowModel.getRowCount() && i < endingRowIndex; i++) {
            for(const column of columnBoundingBoxes) {
                rowBoundingBoxes.push({
                    key: i,
                    x: column.x,
                    y: currentY,
                    width: column.width,
                    height: rowHeight
                });
            }
            currentY += rowHeight;
        }

        this.visibleBoundingBoxes = { headers: columnBoundingBoxes, rows: rowBoundingBoxes };
        return this.visibleBoundingBoxes;
    }

    public getTotalWidth(): number {
        return Object.keys(this.widthCache).reduce((accumulator, columnKey) => {
            return accumulator += this.widthCache[columnKey];
        }, 0);
    }

    public getTotalHeight(): number {
        return (
            this.gridState.styles.headerStyles.getHeight() +
            this.gridState.rowModel.getRowCount() * this.gridState.styles.rowStyles.getHeight()
        );
    }

    public getVisibleBoundingBoxes(): IVisibleBoundingBoxes {
        return this.visibleBoundingBoxes;
    }

    private isWidthComputedForColumn(columnKey: string) {
        return columnKey in this.widthCache;
    }

    private computeSchemaTextWidths() {
        this.measurer.setFont(this.gridState.styles.headerStyles.getFont());
        let currentWidth = 0;
        let startingIndex = 0;
        let endingIndex = 0;
        // TODO: switch to binary search over list of running totals
        for(const column of this.gridState.schema) {
            if(!this.isWidthComputedForColumn(column.key)) {
                break;
            }
            if(currentWidth + this.widthCache[column.key] >= this.gridState.viewport.x) {
                break;
            }
            currentWidth += this.widthCache[column.key];
            startingIndex++;
        }

        let initialXOffset = Math.floor(currentWidth - this.gridState.viewport.x);

        for(let i = startingIndex; i < this.gridState.schema.length && currentWidth - this.gridState.viewport.x < this.gridState.viewport.width; i++) {
            const column = this.gridState.schema[i];
            if(currentWidth <= this.gridState.viewport.x) {
                startingIndex = i;
                initialXOffset = currentWidth - this.gridState.viewport.x;
            }
            endingIndex = i;
            this.widthCache[column.key] = Math.max(
                Math.floor(this.measurer.measureText(column.label)) + this.gridState.styles.rowStyles.horizontalPadding * 2,
                this.widthCache[column.key] || 0
            );
            currentWidth += this.widthCache[column.key];
        }

        return { startingIndex, endingIndex: endingIndex + 1, initialXOffset };
    }

    private computeCellTextWidths(startingColumnIndex: number, initialXOffset: number) {
        this.measurer.setFont(this.gridState.styles.rowStyles.getFont());

        const rowHeight = this.gridState.styles.rowStyles.getHeight();
        const startingRowIndex = Math.floor(this.gridState.viewport.y / rowHeight);
        const initialYOffset = Math.floor((rowHeight * startingRowIndex) - this.gridState.viewport.y + this.gridState.styles.headerStyles.getHeight());
        let endingRowIndex = 0;
        let endingColumnIndex = 0;
        let currentX = initialXOffset;
        let currentY = initialYOffset;
        for(let columnIndex = startingColumnIndex; columnIndex < this.gridState.schema.length; columnIndex++) {
            const column = this.gridState.schema[columnIndex];
            currentY = initialYOffset;
            for(let i = startingRowIndex; i < this.gridState.rowModel.getRows().length && currentY < this.gridState.viewport.height; i++) {
                const cellValue = this.gridState.rowModel.getCellValue(i, column.key);
                this.widthCache[column.key] = Math.max(
                    Math.floor(this.measurer.measureText(cellValue)) + this.gridState.styles.rowStyles.horizontalPadding * 2,
                    this.widthCache[column.key] || 0
                );
                endingRowIndex = i;
                currentY += rowHeight;
            }

            currentX += this.widthCache[column.key];
            endingColumnIndex = columnIndex;
            if(currentX >= this.gridState.viewport.width) {
                break;
            }
        }
        return { startingRowIndex, endingRowIndex: endingRowIndex + 1, endingColumnIndex, initialYOffset};
    }
}

export default GridCellMeasurer;