import Position from "./position.model";
import {TILE_SPRITES} from "./game.const";
import {TileBuildArg} from "../grid.service";

export class Tile {
  /** Determine if a tile is a wall */
  walkable: boolean;
  spriteUrl: string;
  position: Position
  destroyable: boolean
  type: TileType;

  constructor(spriteUrl: string, position: Position, walkable?: boolean, destroyable?: boolean) {
    this.position = position;
    this.spriteUrl = spriteUrl;
    this.walkable = !!walkable;
    this.destroyable = !!destroyable
    this.type = 'EMPTY';
  }

  static create(type: TileType, position: Position): Tile {
    switch (type) {
      case "BRICK":
        return new BrickWallTile(position);
      case "CONCRETE":
        return new ConcreteTile(position);
      case "BUSH":
        return new BushTile(position);
      case "WATER":
        return new WaterTile(position);
      case "EXPLODED":
        return new ExplodedTile(position, Date.now());
      default:
        return new EmptyTile(position);
    }
  }

  asTileBuildArg(): TileBuildArg {
    return {
      position: this.position,
      type: this.type || 'BRICK',
    }
  }
}

export class BrickWallTile extends Tile {
  constructor(position: Position) {
    super(TILE_SPRITES['BRICK'], position, false, true);
    this.type = 'BRICK';
  }
}

export class ConcreteTile extends Tile {
  constructor(position: Position) {
    super(TILE_SPRITES['CONCRETE'], position, false, false);
    this.type = 'CONCRETE';
  }
}

export class BushTile extends Tile {
  constructor(position: Position) {
    super(TILE_SPRITES['BUSH'], position, false, false);
    this.type = 'BUSH';
  }
}

export class ExplodedTile extends Tile {
  destroyedSinceMs: number

  constructor(position: Position, timestamp: number) {
    super(TILE_SPRITES['EXPLODED'], position, true);
    this.destroyedSinceMs = timestamp;
    this.type = 'EXPLODED';
  }
}

export class EmptyTile extends Tile {
  constructor(position: Position) {
    super('', position, true);
    this.type = 'EMPTY';
  }
}

export class WaterTile extends Tile {
  constructor(position: Position) {
    super(TILE_SPRITES['WATER'], position, false, false);
    this.type = 'WATER';
  }
}

export type TileType = 'BRICK' | 'CONCRETE' | 'BUSH' | 'WATER' | 'EXPLODED' | 'EMPTY' | 'BASE'
