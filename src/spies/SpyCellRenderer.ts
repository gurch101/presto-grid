import { Alignment, ICellRenderer } from '../types';

class SpyCellRenderer implements ICellRenderer {
    public setFontCalledWith: any[] = [];
    public setVisibleAreaCalledWith: any[] = [];
    public renderTextCalledWith: any[] = [];

    public setFont(font: string) {
        this.setFontCalledWith.push(font);
    }

    public setVisibleArea(x: number, y: number, width: number, height: number) {
        this.setVisibleAreaCalledWith.push({x, y, width, height});
    }

    public renderText(text: string, x: number, y: number, align: Alignment) {
        this.renderTextCalledWith.push({text, x, y, align});
    }
}

export default SpyCellRenderer;