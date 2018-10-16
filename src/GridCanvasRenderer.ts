import RowModel from './RowModel';

enum Alignment {
    Left = 'left',
    Center = 'center',
    Right = 'right'
}
interface ISchema {
    key: string;
    label: string;
    align: Alignment;
    valueFormatter?: (value: any) => string
}

interface IFontStyles {
    fontSize: number;
    fontFamily: string;
    fontWeight: string;
}

interface IHeaderStyles extends IFontStyles {
    color: string;
    backgroundColor: string;
    verticalPadding: number;
}

interface ICellStyles extends IFontStyles {
    color: string;
    horizontalPadding: number;
    verticalPadding: number;
    borderColor: string;
    borderWidth: number;
}

interface IViewport {
    x: number;
    y: number;
    width: number;
    height: number;
}

class GridCanvasRenderer {
    private canvas: HTMLCanvasElement
    private context: CanvasRenderingContext2D
    private scrollContainer: HTMLElement
    private schema: ISchema[]
    private headerStyles: IHeaderStyles
    private cellStyles: ICellStyles
    private rows: RowModel
    private viewport: IViewport
    private widthCache: object
    private schemaDirty: boolean
    private visibleColumns: any[]
    private visibleRows: any[]

    public constructor(container: HTMLElement) {
        this.canvas = document.createElement('canvas');
        this.canvas.style.position = 'absolute';
        this.canvas.style.zIndex = "-1";
        const context = this.canvas.getContext('2d');
        if(context === null) {
            throw new Error("Could not get 2d context");
        }
        this.context = context;
        this.scrollContainer = document.createElement('div');
        this.scrollContainer.style.zIndex = "1";
        container.appendChild(this.canvas);
        container.appendChild(this.scrollContainer);
        this.schema = [];
        this.rows = new RowModel();
        this.viewport = {x: 0, y: 0, width: 0, height: 0};
        this.widthCache = {};
        this.visibleColumns = [];
        this.visibleRows = [];

        this.schemaDirty = false;
    }

    public setSchema(schema: ISchema[]) {
        if(this.schema !== schema) {
            this.schema = schema;
            this.rows.setSchema(schema);
            this.schemaDirty = true;
        }
        return this;
    }

    public setRows(rows: object[]) {
        if(this.rows.getRows() !== rows) {
            this.rows.setRows(rows);
        }
        return this;
    }

    public setHeaderStyles(headerStyles: IHeaderStyles) {
        this.headerStyles = headerStyles;
        return this;
    }

    public setCellStyles(cellStyles: ICellStyles) {
        this.cellStyles = cellStyles;
        return this;
    }

    public setHeight(height: number) {
        if(this.viewport.height !== height) {
            this.viewport.height = height;
        }
        return this;
    }

    public setWidth(width: number) {
        if(this.viewport.width !== width) {
            this.viewport.width = width;
        }
        return this;
    }

    public onScroll(scrollLeft: number, scrollTop: number) {
        this.viewport.x = scrollLeft;
        this.viewport.y = scrollTop;
        this.refresh();
    }

    public refresh() {
        this.visibleColumns = [];
        this.visibleRows = [];
        if(this.schemaDirty) {
            this.refreshSchemaTextWidths();
            this.schemaDirty = false;
        }
        this.refreshCellTextWidth();
        this.resizeScrollContainer();
        this.resizeCanvas();
        this.render();
    }

    private render() {
        this.context.clearRect(0, 0, this.viewport.width, this.viewport.height);
        this.renderGridCellHorizontalLines();
        this.renderGridCells();
        this.renderGridHeaders();
        this.renderGridVerticalLines();
    }

    private renderLine(fromX: number, fromY: number, toX: number, toY: number) {
        this.context.beginPath();
        this.context.moveTo(fromX, fromY);
        this.context.lineTo(toX, toY);
        this.context.stroke();
    }

    private renderHorizontalLine(fromX: number, toX: number, y: number) {
        this.renderLine(fromX, y, toX, y);
    }

    private renderVerticalLine(fromY: number, toY: number, x: number) {
        this.renderLine(x + 0.5, fromY, x + 0.5, toY);
    }

    private getHeaderHeight() {
        return (2 * this.headerStyles.verticalPadding) + this.headerStyles.fontSize;
    }

    private getVisibleRowsAndPositions() {
        const rowHeight = this.getCellHeight();
        const headerHeight = this.getHeaderHeight();
        let currentRowIndex = Math.floor(this.viewport.y / rowHeight);
        let currentHeight = currentRowIndex * rowHeight;

        const rows = [];
        while(currentHeight < this.viewport.y + this.viewport.height && currentRowIndex < this.rows.getRowCount()) {
            rows.push({index: currentRowIndex, y: currentHeight - this.viewport.y + headerHeight})
            currentHeight += rowHeight;
            currentRowIndex++;
        }
        return rows;
    }

    private renderGridCellHorizontalLines() {
        this.context.strokeStyle = this.cellStyles.borderColor;
        this.context.lineWidth = this.cellStyles.borderWidth;
        const rows = this.getVisibleRowsAndPositions();
        for(const row of rows) {
            this.renderHorizontalLine(
                0,
                this.viewport.width,
                row.y
            );
        }
    }

    private renderGridVerticalLines() {
        this.context.strokeStyle = this.cellStyles.borderColor;
        this.context.lineWidth = this.cellStyles.borderWidth;

        const visibleColumns = this.getVisibleColumnsAndPositions();
        for(const column of visibleColumns) {
            this.renderVerticalLine(0, this.viewport.height, column.x);
        }
    }

