import { ITextMeasurer } from '../types';

export default class SpyTextMeasurer implements ITextMeasurer {
    public measureTextReturn: Map<string, number> = new Map()
    public measureTextCallCount: number = 0;
    public measureTextCalledWith: string[] = [];
    public setFontCalledWith: string;

    public setFont(font: string) {
        this.setFontCalledWith = font;
    }

    public measureText(text: string): number {
        this.measureTextCalledWith.push(text);
        this.measureTextCallCount++;
        return this.measureTextReturn.get(text)!;
    }
}