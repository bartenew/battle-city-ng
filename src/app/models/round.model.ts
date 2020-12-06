import {PLAYER_SPRITE} from "./game.const";
import Position from "./position.model";
import {Tile} from "./tile.model";

export class Round extends Tile {
  speed = 0.3;

  constructor(position: Position) {
    super(PLAYER_SPRITE.ROUND_UP, position);
    this.updateSprite()
  }

  move() {
    this.position = this.position.move(this.speed);
  }

  updateSprite() {
    switch (this.position.direction) {
      case "UP":
        this.spriteUrl = PLAYER_SPRITE.ROUND_UP;
        break;
      case "DOWN":
        this.spriteUrl = PLAYER_SPRITE.ROUND_DOWN;
        break;
      case "LEFT":
        this.spriteUrl = PLAYER_SPRITE.ROUND_LEFT;
        break;
      case "RIGHT":
        this.spriteUrl = PLAYER_SPRITE.ROUND_RIGHT;
        break;
    }
  }
}
