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
import {AStarFinder} from "astar-typescript";
import {IPoint} from "astar-typescript/dist/interfaces/astar.interfaces";

@Injectable({
  providedIn: 'root'
})
export class DirectorService {

  fiveSecondTimer = 0;

  constructor(private store: GameStoreService, private audio: AudioService, private gridService: GridService) {
  }

  start() {
    this.reset().then(() => {
      this.animate(0);
    });
  }

  async reset() {
    const grid = await this.gridService.loadGrid().toPromise();
    this.store.reset();
    const newState = this.store.gameState;
    newState.grid = grid;
    this.store.gameState = newState;
    if (environment.production) {
      this.audio.play(AUDIO.START)
    }
  }

  async frame(now: number) {
    // fly rounds
    // spawn enemies
    // move enemies
    // check base
    const elapsed = now - this.fiveSecondTimer;
    this.flyRounds();
    this.clearExplodedTiles();
    if (this.store.gameState.enemies.size < 3 && elapsed > 5000) {
      this.spawnEnemy();
      this.fiveSecondTimer = now;
    }
    this.moveEnemies()
    if (this.store.baseTile.type === "EMPTY") {
      await this.gameOver();
    }
  }

  animate(now: number) {
    this.frame(now).then(() => {
      requestAnimationFrame(this.animate.bind(this));
    })
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
    const {player} = this.store.gameState;
    if (player.reloading) return;
    const {position} = player!;
    const {x, y, direction} = position;
    const newGameState = this.store.gameState;
    const playerRound = new Round(new Position(x, y, direction), player);
    newGameState.rounds.add(playerRound);
    player.reloading = true;
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

  // new idea
  // set direction // wait for 3 seconds // change direction if blocked
  moveEnemies() {
    const gameState = this.store.gameState;
    gameState.enemies.forEach(enemy => {
      const path = this.getPath(enemy.position, new Position(5, 10));
      if (path.length === 0) {
        const round = enemy.shoot()
        round && gameState.rounds.add(round);
        enemy.move(gameState.grid, 'RIGHT')
        return
      }
      const [nextX, nextY] = path[0]
      this.moveTo(nextX, nextY, enemy);
    })
    this.store.gameState = gameState;
  }

  moveTo(x: number, y: number, enemy: Enemy) {

    const targetLeft = x * 36
    const targetTop = y * 36

    const grid = this.store.gameState.grid;
    if (grid[y][x].destroyable) {
      const round = enemy.shoot()
      round && this.store.gameState.rounds.add(round);

    }
    if (targetTop < enemy.top - 8) enemy.move(grid, 'UP');
    else if (targetLeft < enemy.left) enemy.move(grid, 'LEFT');
    else if (targetTop > enemy.top) enemy.move(grid, 'DOWN');
    else {
      enemy.move(grid, 'RIGHT');
    }
  }

  getPath(posOne: Position, posTwo: Position) {
    const gameState = this.store.gameState;
    const numericGrid = gameState.grid.map(row => row.map((tile: Tile) => (tile.walkable || tile.destroyable) ? 0 : 1))
    const aStartFinder = new AStarFinder({
      grid: {
        matrix: numericGrid
      },
      diagonalAllowed: false,
      includeStartNode: false
    });
    const {x, y} = posOne.asRoundedPosition();
    const start: IPoint = {x, y};
    return aStartFinder.findPath(start, posTwo);
  }

  async gameOver() {
    await this.audio.gameOver.play()
    alert('Game Over, pal');
    const yes = confirm('Restart?')
    if (yes) {
      await this.reset();
    }
  }

  private isInGrid(position: Position) {
    const x = ~~position.x;
    const y = ~~position.y;
    const {grid} = this.store.gameState;
    return (grid[y] || [])[x] !== undefined;
  }
}
