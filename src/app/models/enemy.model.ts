import {ENEMY_SPRITE} from "./game.const";
import Position from "./position.model";
import Player from "./player.model";

export default class Enemy extends Player {
  constructor(position: Position) {
    super(position);
  }

  get destroyable() {
    return true;
  }

  get walkable() {
    return false;
  }

  get spriteUrl() {
    switch (this.position.direction) {
      case "UP":
        return ENEMY_SPRITE.UP[0];
      case "DOWN":
        return ENEMY_SPRITE.DOWN[0];
      case "LEFT":
        return ENEMY_SPRITE.LEFT[0];
      case "RIGHT":
        return ENEMY_SPRITE.RIGHT[0];
      default:
        return ENEMY_SPRITE.UP[0];
    }
  }
}
