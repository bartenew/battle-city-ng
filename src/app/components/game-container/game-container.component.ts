import {Component, OnInit} from '@angular/core';
import {AudioService} from "../../audio/audio.service";
import Player from "../../models/player.model";
import {Tile} from "../../models/tile.model";
import {Round} from "../../models/round.model";
import {GameStoreService} from "../../game-store.service";
import Enemy from "../../models/enemy.model";

@Component({
  selector: 'game-container',
  templateUrl: './game-container.component.html',
  styleUrls: ['./game-container.component.css']
})
export class GameContainerComponent implements OnInit {

  grid: Tile[][] = []
  player?: Player;
  rounds?: Set<Round>;
  enemies?: Set<Enemy>

  constructor(private audio: AudioService, private gameStore: GameStoreService) {
  }

  ngOnInit(): void {
    this.gameStore.gameState$.subscribe((gameState) => {
      this.player = gameState.player;
      this.grid = gameState.grid;
      this.rounds = gameState.rounds;
      this.enemies = gameState.enemies;
    })
    this.gameStore.init();
    this.animate(0);
  }

  frame(now: number) {
    // fly rounds
    // spawn enemies
    // move enemies
    // check base
    this.gameStore.flyRounds();
    this.gameStore.clearExplodedTiles();
    if (this.gameStore.gameState.enemies.size < 1) {
      console.log('YEEHA')
      this.gameStore.spawnEnemy();
    }
    this.gameStore.moveEnemies()
  }

  animate(now: number) {
    this.frame(now)
    requestAnimationFrame(this.animate.bind(this));
  }
}
