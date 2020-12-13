import {Injectable} from '@angular/core';
import {GameStoreService} from "./game-store.service";
import {environment} from "../environments/environment";
import {AUDIO, HIT_SOUNDS, TILE_ANIMATION_PERIOD} from "./models/game.const";
import {AudioService} from "./audio/audio.service";
import {GridService} from "./grid.service";
import {Round} from "./models/round.model";
import Position from "./models/position.model";
import {ExplodedTile, TerrainTile, Tile, TileType} from "./models/tile.model";
import Enemy from "./models/enemy.model";

@Injectable({
  providedIn: 'root'
})
export class DirectorService {

  constructor(private store: GameStoreService, private audio: AudioService, private gridService: GridService) {
  }

  start() {
    this.gridService.loadGrid().toPromise().then(grid => {
      const newState = this.store.gameState;
      newState.grid = grid;
      this.store.gameState = newState;
      if (environment.production) {
        this.audio.play(AUDIO.START)
      }
      this.animate(0);
    })
  }

  frame(now: number) {
    // fly rounds
    // spawn enemies
    // move enemies
    // check base
    this.flyRounds();
    this.clearExplodedTiles();
    if (this.store.gameState.enemies.size < 1) {
      this.spawnEnemy();
    }
    this.moveEnemies()
  }

  animate(now: number) {
    this.frame(now)
    requestAnimationFrame(this.animate.bind(this));
  }

  hitTile(round: Round, position: Position) {
    const gameState = this.store.gameState;
    const {x, y} = position;
    const hitTile = gameState.grid[y][x]
    if (hitTile.destroyable) {
      const explodedTile = new ExplodedTile(new Position(x, y));
      gameState.grid[y][x] = explodedTile;
      gameState.explodedTiles.add(explodedTile)
    }
    this.removeRound(round);
    this.audio.play(HIT_SOUNDS[hitTile.type]);
    this.store.gameState = gameState;
  }

  clearExplodedTiles() {
    const gameState = this.store.gameState;
    gameState.explodedTiles.forEach(tile => {
      if (Date.now() - tile.destroyedSinceMs < TILE_ANIMATION_PERIOD) return;
      const {y, x} = tile.position;
      gameState.grid[y][x] = TerrainTile.create('EMPTY', tile.position);
      gameState.explodedTiles.delete(tile);
    })
  }

  shoot() {
    if (this.store.gameState.player.reloading) return;
    const {position} = this.store.gameState.player!;
    const {x, y, direction} = position;
    const newGameState = this.store.gameState;
    const playerRound = new Round(new Position(x, y, direction), this.store.gameState.player);
    newGameState.rounds.add(playerRound);
    this.store.gameState.player.reloading = true;
    this.store.gameState = newGameState;
    this.audio.play(AUDIO.SHOT);
  }

  updateEditorTile(type: TileType) {
    const newState = {...this.store.gameState, editorTile: type};
    this.store.gameState = newState;
  }

  exportGrid() {
    const arr = this.store.gameState.grid.flatMap((row: Tile[]) => {
      return row.filter(tile => tile.type !== 'EMPTY')
        .map((tile: Tile) => tile.asTileBuildArg())
    })
    console.log(JSON.stringify(arr))
  }

  flyRounds() {
    const rounds = this.store.gameState.rounds;
    rounds.forEach((round) => this.flyRound(round));
  }

  flyRound(round: Round) {
    round.move();
    const isHit = round.isHit(this.store.gameState.grid);
    if (isHit) {
      this.hitTile(round, round.position.asRoundedPosition())
    }
    if (!this.isInGrid(round.position)) {
      this.removeRound(round);
      this.audio.play(HIT_SOUNDS['CONCRETE']);
    }
    this.store.gameState = this.store.gameState;
  }

  removeRound(round: Round) {
    this.store.gameState.rounds.delete(round);
    round.source.reloading = false;
    this.store.gameState = this.store.gameState;
  }

  spawnEnemy() {
    const gameState = this.store.gameState;
    gameState.enemies.add(new Enemy(new Position(5, 0, 'DOWN')));
    this.store.gameState = gameState;
  }

  moveEnemies() {
    const gameState = this.store.gameState;
    gameState.enemies.forEach(enemy => {
      const directionToBase = enemy.nextDirection(gameState.grid);
      if (directionToBase === false) {
        const round = enemy.shoot()
        if (round) gameState.rounds.add(round);
      }
      const blocked = !enemy.move(gameState.grid, directionToBase);
      
    })
    this.store.gameState = gameState;
  }

  private isInGrid(position: Position) {
    const x = Math.floor(position.x);
    const y = Math.floor(position.y);
    return this.store.gameState.grid[y] && this.store.gameState.grid[y][x];
  }
}
