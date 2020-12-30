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

  isHit(grid: Tile[][]): number[] {
    const {x, y} = this.position.asRoundedPosition();
    if ((grid[y] || [])[x] === undefined) return [];

    for (let i = 0; i < y + 1; i++) {
      for (let j = 0; j < x + 1; j++) {
        const tile = grid[i][j];
        // round is 8x8 bmp while tile is 36x36
        const xOverlaps = this.left + 14 < tile.right && this.right - 14 > tile.left
        const yOverlaps = this.top < tile.bottom && this.bottom - 28 > tile.top;

        if (xOverlaps && yOverlaps && !tile.walkable) {
          return [i, j];
        }
      }
    }
    return []
  }
}
