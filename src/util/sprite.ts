import { Sprite, Texture } from 'pixi.js';

export async function sprite(filename: string) {
  const t = await Texture.fromURL(`/images/${filename}`);
  return new Sprite(t);
}
