import 'reflect-metadata';
import 'zone.js/dist/zone-node';

import {enableProdMode} from '@angular/core';
import {renderModuleFactory} from '@angular/platform-server';
import {provideModuleMap} from '@nguniversal/module-map-ngfactory-loader';
import bodyParser from 'body-parser';
import compression from 'compression';
import express from 'express';
import {existsSync, readdir, readFileSync} from 'fs';
import Jimp from 'jimp/es';
import {join} from 'path';

enableProdMode();

// Express server
const app = express();

app.use(compression());

const PORT = process.env.PORT || 3000;
let DIST_FOLDER = join(process.cwd(), 'dist');

if (!existsSync(DIST_FOLDER)) {
  DIST_FOLDER = join(process.cwd());
}

// thumbs
const thumbs = [];
readdir(join(DIST_FOLDER, 'browser', 'assets', 'images'), (err, filenames) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  for (const filename of filenames) {
    Jimp.read('dist/browser/assets/images/' + filename)
        .then((image) => {
          const thumb = image.resize(100, Jimp.AUTO).greyscale().blur(1).quality(60);
          thumb.getBufferAsync(Jimp.MIME_PNG).then((d) => thumbs.push({name: filename, data: d}));
          console.log('processed: ' + filename);
        })
        .catch((e) => console.error(e));
  }
});

// covers
const covers = [];
Jimp.read(join(DIST_FOLDER, 'browser', 'assets', 'images', 'cover.png')).then((image) => {
  const SIZES = [1440, 1024, 768, 425, 320];
  for (const size of SIZES) {
    image.resize(size, Jimp.AUTO)
        .quality(100)
        .getBufferAsync(Jimp.MIME_PNG)
        .then((d: Buffer) => covers.push({size: size, data: d}));
  }
});

const template = readFileSync(join(DIST_FOLDER, 'browser', 'index.html')).toString();
const {AppServerModuleNgFactory, LAZY_MODULE_MAP} = require('./dist/server/main');

let renderedPage: string;
async function renderHtml(): Promise<string> {
  if (!renderedPage) {
    const html = await renderModuleFactory(
        AppServerModuleNgFactory,
        {document: template, url: '/', extraProviders: [provideModuleMap(LAZY_MODULE_MAP)]});
    renderedPage = html;
  }
  return renderedPage;
}

renderHtml().then(() => console.log('Rendered page'));

app.set('view engine', 'html');
app.set('views', join(DIST_FOLDER, 'browser'));

// static file location
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());

app.use((_req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

app.get('/thumbs/*', (req, res) => {
  console.log(req.url);
  const thumb = thumbs.find(t => req.url.indexOf(t.name) > -1);
  res.contentType('png');
  res.header('Cache-Control', 'max-age=2629800');
  res.end(thumb.data, 'binary');
});

app.get('/cover', (req, res) => {
  console.log(req.url);
  console.log('requested size: ' + req.query.size);

  res.contentType('png');
  res.header('Cache-Control', 'max-age=2629800');

  const size = parseInt(req.query.size, 10);

  for (const cover of covers) {
    if (size >= cover.size) {
      res.end(cover.data, 'binary');
      console.log('delivered size: ' + cover.size);
      return;
    }
  }

  console.log('delivered size: ' + covers[0].size);
  res.end(covers[0].data, 'binary');
});

// Server static files from /browser
app.get('*.*', express.static(join(DIST_FOLDER, 'browser'), {maxAge: 31557600000}));

// All regular routes use the Universal engine
app.get('*', async (_req, res) => {
  try {
    const html = await renderHtml();
    res.writeHead(200);
    res.write(html);
    res.end();
  } catch (error) {
    res.writeHead(600, error);
    res.end();
  }
});

// Start the Node server
app.listen(PORT, () => {
  console.log(`Node server listening on http://localhost:${PORT}`);
});
