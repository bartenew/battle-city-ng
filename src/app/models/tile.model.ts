import Position from './position.model';
import {TILE_SPRITES} from './game.const';
import {TileBuildArg} from '../grid.service';

export class Tile {
  /** Determine if a tile is a wall */
  position: Position
  type: TileType;
  _spriteUrl?: string;

  constructor(position: Position, spriteUrl?: string, type?: TileType) {
    this.position = position;
    this._spriteUrl = spriteUrl;
    this.type = type || 'EMPTY';
  }

  get spriteUrl() {
    return this._spriteUrl;
  }

  get walkable(): boolean {
    return this.type === 'EMPTY' || this.type === 'BUSH' || this.type === 'EXPLODED';
  }

  get destroyable(): boolean {
    return this.type === 'BRICK' || this.type === 'BASE';
  }

  asTileBuildArg(): TileBuildArg {
    return {
      position: this.position,
      type: this.type || 'BRICK',
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
  constructor(position: Position, ) {
    super(position, TILE_SPRITES['EXPLODED']);
    this.destroyedSinceMs = Date.now();
    this.type = 'EXPLODED';
  }
}

export type TileType = 'BRICK' | 'CONCRETE' | 'BUSH' | 'WATER' | 'EXPLODED' | 'EMPTY' | 'BASE'
