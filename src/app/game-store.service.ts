import {Injectable} from '@angular/core';
import {BehaviorSubject} from "rxjs";
import GameState from "./models/game-state.interface";
import Position from "./models/position.model";
import {EmptyTile, ExplodedTile, Tile, TileType} from "./models/tile.model";
import {GridService} from "./grid.service";
import Player from "./models/player.model";
import {Round} from "./models/round.model";
import {AUDIO, HIT_SOUNDS, TILE_ANIMATION_PERIOD, TILE_SIZE} from "./models/game.const";
import {AudioService} from "./audio/audio.service";
import {environment} from "../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class GameStoreService {

  constructor(private gridService: GridService, private audio: AudioService) {
  }

  private _gameState = new BehaviorSubject<GameState>({
    editorTile: 'BRICK',
    grid: [], height: TILE_SIZE * 13, width: TILE_SIZE * 13, explodedTiles: new Set<ExplodedTile>()
  })

  readonly gameState$ = this._gameState.asObservable();

  get gameState() {
    return this._gameState.getValue();
  }

  init() {
    this.gridService.loadGrid().subscribe(grid => {
      const newState = this.gameState;
      newState.grid = grid;
      newState.player = new Player(new Position(5, 10, 'UP'));
      if (environment.production) {
        this.audio.play(AUDIO.START)
      }
      this.updateState(newState);
    })
  }

  setTile(tile: Tile) {
    const newState = this.gameState;
    newState.grid[tile.position.y][tile.position.x] = tile;
    this.updateState(newState);
  }

  updateState(newGameState: GameState) {
    this._gameState.next(newGameState);
  }

  hitTile(round: Round, position: Position) {
    const gameState = this.gameState;
    const {x, y} = position;
    const hitTile = gameState.grid[y][x]
    if (hitTile.destroyable) {
      const explodedTile = Tile.create("EXPLODED", new Position(x, y)) as ExplodedTile
      gameState.grid[y][x] = explodedTile;
      gameState.explodedTiles.add(explodedTile)
    }
    gameState.round = undefined;
    this.audio.play(HIT_SOUNDS[hitTile.type]);
    this.updateState(gameState);
  }

  clearExplodedTiles() {
    const gameState = this.gameState;
    gameState.explodedTiles.forEach(tile => {
      if (Date.now() - tile.destroyedSinceMs < TILE_ANIMATION_PERIOD) return;
      const {y, x} = tile.position;
      gameState.grid[y][x] = new EmptyTile(tile.position);
      gameState.explodedTiles.delete(tile);
    })
  }

  shoot() {
    if (this.gameState.round) return;
    const {position} = this.gameState.player!;
    const {x, y, direction} = position;
    const newGameState = this.gameState;
    newGameState.round = new Round(new Position(x, y, direction));
    this.updateState(newGameState);
    this.audio.play(AUDIO.SHOT);
  }

  updateEditorTile(type: TileType) {
    const newState = {...this.gameState, editorTile: type};
    this.updateState(newState);
  }

  exportGrid() {
    const arr = this.gameState.grid.flatMap((row: Tile[]) => {
      return row.filter(tile => tile.type !== 'EMPTY')
        .map((tile: Tile) => tile.asTileBuildArg())
    })
    console.log(JSON.stringify(arr))
  }
}
