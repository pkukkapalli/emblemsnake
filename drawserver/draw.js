const { createCanvas } = require('canvas');
const { drawPart } = require('./part');

/**
 * @enum {string}
 */
const Orientation = Object.freeze({
  DESKTOP_LEFT_ALIGN: 'DESKTOP_LEFT_ALIGN',
  DESKTOP_CENTER_ALIGN: 'DESKTOP_CENTER_ALIGN',
  DESKTOP_RIGHT_ALIGN: 'DESKTOP_RIGHT_ALIGN',
  PHONE: 'PHONE',
  SQUARE: 'SQUARE',
});

const DESKTOP_WIDTH = 1920;
const DESKTOP_HEIGHT = 1080;
const PHONE_WIDTH = 759;
const PHONE_HEIGHT = 1334;
const SQUARE_WIDTH = 1024;
const SQUARE_HEIGHT = 1024;

/**
 * Compute an appropriate size based on the orientation of the emblem.
 * @param {Orientation} orientation
 * @returns {{wallpaperWidth: number, wallpaperHeight: number, partWidth: number, partHeight: number}}
 */
function computeCanvasSizes(orientation) {
  switch (orientation) {
    case Orientation.DESKTOP_LEFT_ALIGN:
    case Orientation.DESKTOP_CENTER_ALIGN:
    case Orientation.DESKTOP_RIGHT_ALIGN:
      return {
        wallpaperWidth: DESKTOP_WIDTH,
        wallpaperHeight: DESKTOP_HEIGHT,
        partWidth: Math.floor(DESKTOP_HEIGHT / 2),
        partHeight: Math.floor(DESKTOP_HEIGHT / 2),
      };
    case Orientation.PHONE:
      return {
        wallpaperWidth: PHONE_WIDTH,
        wallpaperHeight: PHONE_HEIGHT,
        partWidth: PHONE_WIDTH,
        partHeight: PHONE_HEIGHT,
      };
    case Orientation.SQUARE:
      return {
        wallpaperWidth: SQUARE_WIDTH,
        wallpaperHeight: SQUARE_HEIGHT,
        partWidth: SQUARE_WIDTH,
        partHeight: SQUARE_HEIGHT,
      };
    default:
      throw new Error(`invalid orientation ${orientation}`);
  }
}

/**
 * Position the sourceCanvas on the targetCanvas according to the position
 * @param {import('canvas').Canvas} sourceCanvas
 * @param {import('canvas').Canvas} targetCanvas
 * @param {{x: number, y: number}} position
 * @returns {{x: number, y: number}}
 */
function computePositionAsCoordinates(sourceCanvas, targetCanvas, position) {
  const canvasSize = Math.min(sourceCanvas.width, sourceCanvas.height);
  const xDiff = (position.x / 100) * canvasSize;
  const yDiff = (position.y / 100) * canvasSize;
  const x = (targetCanvas.width - sourceCanvas.width) / 2 + xDiff;
  const y = (targetCanvas.height - sourceCanvas.height) / 2 + yDiff;
  return {
    x: Math.floor(x),
    y: Math.floor(y),
  };
}

/**
 * Shift the given position based on the orientation of the target image
 * @param {import('canvas').Canvas} targetCanvas
 * @param {{x: number, y: number}} position
 * @param {Orientation} orientation
 * @returns {{x: number, y: number}}
 */
function shiftPositionForOrientation(targetCanvas, { x, y }, orientation) {
  switch (orientation) {
    case Orientation.DESKTOP_LEFT_ALIGN:
      return {
        x: x - Math.floor(targetCanvas.width / 4),
        y,
      };
    case Orientation.DESKTOP_RIGHT_ALIGN:
      return {
        x: x + Math.floor(targetCanvas.width / 4),
        y,
      };
    default:
      return { x, y };
  }
}

/**
 * Draw the sourceCanvas onto the targetCanvas
 * @param {import('canvas').Canvas} sourceCanvas
 * @param {import('canvas').Canvas} targetCanvas
 * @param {{x: number, y: number}} position
 * @param {Orientation} orientation
 */
function drawOntoCanvas(sourceCanvas, targetCanvas, position, orientation) {
  const { x, y } = shiftPositionForOrientation(
    targetCanvas,
    computePositionAsCoordinates(sourceCanvas, targetCanvas, position),
    orientation
  );
  const context = targetCanvas.getContext('2d');
  context.drawImage(
    sourceCanvas,
    x,
    y,
    sourceCanvas.width,
    sourceCanvas.height
  );
}

/**
 * Render the editor config as a canvas
 * @param {*} editorConfig
 * @returns {Promise<import('canvas').Canvas>}
 */
async function draw({
  backChoice,
  backPrimaryColor,
  backSecondaryColor,
  backPosition,
  backScale,
  backRotation,
  frontChoice,
  frontPrimaryColor,
  frontSecondaryColor,
  frontPosition,
  frontScale,
  frontRotation,
  word1Choice,
  word1PrimaryColor,
  word1SecondaryColor,
  word1Position,
  word1Scale,
  word1Rotation,
  word2Choice,
  word2PrimaryColor,
  word2SecondaryColor,
  word2Position,
  word2Scale,
  word2Rotation,
  orientation,
}) {
  const {
    wallpaperWidth,
    wallpaperHeight,
    partWidth,
    partHeight,
  } = computeCanvasSizes(orientation);

  const targetCanvas = createCanvas(wallpaperWidth, wallpaperHeight);
  const context = targetCanvas.getContext('2d');
  if (orientation !== Orientation.SQUARE) {
    context.fillStyle = '#000000';
    context.fillRect(0, 0, targetCanvas.width, targetCanvas.height);
  }
  context.imageSmoothingEnabled = true;

  if (backChoice) {
    const backCanvas = await drawPart(
      partWidth,
      partHeight,
      `.${backChoice.path}`,
      backPrimaryColor,
      backSecondaryColor,
      backScale,
      backRotation
    );
    drawOntoCanvas(backCanvas, targetCanvas, backPosition, orientation);
  }

  if (frontChoice) {
    const frontCanvas = await drawPart(
      partWidth,
      partHeight,
      `.${frontChoice.path}`,
      frontPrimaryColor,
      frontSecondaryColor,
      frontScale,
      frontRotation
    );
    drawOntoCanvas(frontCanvas, targetCanvas, frontPosition, orientation);
  }

  if (word1Choice) {
    const word1Canvas = await drawPart(
      partWidth,
      partHeight,
      `.${word1Choice.path}`,
      word1PrimaryColor,
      word1SecondaryColor,
      word1Scale,
      word1Rotation
    );
    drawOntoCanvas(word1Canvas, targetCanvas, word1Position, orientation);
  }

  if (word2Choice) {
    const word2Canvas = await drawPart(
      partWidth,
      partHeight,
      `.${word2Choice.path}`,
      word2PrimaryColor,
      word2SecondaryColor,
      word2Scale,
      word2Rotation
    );
    drawOntoCanvas(word2Canvas, targetCanvas, word2Position, orientation);
  }

  return targetCanvas;
}

module.exports = { draw };