    private getVisibleColumnsAndPositions() {
        if(this.visibleColumns.length > 0) {
            return this.visibleColumns;
        }
        let i = 0;
        let currentX = 0;
        while(currentX < this.viewport.x) {
            currentX += this.widthCache[this.schema[i].key] + (this.cellStyles.horizontalPadding * 2);
            i++;
        }
        if(i > 0) {
            i--;
            currentX -= (this.widthCache[this.schema[i].key] + (this.cellStyles.horizontalPadding * 2));
        }

        this.visibleColumns = [];
        while(currentX < this.viewport.x + this.viewport.width && i < this.schema.length) {
            const column = this.schema[i];
            let x = currentX - this.viewport.x;
            if(column.align === Alignment.Left) {
                x += this.cellStyles.horizontalPadding;
            } else if(column.align === Alignment.Right) {
                x += this.widthCache[column.key] + this.cellStyles.horizontalPadding;
            } else {
                x += this.widthCache[column.key] / 2 + this.cellStyles.horizontalPadding;
            }
            this.visibleColumns.push({...column, x: currentX - this.viewport.x, textX: x});
            currentX += this.widthCache[this.schema[i].key] + (this.cellStyles.horizontalPadding * 2);
            i++;
        }
        return this.visibleColumns;
    }

    private renderGridHeaders() {
        this.context.font = `${this.headerStyles.fontWeight} ${this.headerStyles.fontSize}px ${this.headerStyles.fontFamily}`;

        const visibleColumns = this.getVisibleColumnsAndPositions();
        for(const column of visibleColumns) {
            this.context.fillStyle = this.headerStyles.backgroundColor;
            this.context.fillRect(
                column.x,
                0,
                this.widthCache[column.key] + (this.cellStyles.horizontalPadding * 2),
                this.headerStyles.fontSize + (this.headerStyles.verticalPadding * 2)
            );
            this.context.strokeStyle = this.cellStyles.borderColor;
            this.context.lineWidth = this.cellStyles.borderWidth;
            this.context.fillStyle = this.headerStyles.color;
            this.context.textBaseline = 'middle';
            this.context.textAlign = column.align;
            this.context.fillText(
                column.label,
                column.textX,
                this.headerStyles.verticalPadding + (this.headerStyles.fontSize / 2)
            );
        }
    }

    private renderGridCells() {
        this.context.font = `${this.cellStyles.fontWeight} ${this.cellStyles.fontSize}px ${this.cellStyles.fontFamily}`;
        this.context.fillStyle = this.cellStyles.color;
        this.context.textBaseline = 'middle';

        const rows = this.getVisibleRowsAndPositions();
        const columns = this.getVisibleColumnsAndPositions();

        for(const row of rows) {
            for(const column of columns) {
                this.context.textAlign = column.align;
                const cellValue = this.rows.getCellValue(row.index, column.key);
                this.context.fillText(
                    cellValue,
                    column.textX,
                    row.y  + this.cellStyles.verticalPadding + this.cellStyles.fontSize / 2
                )
            }
        }
    }

    private getCanvasWidth() {
        let width = 0;
        this.schema.forEach(schema => {
            width += this.widthCache[schema.key] + (this.cellStyles.horizontalPadding * 2);
        });
        return width;
    }

    private getCanvasHeight() {
        return (this.getHeaderHeight() + this.rows.getRowCount() * this.getCellHeight());
    }

    private refreshSchemaTextWidths() {
        this.context.font = `${this.headerStyles.fontWeight} ${this.headerStyles.fontSize}px ${this.headerStyles.fontFamily}`;
        const currentWidth = 0;
        const initialSchemaIndex = 0;
        for(const column of this.schema) {
            this.widthCache[column.key] = Math.max(
                Math.floor(this.context.measureText(column.label).width),
                this.widthCache[column.key] || 0
            );
        }
    }

    private refreshCellTextWidth() {
        this.context.font = `${this.cellStyles.fontWeight} ${this.cellStyles.fontSize}px ${this.cellStyles.fontFamily}`;
        const columns = this.getVisibleColumnsAndPositions();
        const rows = this.getVisibleRowsAndPositions();
        for(const column of columns) {
            for(const row of rows) {
                const cellValue = this.rows.getCellValue(row.index, column.key);
                this.widthCache[column.key] = Math.max(
                    Math.floor(this.context.measureText(cellValue).width),
                    this.widthCache[column.key] || 0
                );
            }
        }
        this.visibleColumns = [];
    }

    private resizeCanvas() {
        let canvasHeight = this.viewport.height - 14;
        let canvasWidth = this.viewport.width - 14;
        const canvasStyleHeight = canvasHeight;
        const canvasStyleWidth = canvasWidth;
        if(window.devicePixelRatio) {
          canvasHeight = canvasHeight * window.devicePixelRatio;
          canvasWidth = canvasWidth * window.devicePixelRatio;
        }
        this.canvas.setAttribute('width', canvasWidth.toString());
        this.canvas.setAttribute('height', canvasHeight.toString());
        this.canvas.style.width = canvasStyleWidth.toString();
        this.canvas.style.height = canvasStyleHeight.toString();
    }

    private resizeScrollContainer() {
        this.scrollContainer.style.width = this.getCanvasWidth().toString() + "px";
        this.scrollContainer.style.height = this.getCanvasHeight().toString() + "px";
    }

    private getCellHeight() {
        return (2 * this.cellStyles.verticalPadding) + this.cellStyles.fontSize;
    }
}

export default GridCanvasRenderer;
export { IHeaderStyles, ICellStyles, ISchema, Alignment };