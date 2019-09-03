import 'reflect-metadata';
import 'zone.js/dist/zone-node';

import {enableProdMode} from '@angular/core';
import {renderModuleFactory} from '@angular/platform-server';
import {provideModuleMap} from '@nguniversal/module-map-ngfactory-loader';
import bodyParser from 'body-parser';
import express from 'express';
import {existsSync, readdir, readFileSync, writeFileSync} from 'fs';
import Jimp from 'jimp';
import {join} from 'path';

enableProdMode();

const data_FILE = './data.json';

if (!existsSync(data_FILE)) {
  writeFileSync(data_FILE, '{}');
}

let data = {};
try {
  data = JSON.parse(readFileSync(data_FILE, {encoding: 'utf8'}));
  console.log(data);
} catch {
}

// thumbs
const thumbs = [];
readdir('dist/browser/assets/images', (err, filenames) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  for (const filename of filenames) {
    Jimp.read('dist/browser/assets/images/' + filename)
        .then((image) => {
          const thumb = image.resize(100, Jimp.AUTO).greyscale().blur(1).quality(60);
          thumb.getBufferAsync(Jimp.MIME_JPEG).then((d) => thumbs.push({name: filename, data: d}));
          // console.log()
          // performance.mark('resize s');
          // image.resize(1024, Jimp.AUTO)
          //     .getBufferAsync(Jimp.MIME_JPEG)
          //     .then((d) => performance.mark('resize e'));
          // performance.measure('resize', 'resize s', 'resize e');
          // console.log(performance.getEntriesByName('resize')[0]);
          console.log('processed: ' + filename);
        })
        .catch((e) => console.error(e));
  }
});


// Express server
const app = express();

const PORT = process.env.PORT || 4000;
const DIST_FOLDER = join(process.cwd(), 'dist');

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
  const thumb = thumbs.find(t => req.url.indexOf(t.name) > -1);
  console.log(req.url);
  res.contentType('jpeg');
  res.end(thumb.data, 'binary');
});

// Server static files from /browser
app.get('*.*', express.static(join(DIST_FOLDER, 'browser')));

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
