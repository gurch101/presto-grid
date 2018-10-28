import { ILineRenderer } from "../types";

class SpyLineRenderer implements ILineRenderer {
    public renderHorizontalLineCalledWith: any[] = [];
    public renderVerticalLineCalledWith: any[] = [];
    public setLineColorCalledWith: any[] = [];
    public setVisibleAreaCalledWith: any[] = [];

    public setLineColor(color: string) {
        this.setLineColorCalledWith.push(color);
    }

    public renderHorizontalLine(fromX: number, toX: number, y: number) {
        this.renderHorizontalLineCalledWith.push({fromX, toX, y});
    }

    public renderVerticalLine(fromY: number, toY: number, x: number) {
        this.renderVerticalLineCalledWith.push({fromY, toY, x});
    }

    public setVisibleArea(x: number, y: number, width: number, height: number){
        this.setVisibleAreaCalledWith.push({x, y, width, height});
    }

    public unsetVisibleArea() {
        return null;
    }
}

export default SpyLineRenderer;