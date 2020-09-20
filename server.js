const express = require('express');
const compression = require('compression');
const { draw } = require('./drawserver/draw');

const app = express();

if (process.env.NODE_ENV === 'production') {
  app.use(express.static('dist', { maxAge: 6.048e8 }));
} else {
  app.use(express.static('dist'));
}

app.get('/api/draw/:object', compression(), async (request, response) => {
  const canvas = await draw(
    JSON.parse(decodeURIComponent(request.params.object))
  );
  response.setHeader('Cache-Control', `public, max-age=${604800}`);
  response.send(canvas.toBuffer('image/png'));
});

const port = process.env.PORT || 8080;

app.listen(port, () => {
  console.log('Listening on port ' + port);
});
