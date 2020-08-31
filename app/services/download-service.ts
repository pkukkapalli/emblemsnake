import { PartPosition } from '../stores/editor-store';
import { Part } from '../constants/parts';
import { drawPart } from './draw-service';

export enum DownloadOrientation {
  DESKTOP_LEFT_ALIGN,
  DESKTOP_CENTER_ALIGN,
  DESKTOP_RIGHT_ALIGN,
  PHONE,
}

const BLACK = '#000000';
const WHITE = '#ffffff';
const DESKTOP_WIDTH = 1920;
const DESKTOP_HEIGHT = 1080;
const PHONE_WIDTH = 759;
const PHONE_HEIGHT = 1334;

function createCanvas(width: number, height: number) {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  return canvas;
}

function shiftForOrientation(
  position: PartPosition,
  orientation: DownloadOrientation,
  targetCanvas: HTMLCanvasElement
) {
  switch (orientation) {
    case DownloadOrientation.DESKTOP_LEFT_ALIGN:
      return {
        x: position.x - Math.floor(targetCanvas.width / 4),
        y: position.y,
      };
    case DownloadOrientation.DESKTOP_RIGHT_ALIGN:
      return {
        x: position.x + Math.floor(targetCanvas.width / 4),
        y: position.y,
      };
    case DownloadOrientation.DESKTOP_CENTER_ALIGN:
    case DownloadOrientation.PHONE:
      return position;
  }
}

function positionToCoordinates(
  position: PartPosition,
  sourceCanvas: HTMLCanvasElement,
  targetCanvas: HTMLCanvasElement
) {
  const canvasSize = Math.min(sourceCanvas.width, sourceCanvas.height);
  const xDiff = (position.x / 100) * canvasSize;
  const yDiff = (position.y / 100) * canvasSize;
  return {
    x: (targetCanvas.width - sourceCanvas.width) / 2 + xDiff,
    y: (targetCanvas.height - sourceCanvas.height) / 2 + yDiff,
  };
}

function drawCanvas(
  { x, y }: PartPosition,
  rotation: number,
  context: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement
) {
  const rotationRadians = (rotation * Math.PI) / 180;
  context.rotate(rotationRadians);
  context.drawImage(
    canvas,
    Math.floor(x),
    Math.floor(y),
    canvas.width,
    canvas.height
  );
  context.rotate(-rotationRadians);
}

export async function download(
  orientation: DownloadOrientation,
  {
    backChoice,
    backPrimaryColor = BLACK,
    backSecondaryColor = WHITE,
    backPosition = { x: 0, y: 0 },
    backScale = 1,
    backRotation = 0,
    frontChoice,
    frontPrimaryColor = BLACK,
    frontSecondaryColor = WHITE,
    frontPosition = { x: 0, y: 0 },
    frontScale = 1,
    frontRotation = 0,
    word1Choice,
    word1PrimaryColor = BLACK,
    word1SecondaryColor = WHITE,
    word1Position = { x: 0, y: 0 },
    word1Scale = 1,
    word1Rotation = 0,
    word2Choice,
    word2PrimaryColor = BLACK,
    word2SecondaryColor = WHITE,
    word2Position = { x: 0, y: 0 },
    word2Scale = 1,
    word2Rotation = 0,
  }: {
    backChoice?: Part;
    backPrimaryColor?: string;
    backSecondaryColor?: string;
    backPosition?: PartPosition;
    backScale?: number;
    backRotation?: number;
    frontChoice?: Part;
    frontPrimaryColor?: string;
    frontSecondaryColor?: string;
    frontPosition?: PartPosition;
    frontScale?: number;
    frontRotation?: number;
    word1Choice?: Part;
    word1PrimaryColor?: string;
    word1SecondaryColor?: string;
    word1Position?: PartPosition;
    word1Scale?: number;
    word1Rotation?: number;
    word2Choice?: Part;
    word2PrimaryColor?: string;
    word2SecondaryColor?: string;
    word2Position?: PartPosition;
    word2Scale?: number;
    word2Rotation?: number;
  }
): Promise<void> {
  let wallpaperWidth;
  let wallpaperHeight;
  let partSize;
  switch (orientation) {
    case DownloadOrientation.DESKTOP_LEFT_ALIGN:
    case DownloadOrientation.DESKTOP_CENTER_ALIGN:
    case DownloadOrientation.DESKTOP_RIGHT_ALIGN:
      wallpaperWidth = DESKTOP_WIDTH;
      wallpaperHeight = DESKTOP_HEIGHT;
      partSize = wallpaperHeight / 2;
      break;
    case DownloadOrientation.PHONE:
      wallpaperWidth = PHONE_WIDTH;
      wallpaperHeight = PHONE_HEIGHT;
      partSize = wallpaperWidth;
      break;
  }

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

  const canvas = createCanvas(wallpaperWidth, wallpaperHeight);
  const context = canvas.getContext('2d');
  if (!context) {
    return;
  }

  drawCanvas(
    shiftForOrientation(
      positionToCoordinates(backPosition, backCanvas, context.canvas),
      orientation,
      context.canvas
    ),
    backRotation,
    context,
    backCanvas
  );
  drawCanvas(
    shiftForOrientation(
      positionToCoordinates(frontPosition, frontCanvas, context.canvas),
      orientation,
      context.canvas
    ),
    frontRotation,
    context,
    frontCanvas
  );
  drawCanvas(
    shiftForOrientation(
      positionToCoordinates(word1Position, word1Canvas, context.canvas),
      orientation,
      context.canvas
    ),
    word1Rotation,
    context,
    word1Canvas
  );
  drawCanvas(
    shiftForOrientation(
      positionToCoordinates(word2Position, word2Canvas, context.canvas),
      orientation,
      context.canvas
    ),
    word2Rotation,
    context,
    word2Canvas
  );

  const link = document.createElement('a');
  link.download = 'emblem.jpg';
  link.href = canvas.toDataURL('image/jpeg');
  link.click();
}
