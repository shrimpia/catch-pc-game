import { Application, Container, Point, SCALE_MODES, settings, Sprite } from 'pixi.js';
import { Howl } from 'howler';

import { round } from './util/round';
import { sprite } from './util/sprite';
import { sleep } from './util/sleep';

import './style.css';

settings.SCALE_MODE = SCALE_MODES.NEAREST;

const [WIDTH, HEIGHT] = [160, 144];
const SCALE = 4;

const app = new Application({
  width: WIDTH * SCALE,
  height: HEIGHT * SCALE,
  antialias: false,
});

document.getElementById('app')?.appendChild(app.view);

const root = new Container();
root.scale = {
  x: SCALE,
  y: SCALE,
};
app.stage.addChild(root);

let lift: Sprite | null = null;

let gameState: 'beforePlayButton' | 'tutorial' | 'playing' | 'finish' = 'beforePlayButton';

const sounds = new Howl({
  src: ['/sounds/bgm.webm', '/sounds/bgm.mp3'],
  sprite: {
    tutorial: [0, 12800],
    intro: [13453, 12800],
    loop: [26955, 51200]
  }
});

(async () => {
  await loadSounds();
  await initBackground();
  await initCloud();
  await initPlayButton();
})();

function loadSounds() {
  return new Promise<void>((res) => {
    sounds.once('load', res);
  });  
}

async function initBackground() {
  const bgSprite = await sprite('bg.png');
  root.addChild(bgSprite);
}

async function initCloud() {
  const cloud1Sprite = await sprite('cloud.png');
  const cloud2Sprite = await sprite('cloud.png');

  const width = cloud1Sprite.width;
  cloud2Sprite.position.x = width;

  root.addChild(cloud1Sprite);
  root.addChild(cloud2Sprite);
  let frameCount = 0;

  app.ticker.add(() => {
    frameCount++;
    if (frameCount % 16 == 0) {
      cloud1Sprite.position.x -= 1;
      cloud2Sprite.position.x -= 1;
    }

    if (cloud1Sprite.position.x < -width) cloud1Sprite.position.x = cloud2Sprite.position.x + width;
    if (cloud2Sprite.position.x < -width) cloud2Sprite.position.x = cloud1Sprite.position.x + width;
  });
}

async function initPlayButton() {
  const playSprite = await sprite('play.png');
  root.addChild(playSprite);
  playSprite.position.x = (WIDTH - playSprite.width) / 2;
  playSprite.position.y = (HEIGHT - playSprite.height) / 2;
  playSprite.interactive = true;
  playSprite.cursor = 'pointer';

  playSprite.once('click', async () => {
    root.removeChild(playSprite);
    playSprite.destroy();

    gameState = 'tutorial';

    await initLift();
    await tutorial();
  });
}

async function initLift() {
  lift = await sprite('lift.png');
  lift.position = new Point(70, 68);
  let isMoving = false;
  root.addChild(lift);

  // 32 105
  app.view.addEventListener('pointerdown', () => {
    if (gameState !== 'playing' && gameState !== 'tutorial') return;
    isMoving = true;
  });

  // 32 105
  window.addEventListener('pointerup', () => {
    if (gameState !== 'playing' && gameState !== 'tutorial') return;
    isMoving = false;
  });

  app.view.addEventListener('pointermove', (e) => {
    if (gameState !== 'playing' && gameState !== 'tutorial') return;
    if (!isMoving) return;
    if (!lift) return;

    lift.position.x = Math.floor(Math.max(32, Math.min(105, e.clientX / SCALE)));
  });
}

async function tutorial() {
  const arrowDown = await sprite('arrow-down.png');
  const arrowLR = await sprite('arrow-left-right.png');
  const t1 = await sprite('tuto1.png');
  const t2 = await sprite('tuto2.png');
  const t3 = await sprite('tuto3.png');

  sounds.play('intro');
  sounds.volume(0.3);
  sounds.once('end', () => {
    console.log('end');
    sounds.loop(true, sounds.play('loop'));
  });
  arrowDown.position = new Point(16, 16);
  t1.position = new Point(32, 24);
  round(arrowDown);
  round(t1);
  root.addChild(arrowDown, t1);
  await sleep(3200);
  root.removeChild(arrowDown, t1);

  arrowLR.position = new Point((WIDTH - arrowLR.width) / 2, 52);
  t2.position = new Point((WIDTH - t2.width) / 2, 44);
  round(arrowLR);
  round(t2);
  root.addChild(arrowLR, t2);
  await sleep(3200);
  root.removeChild(arrowLR, t2);

  t3.position = new Point((WIDTH - t3.width) / 2, 52);
  round(t3);
  root.addChild(t3);
  await sleep(3200);
  root.removeChild(t3);
}
