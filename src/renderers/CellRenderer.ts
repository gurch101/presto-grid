import { Alignment } from '../PrestoGrid';
import { ICellRenderer } from '../types';

class CellRenderer implements ICellRenderer {
    private readonly context: CanvasRenderingContext2D;

    constructor(context: CanvasRenderingContext2D) {
        this.context = context;
    }

    public setFont(font: string) {
        this.context.font = font;
    }

    public setVisibleArea(x: number, y: number, width: number, height: number) {
        this.context.save();
        this.context.rect(x, y, width, height);
        this.context.clip();
    }

    public unsetVisibleArea() {
        this.context.restore();
    }

    public fillCell(color: string, x: number, y: number, width: number, height: number) {
        this.context.save();
        this.context.fillStyle = color;
        this.context.fillRect(x, y, width, height);
        this.context.restore();
    }

    public renderText(text: string, x: number, y: number, align: Alignment) {
        this.context.textAlign = align;
        this.context.textBaseline = 'middle';
        this.context.fillText(text, x, y);
    }
}

export default CellRenderer;