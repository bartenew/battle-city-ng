import {Component, OnInit} from '@angular/core';
import Player from "../../models/player.model";
import {Tile} from "../../models/tile.model";
import {Round} from "../../models/round.model";
import {GameStoreService} from "../../game-store.service";
import Enemy from "../../models/enemy.model";
import {DirectorService} from "../../director.service";

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

  constructor(private gameStore: GameStoreService, private directorService: DirectorService) {
  }

  async ngOnInit() {
    this.gameStore.gameState$.subscribe((gameState) => {
      this.player = gameState.player;
      this.grid = gameState.grid;
      this.rounds = gameState.rounds;
      this.enemies = gameState.enemies;
    })
    this.directorService.start();
  }


}
