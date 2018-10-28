import { ITextMeasurer } from "../types";

class TextMeasurer implements ITextMeasurer {
    private context: CanvasRenderingContext2D

    constructor(context: CanvasRenderingContext2D) {
        this.context = context;
    }

    public measureText(text: string) {
        return this.context.measureText(text).width;
    }

    public setFont(font: string) {
        this.context.font = font;
    }
}

export default TextMeasurer;