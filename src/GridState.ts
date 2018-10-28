import RowModel from './RowModel';
import { IBoundingBox, ICellStyles, IHeaderStyles, ISchema } from "./types";

class GridState {
    public headerStyles: IHeaderStyles;
    public cellStyles: ICellStyles;
    public viewport: IBoundingBox;
    public schema: ISchema[];
    public rowModel: RowModel;
    public fixedColumnCount: number;

    constructor() {
        this.rowModel = new RowModel();
        this.viewport = { x: 0, y: 0, width: 0, height: 0 };
    }
}

export default GridState;