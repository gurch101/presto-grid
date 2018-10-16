import { ISchema } from './GridCanvasRenderer';

class RowModel {
    private rows: object[]
    private valueFormatters: object

    constructor(rows?: object[]) {
        this.rows = rows || [];
    }

    public setRows(rows: object[]) {
        this.rows = rows;
    }

    public getRows() {
        return this.rows;
    }

    public setSchema(schema: ISchema[]) {
        this.valueFormatters = schema
            .filter(column => column.valueFormatter)
            .reduce((accumulator, column) => ({
            ...accumulator,
            [column.key]: column.valueFormatter
        }), {});
    }

    public getCellValue(rowIndex: number, attributeName: string) {
        const rawValue = this.rows[rowIndex][attributeName];
        if(this.valueFormatters[attributeName]) {
            return this.valueFormatters[attributeName](rawValue);
        }
        return rawValue;
    }

    public getRowCount() {
        return this.rows.length;
    }
}

export default RowModel