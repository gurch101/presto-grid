import { ICellStyleProps } from './ProntoGrid';
import { ICellStyles } from "./types";

class CellStyles implements ICellStyles {
    public readonly color: string;
    public readonly verticalPadding: number;
    public readonly horizontalPadding: number;
    public readonly borderColor: string;
    public readonly borderWidth: number;
    public readonly fontSize: number;
    public readonly fontFamily: string;
    public readonly fontWeight: string;

    constructor(cellStyleProps: ICellStyleProps) {
        this.borderColor = cellStyleProps.borderColor || "black";
        this.borderWidth = cellStyleProps.borderWidth || 1;
        this.fontWeight = cellStyleProps.fontWeight || "normal";
        this.fontSize = cellStyleProps.fontSize || 16;
        this.fontFamily = cellStyleProps.fontFamily || "sans-serif";
        this.color = cellStyleProps.color || "#212529";
        this.horizontalPadding = cellStyleProps.horizontalPadding === undefined? 15 : cellStyleProps.horizontalPadding;
        this.verticalPadding = cellStyleProps.verticalPadding === undefined? 10 : cellStyleProps.verticalPadding;
    }

    public getCellHeight() {
        return (this.verticalPadding * 2) + this.fontSize;
    }

    public getCellFont() {
        return `${this.fontWeight} ${this.fontSize}px ${this.fontFamily}`;
    }
}

export default CellStyles;