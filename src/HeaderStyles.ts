import { IHeaderStyleProps, IHeaderStyles } from "./types";

class HeaderStyles implements IHeaderStyles {
    public readonly color: string;
    public readonly backgroundColor: string;
    public readonly verticalPadding: number;
    public readonly fontSize: number;
    public readonly fontFamily: string;
    public readonly fontWeight: string;

    constructor(headerStyles: IHeaderStyleProps = {}) {
        this.color = headerStyles.color || "#ffffff";
        this.backgroundColor = headerStyles.backgroundColor || "red";
        this.verticalPadding = headerStyles.verticalPadding || 12;
        this.fontSize = headerStyles.fontSize || 16;
        this.fontFamily = headerStyles.fontFamily || "sans-serif";
        this.fontWeight = headerStyles.fontWeight  || "normal";
    }

    public getHeight() {
        return (this.verticalPadding * 2) + this.fontSize;
    }

    public getFont() {
        return `${this.fontWeight} ${this.fontSize}px ${this.fontFamily}`;
    }
}

export default HeaderStyles;