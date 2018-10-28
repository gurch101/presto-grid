import { IBoundingBox } from '../types';

class CanvasRenderer {
    public readonly context: CanvasRenderingContext2D
    private canvas: HTMLCanvasElement
    private scrollContainer: HTMLElement
    private viewportWidth: number = 0;
    private viewportHeight: number = 0;

    constructor(container: HTMLElement) {
        this.canvas = document.createElement('canvas');
        this.canvas.style.position = 'absolute';
        this.canvas.style.zIndex = "-1";
        const context = this.canvas.getContext('2d');
        if(context === null) {
            throw new Error("Could not get 2d context");
        }
        this.context = context;
        this.scrollContainer = document.createElement('div');
        this.scrollContainer.style.zIndex = "1";
        container.appendChild(this.canvas);
        container.appendChild(this.scrollContainer);
    }

    public resize(viewportWidth: number, viewportHeight: number, containerWidth: number, containerHeight: number) {
        this.viewportWidth = viewportWidth;
        this.viewportHeight = viewportHeight;
        this.resizeViewport(viewportWidth, viewportHeight);
        this.resizeScrollContainer(containerWidth, containerHeight);
    }

    public clear() {
        this.context.clearRect(0, 0, this.viewportWidth, this.viewportHeight);
    }

    private resizeViewport(viewportWidth: number, viewportHeight: number) {
        // TODO: 14, wtf?
        let canvasHeight = viewportHeight - 14;
        let canvasWidth = viewportWidth - 14;
        const canvasStyleHeight = canvasHeight;
        const canvasStyleWidth = canvasWidth;
        if(window.devicePixelRatio) {
          canvasHeight = canvasHeight * window.devicePixelRatio;
          canvasWidth = canvasWidth * window.devicePixelRatio;
        }
        this.canvas.setAttribute('width', canvasWidth.toString());
        this.canvas.setAttribute('height', canvasHeight.toString());
        this.canvas.style.width = canvasStyleWidth.toString();
        this.canvas.style.height = canvasStyleHeight.toString();
    }

    private resizeScrollContainer(containerWidth: number, containerHeight: number) {
        this.scrollContainer.style.width = containerWidth.toString() + "px";
        this.scrollContainer.style.height = containerHeight.toString() + "px";
    }
}

export default CanvasRenderer;