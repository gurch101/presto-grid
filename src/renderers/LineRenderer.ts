import { ILineRenderer } from "../types";

class LineRenderer implements ILineRenderer {
    private readonly context: CanvasRenderingContext2D;

    constructor(context: CanvasRenderingContext2D) {
        this.context = context;
    }

    public setLineColor(color: string) {
        this.context.strokeStyle = color;
    }

    public renderHorizontalLine(fromX: number, toX: number, y: number) {
        const adjustedY = y + 0.5;
        this.renderLine(fromX, adjustedY, toX, adjustedY);
    }

    public renderVerticalLine(fromY: number, toY: number, x: number) {
        const adjustedX = x + 0.5;
        this.renderLine(adjustedX, fromY, adjustedX, toY);
    }

    public setVisibleArea(x: number, y: number, width: number, height: number) {
        this.context.save();
        this.context.rect(x, y, width, height);
        this.context.clip();
    }

    public unsetVisibleArea() {
        this.context.restore();
    }

    private renderLine(fromX: number, fromY: number, toX: number, toY: number) {
        this.context.beginPath();
        this.context.moveTo(fromX, fromY);
        this.context.lineTo(toX, toY);
        this.context.stroke();
    }
}

export default LineRenderer;