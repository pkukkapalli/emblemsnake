import { PartPosition } from '../stores/editor-store';
import { Part } from '../constants/parts';
import { drawPart } from './draw-service';

const BLACK = '#000000';
const WHITE = '#ffffff';
const WALLPAPER_WIDTH = 1920;
const WALLPAPER_HEIGHT = 1080;

function createCanvas() {
  const canvas = document.createElement('canvas');
  canvas.width = WALLPAPER_WIDTH;
  canvas.height = WALLPAPER_HEIGHT;
  return canvas;
}

function positionToCoordinates({ x, y }: PartPosition, canvasSize: number) {
  return {
    x: (x / 100) * canvasSize,
    y: (y / 100) * canvasSize,
  };
}

function drawCanvas(
  context: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  position: PartPosition,
  scale: number
) {
  const canvasSize = Math.min(context.canvas.width, context.canvas.height);
  const { x, y } = positionToCoordinates(position, canvasSize);
  context.drawImage(canvas, x, y, canvas.width * scale, canvas.height * scale);
}

export async function download({
  backChoice,
  backPrimaryColor = BLACK,
  backSecondaryColor = WHITE,
  backPosition = { x: 0, y: 0 },
  backScale = 1,
  frontChoice,
  frontPrimaryColor = BLACK,
  frontSecondaryColor = WHITE,
  frontPosition = { x: 0, y: 0 },
  frontScale = 1,
  word1Choice,
  word1PrimaryColor = BLACK,
  word1SecondaryColor = WHITE,
  word1Position = { x: 0, y: 0 },
  word1Scale = 1,
  word2Choice,
  word2PrimaryColor = BLACK,
  word2SecondaryColor = WHITE,
  word2Position = { x: 0, y: 0 },
  word2Scale = 1,
}: {
  backChoice?: Part;
  backPrimaryColor?: string;
  backSecondaryColor?: string;
  backPosition?: PartPosition;
  backScale?: number;
  frontChoice?: Part;
  frontPrimaryColor?: string;
  frontSecondaryColor?: string;
  frontPosition?: PartPosition;
  frontScale?: number;
  word1Choice?: Part;
  word1PrimaryColor?: string;
  word1SecondaryColor?: string;
  word1Position?: PartPosition;
  word1Scale?: number;
  word2Choice?: Part;
  word2PrimaryColor?: string;
  word2SecondaryColor?: string;
  word2Position?: PartPosition;
  word2Scale?: number;
}): Promise<void> {
  const backCanvas = createCanvas();
  const frontCanvas = createCanvas();
  const word1Canvas = createCanvas();
  const word2Canvas = createCanvas();

  await drawPart(backCanvas, backChoice, backPrimaryColor, backSecondaryColor);
  await drawPart(
    frontCanvas,
    frontChoice,
    frontPrimaryColor,
    frontSecondaryColor
  );
  await drawPart(
    word1Canvas,
    word1Choice,
    word1PrimaryColor,
    word1SecondaryColor
  );
  await drawPart(
    word2Canvas,
    word2Choice,
    word2PrimaryColor,
    word2SecondaryColor
  );

  const canvas = createCanvas();
  const context = canvas.getContext('2d');
  if (!context) {
    return;
  }

  drawCanvas(context, backCanvas, backPosition, backScale);
  drawCanvas(context, frontCanvas, frontPosition, frontScale);
  drawCanvas(context, word1Canvas, word1Position, word1Scale);
  drawCanvas(context, word2Canvas, word2Position, word2Scale);

  const link = document.createElement('a');
  link.download = 'emblem.jpg';
  link.href = canvas.toDataURL('image/jpeg');
  link.click();
}
