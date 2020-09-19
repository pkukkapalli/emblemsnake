const express = require('express');
const compression = require('compression');
const { draw } = require('./drawserver/draw');

const app = express();

if (process.env.NODE_ENV === 'production') {
  app.use(express.static('dist', { maxAge: 6.048e8 }));
} else {
  app.use(express.static('.'));
}

app.get('/api/draw/:object', compression(), async (request, response) => {
  const canvas = await draw(
    JSON.parse(decodeURIComponent(request.params.object))
  );
  response.setHeader('Cache-Control', `public, max-age=${604800}`);
  response.send(canvas.toBuffer('image/png'));
});

app.listen(8080, () => {
  console.log('Listening on port 8080');
});
