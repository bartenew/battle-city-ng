import {Injectable} from '@angular/core';
import {BehaviorSubject} from "rxjs";
import GameState from "./models/game-state.interface";
import Position from "./models/position.model";
import Player from "./models/player.model";
import {Round} from "./models/round.model";
import {TILE_SIZE} from "./models/game.const";
import {AudioService} from "./audio/audio.service";
import {ExplodedTile, Tile} from "./models/tile.model";
import Enemy from "./models/enemy.model";

function initialState(): GameState {
  return {
    player: new Player(new Position(5, 10, 'UP')),
    enemies: new Set<Enemy>(),
    rounds: new Set<Round>(),
    editorTile: 'BRICK',
    grid: [], height: TILE_SIZE * 21, width: TILE_SIZE * 21, explodedTiles: new Set<ExplodedTile>()
  }
}

@Injectable({
  providedIn: 'root'
})
export class GameStoreService {

  constructor(private audio: AudioService) {
  }

  private _gameState = new BehaviorSubject<GameState>(initialState());

  readonly gameState$ = this._gameState.asObservable();

  get gameState() {
    return this._gameState.getValue();
  }

  set gameState(newGameState) {
    this._gameState.next(newGameState);
  }

  get baseTile() {
    const {grid} = this.gameState;
    return grid[20][9];
  }

  setTile(tile: Tile) {
    const newState = this.gameState;
    newState.grid[tile.position.y][tile.position.x] = tile;
    this.gameState = newState;
  }

  reset() {
    this.gameState = initialState();
  }
}

