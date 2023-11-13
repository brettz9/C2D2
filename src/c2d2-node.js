import fs from 'fs';
import {JSDOM} from 'jsdom';
import {createCanvas} from 'canvas';

import c2d2 from './c2d2.js';

const {window: win} = new JSDOM();

/**
 * @param {object} cfg
 * @param {string} cfg.path
 * @param {number} cfg.width
 * @param {number} cfg.height
 * @returns {void}
 */
function writeToDisk ({path, width, height}) {
  const el = createCanvas();
  if (width) {
    el.width = width;
  }
  if (height) {
    el.height = height;
  }
  const out = fs.createWriteStream(path);
  const stream = el.createPNGStream();
  stream.on('data', (chunk) => {
    out.write(chunk);
  });
  stream.on('end', () => {
    out.end();
  });
}

c2d2.setWriteToDisk(writeToDisk);
c2d2.setWindow(win);

export default c2d2;
