import { Sprite, Texture } from 'pixi.js';

export async function sprite(path: string) {
  const t = await Texture.fromURL(path);
  return new Sprite(t);
}
