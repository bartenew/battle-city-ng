import Position from "./position.model";
import {PLAYER_SPRITE} from "./game.const";
import {Tile} from "./tile.model";

export default class Player extends Tile {
  speed = 0.2;
  reloading = false;

  constructor(position: Position) {
    super(position);
  }

  set direction(value: Direction) {
    this.position.direction = value;
  }

  get spriteUrl() {
    switch (this.position.direction) {
      case "UP":
        return PLAYER_SPRITE.UP[0];
      case "DOWN":
        return PLAYER_SPRITE.DOWN[0];
      case "LEFT":
        return PLAYER_SPRITE.LEFT[0];
      case "RIGHT":
        return PLAYER_SPRITE.RIGHT[0];
      default:
        return PLAYER_SPRITE.UP[0];
    }
  }

  move(grid: Tile[][], direction: Direction): boolean {
    this.direction = direction || this.position.direction;
    const old = this.position
    this.position = this.position.move(this.speed)

    if (this.isBlocked(grid)) {
      this.position = old;
      return false;
    }
    return true;
  }

  protected isBlocked(grid: Tile[][]) {
    const targetX = Math.floor(this.position.x);
    const targetY = Math.floor(this.position.y);

    for (let y = targetY; y < targetY + 2; y++) {
      for (let x = targetX; x < targetX + 2; x++) {
        const tile = grid[y][x];
        // player bitmap is 28x28 while tile is 36x36
        const xOverlaps = this.left -8 < tile.right && this.right + 8 > tile.left
        const yOverlaps = this.top - 8 < tile.bottom && this.bottom - 8 > tile.top;
        const collision = xOverlaps && yOverlaps;
        if (collision && !tile.walkable) {
          return true;
        }
      }
    }
    return false;
  }
}
export type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';
