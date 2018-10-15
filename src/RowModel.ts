class RowModel {
    private rows: object[]

    constructor(rows?: object[]) {
        this.rows = rows || [];
    }

    public setRows(rows: object[]) {
        this.rows = rows;
    }

    public getCellValue(rowIndex: number, attributeName: string) {
        return this.rows[rowIndex][attributeName];
    }

    public getRowCount() {
        return this.rows.length;
    }
}

export default RowModel