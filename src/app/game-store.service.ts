import {Injectable} from '@angular/core';
import {BehaviorSubject} from "rxjs";
import GameState from "./models/game-state.interface";
import Position from "./models/position.model";
import {GridService} from "./grid.service";
import Player from "./models/player.model";
import {Round} from "./models/round.model";
import {AUDIO, HIT_SOUNDS, TILE_ANIMATION_PERIOD, TILE_SIZE} from "./models/game.const";
import {AudioService} from "./audio/audio.service";
import {environment} from "../environments/environment";
import {ExplodedTile, TerrainTile, Tile, TileType} from "./models/tile.model";
import Enemy from "./models/enemy.model";

@Injectable({
  providedIn: 'root'
})
export class GameStoreService {

  constructor(private gridService: GridService, private audio: AudioService) {
  }

  private _gameState = new BehaviorSubject<GameState>({
    player: new Player(new Position(5, 10, 'UP')),
    enemies: new Set<Enemy>(),
    rounds: new Set<Round>(),
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
      const explodedTile = new ExplodedTile(new Position(x, y));
      gameState.grid[y][x] = explodedTile;
      gameState.explodedTiles.add(explodedTile)
    }
    this.removeRound(round);
    this.audio.play(HIT_SOUNDS[hitTile.type]);
    this.updateState(gameState);
  }

  clearExplodedTiles() {
    const gameState = this.gameState;
    gameState.explodedTiles.forEach(tile => {
      if (Date.now() - tile.destroyedSinceMs < TILE_ANIMATION_PERIOD) return;
      const {y, x} = tile.position;
      gameState.grid[y][x] = TerrainTile.create('EMPTY', tile.position);
      gameState.explodedTiles.delete(tile);
    })
  }

  shoot() {
    if (this.gameState.player.reloading) return;
    const {position} = this.gameState.player!;
    const {x, y, direction} = position;
    const newGameState = this.gameState;
    const playerRound = new Round(new Position(x, y, direction), this.gameState.player);
    newGameState.rounds.add(playerRound);
    this.gameState.player.reloading = true;
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

  flyRounds() {
    const rounds = this.gameState.rounds;
    rounds.forEach((round) => this.flyRound(round));
  }

  flyRound(round: Round) {
    round.move();
    const hitTile = this.getTileAt(round.position);
    if (!hitTile.walkable) {
      this.hitTile(round, hitTile.position)
    }
    if (!this.isInGrid(round.position)) {
      this.removeRound(round);
      this.audio.play(HIT_SOUNDS['CONCRETE']);
    }
    this.updateState(this.gameState);
  }

  removeRound(round: Round) {
    this.gameState.rounds.delete(round);
    if (round.source === this.gameState.player) {
      round.source.reloading = false;
    }
    this.updateState(this.gameState);
  }

  spawnEnemy() {
    const gameState = this.gameState;
    gameState.enemies.add(new Enemy(new Position(5, 0, 'DOWN')));
    this.updateState(gameState);
  }

  moveEnemies() {
    const gameState = this.gameState;
    gameState.enemies.forEach((enemy) => {
      enemy.move(gameState.grid, 'DOWN');
    })
    this.updateState(gameState);
  }

  private isInGrid(position: Position) {
    const x = Math.floor(position.x);
    const y = Math.floor(position.y);
    return this.gameState.grid[y] && this.gameState.grid[y][x];
  }

  private getTileAt(position: Position) {
    const x = Math.floor(position.x);
    const y = Math.floor(position.y);

    const tile = this.gameState.grid[y] && this.gameState.grid[y][x];
    return tile || TerrainTile.create('EMPTY', position);
  }
}
