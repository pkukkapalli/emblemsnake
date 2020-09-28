const { createCanvas, loadImage } = require('canvas');

const BLACK = '#000000';
const WHITE = '#ffffff';

/**
 * Parse a seven-character CSS hex code into RGB values.
 * @param {string} color
 * @returns {{r: number, g: number, b: number}}
 */
function parseColor(color) {
  return {
    r: Number.parseInt(color.substring(1, 3), 16),
    g: Number.parseInt(color.substring(3, 5), 16),
    b: Number.parseInt(color.substring(5, 7), 16),
  };
}

/**
 * Rotate the given canvas
 * @param {import('canvas').Canvas} canvas The canvas to rotate
 * @param {number} rotation The number of degrees to rotate by
 */
function applyRotation(canvas, rotation) {
  const rotationRadians = (rotation * Math.PI) / 180;
  const centerWidth = Math.floor(canvas.width / 2);
  const centerHeight = Math.floor(canvas.height / 2);
  const context = canvas.getContext('2d');
  context.translate(centerWidth, centerHeight);
  context.rotate(rotationRadians);
  context.translate(-centerWidth, -centerHeight);
}

/**
 * Center the given image onto the canvas
 * @param {import('canvas').Canvas} canvas The canvas to draw on
 * @param {import('canvas').Image} image The image to draw
 */
function drawImage(canvas, image) {
  const canvasWidth = Math.floor(canvas.width);
  const canvasHeight = Math.floor(canvas.height);
  const size = Math.min(canvasWidth, canvasHeight);
  const x = Math.floor(Math.max(0, (canvas.width - canvas.height) / 2));
  const y = Math.floor(Math.max(0, (canvas.height - canvas.width) / 2));
  const context = canvas.getContext('2d');
  context.drawImage(image, x, y, size, size);
}

/**
 * Switch the primary and secondary (black and white) to the given colors
 * @param {import('canvas').Canvas} canvas The canvas to color
 * @param {string} primaryColor The color to replace black with
 * @param {string} secondaryColor The color to replace white with
 */
function applyColor(canvas, primaryColor, secondaryColor) {
  const context = canvas.getContext('2d');
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
      const rScale = r / 255;
      const gScale = g / 255;
      const bScale = b / 255;

      if (r < 128 && g < 128 && b < 128 && a > 0) {
        const color = parseColor(primaryColor || BLACK);
        imageData.data[index] = color.r;
        imageData.data[index + 1] = color.g;
        imageData.data[index + 2] = color.b;
        imageData.data[index + 3] = 255;
      } else if (r >= 128 && g >= 128 && b >= 128 && a > 0) {
        const color = parseColor(secondaryColor || WHITE);
        imageData.data[index] = color.r;
        imageData.data[index + 1] = color.g;
        imageData.data[index + 2] = color.b;
      }
    }
  }

  context.putImageData(imageData, 0, 0);
}

/**
 * Draws the given part out to a canvas
 * @param {number} partWidth width of the resulting image
 * @param {number} partHeight height of the resulting image
 * @param {string} imagePath the path to the image file
 * @param {string} primaryColor the primary color to apply
 * @param {string} secondaryColor the secondary color to apply
 * @param {number} scale the factor to scale the resulting image by
 * @param {number} rotation the degrees to rotate the image by
 * @returns {Promise<import('canvas').Canvas>}
 */
async function drawPart(
  partWidth,
  partHeight,
  imagePath,
  primaryColor,
  secondaryColor,
  scale,
  rotation
) {
  partWidth = Math.floor(scale * partWidth);
  partHeight = Math.floor(scale * partHeight);
  const canvas = createCanvas(partWidth, partHeight);
  const context = canvas.getContext('2d');
  context.clearRect(0, 0, canvas.width, canvas.height);
  const image = await loadImage(imagePath);
  applyRotation(canvas, rotation);
  drawImage(canvas, image);
  applyColor(canvas, primaryColor, secondaryColor);
  return canvas;
}

module.exports = { drawPart };
