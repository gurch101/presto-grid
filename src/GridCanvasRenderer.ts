import RowModel from './RowModel';

interface ISchema {
    key: string;
    label: string
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
    private dimensionsDirty: boolean

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

        this.schemaDirty = false;
        this.dimensionsDirty = false;
    }

    public setSchema(schema: ISchema[]) {
        this.schema = schema;
        this.schemaDirty = true;
        return this;
    }

    public setRows(rows: object[]) {
        this.rows.setRows(rows);
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
            this.dimensionsDirty = true;
        }
        return this;
    }

    public setWidth(width: number) {
        if(this.viewport.width !== width) {
            this.viewport.width = width;
            this.dimensionsDirty = true;
        }
        return this;
    }

    public onScroll(scrollLeft: number, scrollTop: number) {
        this.viewport.x = scrollLeft;
        this.viewport.y = scrollTop;
        this.refresh();
    }

    public refresh() {
        const startTime = new Date().getTime();
        if(this.schemaDirty) {
            this.refreshSchemaTextWidths();
            this.resizeCanvas();
            this.schemaDirty = false;
        }
        this.resizeScrollContainer();
        this.refreshMaxTextWidth();
        this.render();
        const endTime = new Date().getTime();
        console.log(endTime - startTime);
    }

    private render() {
        // this.context.clearRect(this.viewport.x, this.viewport.y, this.viewport.width, this.viewport.height);
        this.context.clearRect(0, 0, this.viewport.width, this.viewport.height);
        this.renderGridCells();
        this.renderGridVerticalLines();
        this.renderGridCellHorizontalLines();
        this.renderGridHeaders();
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
            this.renderVerticalLine(0, 500, column.x);
        }
    }

    private getVisibleColumnsAndPositions() {
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

        const visibleColumns = [];
        while(currentX < this.viewport.x + this.viewport.width && i < this.schema.length) {
            const column = this.schema[i];
            visibleColumns.push({key: column.key, label: column.label, x: currentX - this.viewport.x});
            currentX += this.widthCache[this.schema[i].key] + (this.cellStyles.horizontalPadding * 2);
            i++;
        }
        return visibleColumns;
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
            this.context.textAlign = 'center';
            this.context.fillText(
                column.label,
                column.x + (this.widthCache[column.key] / 2) + this.cellStyles.horizontalPadding,
                this.headerStyles.verticalPadding + (this.headerStyles.fontSize / 2)
            );
        }
    }

    private renderGridCells() {
        this.context.font = `${this.cellStyles.fontWeight} ${this.cellStyles.fontSize}px ${this.cellStyles.fontFamily}`;
        this.context.fillStyle = this.cellStyles.color;
        this.context.textBaseline = 'middle';
        this.context.textAlign = 'center';

        const rows = this.getVisibleRowsAndPositions();
        const columns = this.getVisibleColumnsAndPositions();

        for(const row of rows) {
            for(const column of columns) {
                const cellValue = this.rows.getCellValue(row.index, column.key);
                this.context.fillText(
                    cellValue,
                    column.x + (this.widthCache[column.key] / 2) + this.cellStyles.horizontalPadding,
                    row.y  + this.cellStyles.verticalPadding + this.cellStyles.fontSize / 2
                )
            }
        }
    }

    private getCanvasWidth() {
        // this.refreshMaxTextWidth();
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
        // let x = 0;
        // while(x < this.viewport.x && initialSchemaIndex < this.schema.length) {
        //     x += this.widthCache[this.schema[initialSchemaIndex].key];
        //     initialSchemaIndex++;
        // }

        // for(let i = initialSchemaIndex; i < this.schema.length && currentWidth < this.viewport.width; i++) {
        //     const column = this.schema[i];
        //     this.widthCache[column.key] = Math.max(
        //         Math.floor(this.context.measureText(column.label).width),
        //         this.widthCache[column.key] || 0
        //     );
        //     currentWidth += this.widthCache[column.key];
        // }
    }

    private refreshMaxTextWidth() {
        const rowCount = this.rows.getRowCount();
        this.schema.forEach(schema => {
            const key = schema.key;
            this.context.font = `${this.cellStyles.fontWeight} ${this.cellStyles.fontSize}px ${this.cellStyles.fontFamily}`;
            for(let i = 0; i < rowCount; i++) {
                const cellValue = this.rows.getCellValue(i, key);
                this.widthCache[key] = Math.max(
                    Math.floor(this.context.measureText(cellValue).width),
                    this.widthCache[key] || 0
                );
            }
        });
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
export { IHeaderStyles, ICellStyles, ISchema };