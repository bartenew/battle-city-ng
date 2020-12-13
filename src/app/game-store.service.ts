import {Injectable} from '@angular/core';
import {BehaviorSubject} from "rxjs";
import GameState from "./models/game-state.interface";
import Position from "./models/position.model";
import Player from "./models/player.model";
import {Round} from "./models/round.model";
import {AUDIO, HIT_SOUNDS, TILE_ANIMATION_PERIOD, TILE_SIZE} from "./models/game.const";
import {AudioService} from "./audio/audio.service";
import {ExplodedTile, TerrainTile, Tile, TileType} from "./models/tile.model";
import Enemy from "./models/enemy.model";

@Injectable({
  providedIn: 'root'
})
export class GameStoreService {

  constructor(private audio: AudioService) {
  }

  private _gameState = new BehaviorSubject<GameState>(INITIAL_STATE);

  readonly gameState$ = this._gameState.asObservable();

  get gameState() {
    return this._gameState.getValue();
  }

  set gameState(newGameState) {
    this._gameState.next(newGameState);
  }

  get baseTile() {
    const {grid} = this.gameState;
    return grid[12][5];
  }

  setTile(tile: Tile) {
    const newState = this.gameState;
    newState.grid[tile.position.y][tile.position.x] = tile;
    this.gameState = newState;
  }

  reset() {
    this.gameState = INITIAL_STATE;
  }
}

const INITIAL_STATE: GameState = {
  player: new Player(new Position(5, 10, 'UP')),
  enemies: new Set<Enemy>(),
  rounds: new Set<Round>(),
  editorTile: 'BRICK',
  grid: [], height: TILE_SIZE * 13, width: TILE_SIZE * 13, explodedTiles: new Set<ExplodedTile>()
};
