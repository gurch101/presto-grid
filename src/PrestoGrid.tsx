import * as React from 'react';
import CellStyles from './CellStyles';
import HeaderStyles from './HeaderStyles';
import GridCanvasRenderer from './renderers/GridCanvasRenderer';
import { Alignment, ICellStyleProps, ICellStyles, IHeaderStyleProps, IHeaderStyles, ISchema } from './types';

interface ISchemaProps {
    key: string,
    label: string,
    align?: Alignment,
    valueFormatter?: (value: any) => string
};

interface IPrestoGridProps {
    width: number;
    height: number;
    headerStyles?: IHeaderStyleProps
    cellStyles?: ICellStyleProps
    schema: ISchemaProps[]
    rows: object[]
}

const getSchema = (schemaProps: ISchemaProps[]): ISchema[] => {
    return schemaProps.map(schema => ({
        ...schema,
        align: schema.align  || Alignment.Center
    }));
}

const getCellStyles = (cellStyleProps: ICellStyleProps = {}): ICellStyles => {
    return new CellStyles(cellStyleProps);
};

const getHeaderStyles = (headerStyleProps: IHeaderStyleProps = {}): IHeaderStyles => {
    return new HeaderStyles(headerStyleProps);
};


class PrestoGrid extends React.Component<IPrestoGridProps> {
    private scrollContainer = React.createRef<HTMLDivElement>()
    private gridRenderer: GridCanvasRenderer

    public refresh() {
        this.gridRenderer
            .setWidth(this.props.width)
            .setHeight(this.props.height)
            .setHeaderStyles(getHeaderStyles(this.props.headerStyles))
            .setCellStyles(getCellStyles(this.props.cellStyles))
            .setSchema(getSchema(this.props.schema))
            .setRows(this.props.rows)
            .refresh();
    }

    public componentDidMount() {
        if(this.scrollContainer.current !== null) {
            this.scrollContainer.current.addEventListener('scroll', this.onScroll);
            this.gridRenderer = new GridCanvasRenderer(this.scrollContainer.current);
            this.refresh();
        }
    }

    public componentDidUpdate() {
        this.refresh();
    }

    public onScroll = (e: any) => {
        this.gridRenderer.onScroll(
            e.target.scrollLeft,
            e.target.scrollTop
        );
    }

    public render() {
        return (
            <div
                data-presto-grid="true"
                ref={this.scrollContainer}
                style={{overflow: "auto", width: this.props.width, height: this.props.height, marginLeft: 10}} />
        );
    }
}

export default PrestoGrid;
export { IPrestoGridProps, IHeaderStyleProps, ICellStyleProps, ISchemaProps, Alignment };