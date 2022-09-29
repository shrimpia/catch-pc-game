import { Container } from 'pixi.js';

export function intersects(obj1: Container, obj2: Container) {
  const b1 = obj1.getBounds();
  const b2 = obj2.getBounds();
  return b1.right > b2.left && b1.left < b2.right && b1.bottom > b2.top && b1.top < b2.bottom;
}
