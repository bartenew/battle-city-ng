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

  shoot(): Round | undefined {
    if (this.reloading) {
      return;
    }
    this.reloading = true;
    return new Round(this.position, this);
  }
}
