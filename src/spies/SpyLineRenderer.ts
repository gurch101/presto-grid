import { ILineRenderer } from "../types";

class SpyLineRenderer implements ILineRenderer {
    public renderHorizontalLineCalledWith: any[] = [];
    public renderVerticalLineCalledWith: any[] = [];

    public renderHorizontalLine(fromX: number, toX: number, y: number) {
        this.renderHorizontalLineCalledWith.push({fromX, toX, y});
    }

    public renderVerticalLine(fromY: number, toY: number, x: number) {
        this.renderVerticalLineCalledWith.push({fromY, toY, x});
    }
}

export default SpyLineRenderer;