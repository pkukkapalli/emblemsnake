const express = require('express');
const compression = require('compression');
const cors = require('cors');
const { draw } = require('./draw');

const app = express();

app.get('/api/healthcheck', (request, response) => {
  response.send('Healthy');
});

app.get(
  '/api/draw/:object',
  cors(),
  compression(),
  async (request, response) => {
    const buffer = await draw(
      JSON.parse(decodeURIComponent(request.params.object))
    );
    response.setHeader('Cache-Control', `public, max-age=${2592000}`);
    response.send(buffer);
  }
);

app.listen(8080, () => {
  console.log('Listening on port 8080');
});
