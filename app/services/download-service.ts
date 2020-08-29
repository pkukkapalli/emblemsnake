import { PartPosition } from '../stores/editor-store';
import { Part } from '../constants/parts';
import { drawPart } from './draw-service';
import { parts } from 'lit-html';

const BLACK = '#000000';
const WHITE = '#ffffff';
const WALLPAPER_WIDTH = 1920;
const WALLPAPER_HEIGHT = 1080;

function createCanvas(width: number, height: number) {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  return canvas;
}

function positionToCoordinates(
  position: PartPosition,
  originalSize: number,
  sourceCanvas: HTMLCanvasElement,
  targetCanvas: HTMLCanvasElement
) {
  const xDiff = position.x / 100 * originalSize;
  const yDiff = position.y / 100 * originalSize;
  return {
    x: (targetCanvas.width - sourceCanvas.width) / 2 + xDiff,
    y: (targetCanvas.height - sourceCanvas.height) / 2 + yDiff,
  };
}

function drawCanvas(
  {x, y}: PartPosition,
  context: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement
) {
  context.drawImage(canvas, Math.floor(x), Math.floor(y), canvas.width, canvas.height);
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
  const partSize = Math.floor(WALLPAPER_HEIGHT / 2);
  const backCanvas = createCanvas(
    Math.floor(partSize * backScale),
    Math.floor(partSize * backScale)
  );
  const frontCanvas = createCanvas(
    Math.floor(partSize * frontScale),
    Math.floor(partSize * frontScale)
  );
  const word1Canvas = createCanvas(
    Math.floor(partSize * word1Scale),
    Math.floor(partSize * word1Scale)
  );
  const word2Canvas = createCanvas(
    Math.floor(partSize * word2Scale),
    Math.floor(partSize * word2Scale)
  );

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

  const canvas = createCanvas(WALLPAPER_WIDTH, WALLPAPER_HEIGHT);
  const context = canvas.getContext('2d');
  if (!context) {
    return;
  }

  drawCanvas(positionToCoordinates(backPosition, partSize, backCanvas, context.canvas), context, backCanvas);
  drawCanvas(positionToCoordinates(frontPosition, partSize, frontCanvas, context.canvas), context, frontCanvas);
  drawCanvas(positionToCoordinates(word1Position, partSize, word1Canvas, context.canvas), context, word1Canvas);
  drawCanvas(positionToCoordinates(word2Position, partSize, word2Canvas, context.canvas), context, word2Canvas);

  const link = document.createElement('a');
  link.download = 'emblem.jpg';
  link.href = canvas.toDataURL('image/jpeg');
  link.click();
}
