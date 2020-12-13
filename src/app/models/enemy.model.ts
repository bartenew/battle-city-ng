import {ENEMY_SPRITE, TILE_SIZE} from "./game.const";
import Position from "./position.model";
import Player, {Direction} from "./player.model";
import {Tile} from "./tile.model";
import {AStarFinder} from "astar-typescript";
import {IPoint} from "astar-typescript/dist/interfaces/astar.interfaces";
import {Round} from "./round.model";

export default class Enemy extends Player {

  constructor(position: Position) {
    super(position);
    this.speed = 0.05;
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

  nextDirection(grid: Tile[][]): Direction | boolean {
    const numericGrid = grid.map(row => row.map((tile: Tile) => tile.walkable ? 0 : 1))
    const aStartFinder = new AStarFinder({
      grid: {
        matrix: numericGrid
      },
      diagonalAllowed: false,
      includeStartNode: false
    });
    const {x,y} = this.position.asRoundedPosition();
    const start: IPoint = {x,y};
    const path = aStartFinder.findPath(start, {x: 5, y: 10})
    if (path.length === 0) {
      return false;
    }
    const [nextX, nextY] = path[0]

    const targetLeft = nextX * 36
    const targetTop = nextY * 36

    if (targetTop < this.top - 8) return 'UP';
    if (targetLeft < this.left) return 'LEFT';
    if (targetTop > this.top) return 'DOWN';
    if (targetLeft > this.left) {
      return 'RIGHT';
    }

    return false;
  }

  shoot(): Round | undefined {
    if (this.reloading) {
      return;
    }
    this.reloading = true;
    return new Round(this.position, this);
  }
}
