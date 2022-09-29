import { DisplayObject } from 'pixi.js';

export function round(obj: DisplayObject) {
  obj.position.x = Math.round(obj.position.x);
  obj.position.y = Math.round(obj.position.y);
}
