import { IStyles } from './types/styles';

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
    getHeight: () => number;
    getFont: () => string;
}

export interface IHeaderStyleProps {
    fontSize?: number;
    fontFamily?: string;
    fontWeight?: string;
    borderColor?: string;
    color?: string;
    backgroundColor?: string;
    verticalPadding?: number;
}

export interface IRowStyleProps {
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

export interface IHeaderStyles extends IFontStyles, IStyles {
    verticalPadding: number;
}

export interface ICellStyleProps {
    headerStyles?: IHeaderStyleProps
    rowStyles?: IRowStyleProps
}

export interface ICellStyles {
    headerStyles: IHeaderStyles;
    rowStyles: IRowStyles;
}

export interface IRowStyles extends IFontStyles, IStyles {
    horizontalPadding: number;
    verticalPadding: number;
    borderWidth: number;
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
    setLineColor: (color: string) => void;
    renderHorizontalLine: (fromX: number, toX: number, y: number) => void;
    renderVerticalLine: (fromY: number, toY: number, x: number) => void;
    setVisibleArea: (x: number, y: number, width: number, height: number) => void;
    unsetVisibleArea: () => void;
}

export interface ICellRenderer {
    setFont: (font: string, color: string) => void;
    setVisibleArea: (x: number, y: number, width: number, height: number) => void;
    unsetVisibleArea: () => void;
    renderText: (text: string, x: number, y: number, align: Alignment) => void;
    fillCell: (color: string, x: number, y: number, width: number, height: number) => void;
}