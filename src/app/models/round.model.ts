import {PLAYER_SPRITE} from "./game.const";
import Position from "./position.model";
import {Tile} from "./tile.model";
import Player from "./player.model";

export class Round extends Tile {
  speed = 0.3;
  source: Player;

  constructor(position: Position, source: Player) {
    super(position);
    this.source = source;
  }

  get spriteUrl() {
    switch (this.position.direction) {
      case "UP":
        return PLAYER_SPRITE.ROUND_UP;
      case "DOWN":
        return PLAYER_SPRITE.ROUND_DOWN;
      case "LEFT":
        return PLAYER_SPRITE.ROUND_LEFT;
      case "RIGHT":
        return PLAYER_SPRITE.ROUND_RIGHT;
      default:
        return PLAYER_SPRITE.ROUND_UP;
    }
  }

  move() {
    this.position = this.position.move(this.speed);
  }
}
