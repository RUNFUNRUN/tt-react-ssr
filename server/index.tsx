import express from 'express';
import { renderToString } from 'react-dom/server';
import App from '../src/app';
import '../src/index.css';

const app = express();
const PORT = process.env.PORT || 9000;

app.use(express.static('public'));

app.get('*', (_req, res) => {
  const appString = renderToString(<App />);

  const html = `
    <!DOCTYPE html>
    <html lang="ja">
      <head>
        <meta charset="UTF-8" />
        <title>React SSR App</title>
        <link rel="stylesheet" href="/styles.css" />
      </head>
      <body>
        <div id="root">${appString}</div>
        <script src="/client.bundle.js"></script>
      </body>
    </html>
  `;
  res.send(html);
});

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
