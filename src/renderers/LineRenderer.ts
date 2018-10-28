import { ILineRenderer } from "../types";

class LineRenderer implements ILineRenderer {
    private readonly context: CanvasRenderingContext2D;

    constructor(context: CanvasRenderingContext2D) {
        this.context = context;
    }

    public renderHorizontalLine(fromX: number, toX: number, y: number) {
        this.renderLine(fromX, y + 0.5, toX, y + 0.5);
    }

    public renderVerticalLine(fromY: number, toY: number, x: number) {
        this.renderLine(x + 0.5, fromY, x + 0.5, toY);
    }

    private renderLine(fromX: number, fromY: number, toX: number, toY: number) {
        this.context.beginPath();
        this.context.moveTo(fromX, fromY);
        this.context.lineTo(toX, toY);
        this.context.stroke();
    }
}

export default LineRenderer;