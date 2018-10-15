import * as React from 'react';
import GridCanvasRenderer, { ICellStyles, IHeaderStyles, ISchema } from './GridCanvasRenderer';

interface IHeaderStyleProps {
    fontSize?: number;
    fontFamily?: string;
    fontWeight?: string;
    color?: string;
    backgroundColor?: string;
    verticalPadding?: number;
}

interface ICellStyleProps {
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

interface IProntoGridProps {
    width: number;
    height: number;
    headerStyles?: IHeaderStyleProps
    cellStyles?: ICellStyleProps
    schema: ISchema[]
    rows: object[]
}

const getCellStyles = (cellStyleProps: ICellStyleProps = {}): ICellStyles => {
    return {
        borderColor: cellStyleProps.borderColor || "black",
        borderWidth: cellStyleProps.borderWidth || 1,
        fontWeight: cellStyleProps.fontWeight || "normal",
        fontSize: cellStyleProps.fontSize || 16,
        fontFamily: cellStyleProps.fontFamily || "sans-serif",
        color: cellStyleProps.color || "#212529",
        horizontalPadding: cellStyleProps.horizontalPadding || 15,
        verticalPadding: cellStyleProps.verticalPadding || 10
    };
};

const getHeaderStyles = (headerStyleProps: IHeaderStyleProps = {}): IHeaderStyles => {
    return {
        fontWeight: headerStyleProps.fontWeight || "normal",
        fontSize: headerStyleProps.fontSize || 16,
        fontFamily: headerStyleProps.fontFamily || "sans-serif",
        color: headerStyleProps.color || "#ffffff",
        backgroundColor: headerStyleProps.backgroundColor || "red",
        verticalPadding: headerStyleProps.verticalPadding || 12
    };
};


class ProntoGrid extends React.Component<IProntoGridProps> {
    private scrollContainer = React.createRef<HTMLDivElement>()
    private gridRenderer: GridCanvasRenderer

    public componentDidMount() {
        if(this.scrollContainer.current !== null) {
            this.scrollContainer.current.addEventListener('scroll', this.onScroll);
            this.gridRenderer = new GridCanvasRenderer(this.scrollContainer.current);
            this.gridRenderer
                .setWidth(this.props.width)
                .setHeight(this.props.height)
                .setHeaderStyles(getHeaderStyles(this.props.headerStyles))
                .setCellStyles(getCellStyles(this.props.cellStyles))
                .setSchema(this.props.schema)
                .setRows(this.props.rows)
                .refresh();
        }
    }

    public onScroll = (e: any) => {
        console.log(e);
        this.gridRenderer.onScroll(
            e.target.scrollLeft,
            e.target.scrollTop
        );
    }

    public render() {
        return (
            <div
                data-pronto-grid="true"
                ref={this.scrollContainer}
                style={{overflow: "auto", width: this.props.width, height: this.props.height}} />
        );
    }
}

export default ProntoGrid;
export { IProntoGridProps, IHeaderStyles, ICellStyles, ISchema };