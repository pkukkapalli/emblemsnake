#!/usr/bin/env node

const { readFileSync, writeFileSync, createWriteStream } = require('fs');
const { createCanvas } = require('canvas');

const wordGroups = new Set([
  'WORD_NUMBER',
  'WORD_LETTER',
  'WORD_NORMAL',
  'WORD_PHONETIC',
  'WORD_CODENAMES',
]);

function renderWordToImage(word, path) {
  const canvas = createCanvas(1024, 1024);
  const context = canvas.getContext('2d');
  context.imageSmoothingEnabled = true;
  context.textBaseline = 'middle';
  context.textAlign = 'center';
  context.font = '108px "Black Ops One"';
  context.fillStyle = 'black';
  context.fillText(word, 512, 512);
  context.strokeStyle = 'white';
  context.lineWidth = 4;
  context.strokeText(word, 512, 512);

  const out = createWriteStream(path);
  const stream = canvas.createPNGStream();
  stream.pipe(out);
}

const assetsJson = JSON.parse(readFileSync('assets/assets.json'));
for (const key of Object.keys(assetsJson)) {
  const asset = assetsJson[key];

  // Only rendering words
  if (!wordGroups.has(asset.group)) {
    continue;
  }

  renderWordToImage(asset.name, `assets/images/full/${key}.png`);
  assetsJson[key].path = `full/${key}.png`;
}

writeFileSync('assets/assets.json', JSON.stringify(assetsJson));
