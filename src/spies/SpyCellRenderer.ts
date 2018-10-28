import { Alignment, ICellRenderer } from '../types';

class SpyCellRenderer implements ICellRenderer {
    public setFontCalledWith: any[] = [];
    public setVisibleAreaCalledWith: any[] = [];
    public renderTextCalledWith: any[] = [];
    public fillCellCalledWith: any[] = [];

    public setFont(font: string, color: string) {
        this.setFontCalledWith.push({font, color});
    }

    public setVisibleArea(x: number, y: number, width: number, height: number) {
        this.setVisibleAreaCalledWith.push({x, y, width, height});
    }

    public unsetVisibleArea() {
        return null;
    }

    public renderText(text: string, x: number, y: number, align: Alignment) {
        this.renderTextCalledWith.push({text, x, y, align});
    }

    public fillCell(color: string, x: number, y: number, width: number, height: number) {
        this.fillCellCalledWith.push({color, x, y, width, height});
    }
}

export default SpyCellRenderer;