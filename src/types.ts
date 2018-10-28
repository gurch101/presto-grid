
export enum Alignment {
    Left = 'left',
    Center = 'center',
    Right = 'right'
}

export interface ISchema {
    key: string;
    label: string;
    align: Alignment;
    valueFormatter?: (value: any) => string
}

export interface IFontStyles {
    fontSize: number;
    fontFamily: string;
    fontWeight: string;
}

export interface IHeaderStyleProps {
    fontSize?: number;
    fontFamily?: string;
    fontWeight?: string;
    color?: string;
    backgroundColor?: string;
    verticalPadding?: number;
}

export interface IHeaderStyles extends IFontStyles {
    color: string;
    backgroundColor: string;
    verticalPadding: number;
    getHeaderHeight: () => number;
    getHeaderFont: () => string;
}

export interface ICellStyleProps {
    backgroundColor?: string
    borderColor?: string
    borderWidth?: number
    fontWeight?: string
    fontSize?: number
    fontFamily?: string
    color?: string
    horizontalPadding?: number
    verticalPadding?: number
}

export interface ICellStyles extends IFontStyles {
    color: string;
    horizontalPadding: number;
    verticalPadding: number;
    borderColor: string;
    borderWidth: number;
    getCellHeight: () => number;
    getCellFont: () => string;
}

export interface IBoundingBox {
    x: number;
    y: number;
    width: number;
    height: number;
}

export interface ITextMeasurer {
    setFont: (font: string) => void;
    measureText: (text: string) => number
}

export interface ICellBoundingBox extends IBoundingBox {
    key: string | number;
}

export interface IVisibleBoundingBoxes {
    headers: ICellBoundingBox[];
    rows: ICellBoundingBox[];
}

export interface ILineRenderer {
    renderHorizontalLine: (fromX: number, toX: number, y: number) => void
    renderVerticalLine: (fromY: number, toY: number, x: number) => void
}

export interface ICellRenderer {
    setFont: (font: string) => void;
    setVisibleArea: (x: number, y: number, width: number, height: number) => void;
    renderText: (text: string, x: number, y: number, align: Alignment) => void
}