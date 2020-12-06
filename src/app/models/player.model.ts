import Position from "./position.model";
import {PLAYER_SPRITE} from "./game.const";
import {Tile} from "./tile.model";

export default class Player extends Tile {
  speed = 0.2;

  constructor(position: Position) {
    super(PLAYER_SPRITE.UP[0], position);
  }

  set direction(value: Direction) {
    this.position.direction = value;
    this.updateSprite()
  }

  updateSprite() {
    switch (this.position.direction) {
      case "UP":
        this.spriteUrl = PLAYER_SPRITE.UP[0];
        break;
      case "DOWN":
        this.spriteUrl = PLAYER_SPRITE.DOWN[0];
        break;
      case "LEFT":
        this.spriteUrl = PLAYER_SPRITE.LEFT[0];
        break;
      case "RIGHT":
        this.spriteUrl = PLAYER_SPRITE.RIGHT[0];
        break;
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
