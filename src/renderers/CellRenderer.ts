import { Alignment } from '../ProntoGrid';
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
        this.context.rect(x, y, width, height);
        this.context.clip();
    }

    public renderText(text: string, x: number, y: number, align: Alignment) {
        this.context.textAlign = align;
        this.context.textBaseline = 'middle';
        this.context.fillText(text, x, y);
    }
}

export default CellRenderer;