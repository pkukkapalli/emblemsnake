import { Part } from '../constants/parts';

function createImage(src: string) {
  const image = new Image();
  image.src = src;
  return image;
}

function clearCanvas(
  canvas: HTMLCanvasElement,
  context: CanvasRenderingContext2D
) {
  context.clearRect(0, 0, Math.floor(canvas.width), Math.floor(canvas.height));
}

function drawImage(
  canvas: HTMLCanvasElement,
  context: CanvasRenderingContext2D,
  image: HTMLImageElement
) {
  const canvasWidth = Math.floor(canvas.width);
  const canvasHeight = Math.floor(canvas.height);

  const size = Math.min(canvasWidth, canvasHeight);
  const x = Math.floor(Math.max(0, (canvas.width - canvas.height) / 2));
  const y = Math.floor(Math.max(0, (canvas.height - canvas.width) / 2));

  context.drawImage(image, x, y, size, size);
}

function parseColor(color: string) {
  return {
    r: Number.parseInt(color.substring(1, 3), 16),
    g: Number.parseInt(color.substring(3, 5), 16),
    b: Number.parseInt(color.substring(5, 7), 16),
  };
}

function scaleColor(color: string, scale: number) {
  const { r, g, b } = parseColor(color);
  return {
    r: Math.floor(scale * r),
    g: Math.floor(scale * g),
    b: Math.floor(scale * b),
  };
}

function applyColor(
  canvas: HTMLCanvasElement,
  context: CanvasRenderingContext2D,
  primaryColor?: string,
  secondaryColor?: string
) {
  const canvasWidth = Math.floor(canvas.width);
  const canvasHeight = Math.floor(canvas.height);
  const imageData = context.getImageData(0, 0, canvasWidth, canvasHeight);

  for (let row = 0; row < canvasHeight; row++) {
    for (let col = 0; col < canvasWidth; col++) {
      const index = row * canvasWidth * 4 + col * 4;
      const r = imageData.data[index];
      const g = imageData.data[index + 1];
      const b = imageData.data[index + 2];
      const a = imageData.data[index + 3];
      const scale = (r + g + b) / (255 * 3);

      if (r < 128 && g < 128 && b < 128 && a > 0) {
        const color = scaleColor(primaryColor || '#000000', 1 - scale);
        imageData.data[index] = color.r;
        imageData.data[index + 1] = color.g;
        imageData.data[index + 2] = color.b;
      } else if (r >= 128 && g >= 128 && b >= 128 && a > 0) {
        const color = scaleColor(secondaryColor || '#ffffff', scale);
        imageData.data[index] = color.r;
        imageData.data[index + 1] = color.g;
        imageData.data[index + 2] = color.b;
      }
    }
  }

  context.putImageData(imageData, 0, 0);
}

export async function drawPart(
  canvas?: HTMLElement | null,
  choice?: Part,
  primaryColor?: string,
  secondaryColor?: string
): Promise<void> {
  if (!choice || !canvas || !(canvas instanceof HTMLCanvasElement)) {
    return;
  }

  const context = canvas.getContext('2d');
  if (!context) {
    return;
  }

  const image = createImage(choice.path);

  return new Promise(resolve => {
    image.onload = () => {
      clearCanvas(canvas, context);
      const offscreenCanvas = document.createElement('canvas');
      offscreenCanvas.width = canvas.width * 2;
      offscreenCanvas.height = canvas.height * 2;
      const offscreenContext = offscreenCanvas.getContext('2d');
      if (!offscreenContext) {
        return;
      }
      clearCanvas(offscreenCanvas, offscreenContext);
      drawImage(offscreenCanvas, offscreenContext, image);
      applyColor(
        offscreenCanvas,
        offscreenContext,
        primaryColor,
        secondaryColor
      );
      context.drawImage(
        offscreenCanvas,
        0,
        0,
        offscreenCanvas.width,
        offscreenCanvas.height,
        0,
        0,
        canvas.width,
        canvas.height
      );
      resolve();
    };
  });
}
