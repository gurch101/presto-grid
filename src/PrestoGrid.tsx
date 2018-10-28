import * as React from 'react';
import HeaderStyles from './HeaderStyles';
import GridCanvasRenderer from './renderers/GridCanvasRenderer';
import RowStyles from './RowStyles';
import { Alignment, ICellStyleProps, ICellStyles, IHeaderStyleProps, IRowStyles, ISchema } from './types';

interface ISchemaProps {
    key: string,
    label: string,
    align?: Alignment,
    valueFormatter?: (value: any) => string
};

interface IPrestoGridProps {
    width: number;
    height: number;
    styles?: ICellStyleProps
    schema: ISchemaProps[]
    rows: object[]
}

const getSchema = (schemaProps: ISchemaProps[]): ISchema[] => {
    return schemaProps.map(schema => ({
        ...schema,
        align: schema.align  || Alignment.Center
    }));
}

const getStyles = (cellStyleProps: ICellStyleProps = {}): ICellStyles => {
    return {
        headerStyles: new HeaderStyles(cellStyleProps.headerStyles),
        rowStyles: new RowStyles(cellStyleProps.rowStyles),
    };
};


class PrestoGrid extends React.Component<IPrestoGridProps> {
    private scrollContainer = React.createRef<HTMLDivElement>()
    private gridRenderer: GridCanvasRenderer

    public refresh() {
        this.gridRenderer
            .setWidth(this.props.width)
            .setHeight(this.props.height)
            .setStyles(getStyles(this.props.styles))
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