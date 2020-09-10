const express = require('express');
const compression = require('compression');
const cors = require('cors');
const { draw } = require('./draw');

const app = express();

const corsOptions = {
  origin: ['http://localhost:8000'],
};

app.get(
  '/draw/:object',
  cors(corsOptions),
  compression(),
  async (request, response) => {
    const canvas = await draw(
      JSON.parse(decodeURIComponent(request.params.object))
    );
    response.setHeader('Cache-Control', `public, max-age=${604800}`);
    response.send(canvas.toBuffer('image/png'));
  }
);

app.listen(8080, () => {
  console.log('Listening on port 8080');
});
