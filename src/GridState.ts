import HeaderStyles from './HeaderStyles';
import RowModel from './RowModel';
import RowStyles from './RowStyles';
import { IBoundingBox, ICellStyles, ISchema } from "./types";

class GridState {
    public styles: ICellStyles;
    public viewport: IBoundingBox;
    public schema: ISchema[];
    public rowModel: RowModel;
    public fixedColumnCount: number;

    constructor() {
        this.rowModel = new RowModel();
        this.viewport = { x: 0, y: 0, width: 0, height: 0 };
        this.styles = {
            headerStyles: new HeaderStyles({}),
            rowStyles: new RowStyles({})
        };
    }

    public getHeaderStyle(key: string, styleKey: string) {
        return this.styles.headerStyles[styleKey];
    }

    public getRowStyle(key: string, styleKey: string) {
        return this.styles.rowStyles[styleKey];
    }
}

export default GridState;