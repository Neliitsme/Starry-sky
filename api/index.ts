const Two = require('two.js');
import { createCanvas, Image } from 'canvas';
import type { VercelRequest, VercelResponse } from '@vercel/node';

const WIDTH = 440;
const HEIGHT = 200;
const BORDER_RADIUS = 7;
const STARS_AMOUNT = 500;

// Colors taken from here: http://www.vendian.org/mncharity/dir3/starcolor/
const STAR_COLORS = {
  O: [155, 176, 255],
  B: [170, 191, 255],
  A: [202, 215, 255],
  F: [248, 247, 255],
  G: [255, 244, 234],
  K: [255, 210, 161],
  M: [255, 204, 111],
};
const SKY_COLOR = '#2C3E50';

export default (req: VercelRequest, res: VercelResponse) => {
  req.query;
  res.setHeader('Content-Type', 'image/svg+xml');
  res.setHeader('Cache-Control', 'public, max-age=14400');
  res
    .status(200)
    .send(getStarrySky(WIDTH, HEIGHT, BORDER_RADIUS, STARS_AMOUNT, SKY_COLOR));
};

function getStarrySky(
  width: number,
  height: number,
  border_radius: number,
  stars_amount: number,
  sky_color: string,
): Buffer {
  const canvas = createCanvas(width, height, 'svg');
  Two.Utils.shim(canvas, Image);

  let params = {
    width: width,
    height: height,
    domElement: canvas,
  };

  let two = new Two(params);

  const sky = two.makeRoundedRectangle(
    width / 2,
    height / 2,
    width,
    height,
    border_radius,
  );
  sky.fill = sky_color;

  for (let i = 0; i < stars_amount; i++) {
    let randWidth = getRandomNumber(border_radius, width - border_radius);
    let randHeight = getRandomNumber(border_radius, height - border_radius);
    let randColor = getRandomColor();
    let alpha = 1;

    let circle = two.makeCircle(randWidth, randHeight, getRandomNumber(1, 3));
    circle.fill = `rgba(${randColor[0]}, ${randColor[1]}, ${randColor[2]}, ${alpha})`;
    circle.noStroke();
    circle.scale = 1;
  }

  two.render();
  return canvas.toBuffer();
}

function getRandomNumber(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function getRandomColor(): Array<number> {
  const keys = Object.keys(STAR_COLORS);
  const randIndex = Math.floor(Math.random() * keys.length);
  const randKey = keys[randIndex];
  return STAR_COLORS[randKey as keyof typeof STAR_COLORS];
}
