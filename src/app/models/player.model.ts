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
    const targetPosition = this.position.move(this.speed)

    if (this.isBlocked(grid, targetPosition)) return false;
    this.position = targetPosition;
    return true;
  }

  protected isBlocked(grid: Tile[][], targetPositon: Position) {
    const x = Math.floor(targetPositon.x);
    const y = Math.floor(targetPositon.y);

    const blockingTileInTheWay = grid[y] && grid[y][x] && !grid[y][x].walkable;
    const offGrid = !grid[y] || !grid[y][x];
    return blockingTileInTheWay || offGrid;
  }
}
export type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';
