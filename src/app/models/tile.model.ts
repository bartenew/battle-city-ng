import Position from './position.model';
import {TILE_SIZE, TILE_SPRITES} from './game.const';
import {TileBuildArg} from '../grid.service';

export class Tile {
  /** Determine if a tile is a wall */
  position: Position
  type: TileType;
  constructor(position: Position, spriteUrl?: string, type?: TileType) {
    this.position = position;
    this._spriteUrl = spriteUrl;
    this.type = type || 'EMPTY';
  }

  _spriteUrl?: string;

  get spriteUrl() {
    return this._spriteUrl;
  }

  get walkable(): boolean {
    return this.type === 'EMPTY' || this.type === 'BUSH' || this.type === 'EXPLODED';
  }

  get destroyable(): boolean {
    return this.type === 'BRICK' || this.type === 'BASE';
  }

  get top() {
    return this.position.y * TILE_SIZE;
  }

  get left() {
    return this.position.x * TILE_SIZE
  }

  get right() {
    return this.left + TILE_SIZE
  };

  get bottom() {
    return this.top + TILE_SIZE
  };

  asTileBuildArg(): TileBuildArg {
    return {
      position: this.position,
      type: this.type
    }
  }
}

export class TerrainTile extends Tile {
  constructor(type: TileType, position: Position) {
    super(position, TILE_SPRITES[type], type);
  }

  static create(type: TileType, position: Position): Tile {
    return new TerrainTile(type, position);
  }
}

export class ExplodedTile extends Tile {
  destroyedSinceMs: number

  constructor(position: Position,) {
    super(position, TILE_SPRITES['EXPLODED']);
    this.destroyedSinceMs = Date.now();
    this.type = 'EXPLODED';
  }
}

export type TileType = 'BRICK' | 'CONCRETE' | 'BUSH' | 'WATER' | 'EXPLODED' | 'EMPTY' | 'BASE'
