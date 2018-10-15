import RowModel from "./RowModel";

describe('RowModel', () => {
    it('should return the number of rows in data', () => {
        const rowModel = new RowModel([]);

        expect(rowModel.getRowCount()).toBe(0);

        rowModel.setRows([{}]);

        expect(rowModel.getRowCount()).toBe(1);
    });

    it('should return cell values', () => {
        const rowModel = new RowModel([{key: "value"}]);

        expect(rowModel.getCellValue(0, "key")).toBe("value");
    });
});