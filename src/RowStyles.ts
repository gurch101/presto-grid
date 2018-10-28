import { IRowStyleProps, IRowStyles } from "./types";

class RowStyles implements IRowStyles {
    public readonly color: string;
    public readonly backgroundColor: string;
    public readonly verticalPadding: number;
    public readonly horizontalPadding: number;
    public readonly borderColor: string;
    public readonly borderWidth: number;
    public readonly fontSize: number;
    public readonly fontFamily: string;
    public readonly fontWeight: string;

    constructor(rowStyleProps: IRowStyleProps = {}) {
        this.borderColor = rowStyleProps.borderColor || "black";
        this.borderWidth = rowStyleProps.borderWidth || 1;
        this.fontWeight = rowStyleProps.fontWeight || "normal";
        this.fontSize = rowStyleProps.fontSize || 16;
        this.fontFamily = rowStyleProps.fontFamily || "sans-serif";
        this.color = rowStyleProps.color || "#212529";
        this.backgroundColor = rowStyleProps.backgroundColor || "#ffffff";
        this.horizontalPadding = rowStyleProps.horizontalPadding === undefined? 15 : rowStyleProps.horizontalPadding;
        this.verticalPadding = rowStyleProps.verticalPadding === undefined? 10 : rowStyleProps.verticalPadding;
    }

    public getHeight() {
        return (this.verticalPadding * 2) + this.fontSize;
    }

    public getFont() {
        return `${this.fontWeight} ${this.fontSize}px ${this.fontFamily}`;
    }
}

export default RowStyles;