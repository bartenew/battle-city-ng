import {Component, OnInit} from '@angular/core';
import {AudioService} from "../../audio/audio.service";
import Player from "../../models/player.model";
import {EmptyTile, Tile} from "../../models/tile.model";
import {Round} from "../../models/round.model";
import {GameStoreService} from "../../game-store.service";
import Position from "../../models/position.model";

@Component({
  selector: 'game-container',
  templateUrl: './game-container.component.html',
  styleUrls: ['./game-container.component.css']
})
export class GameContainerComponent implements OnInit {

  grid: Tile[][] = []
  player?: Player;
  round?: Round;

  constructor(private audio: AudioService, private gameStore: GameStoreService) {
  }

  ngOnInit(): void {
    this.gameStore.gameState$.subscribe((gameState) => {
      this.player = gameState.player;
      this.grid = gameState.grid;
      this.round = gameState.round;
    })
    this.gameStore.init();
    this.animate(0);
  }

  frame(now: number) {
    // fly rounds
    // spawn enemies
    // move enemies
    // check base
    if (this.round) {
      this.round.move();
      const hitTile = this.getTileAt(this.round.position);
      if (!hitTile.walkable) {
        this.gameStore.hitTile(this.round, hitTile.position)
      }
    }
    this.gameStore.clearExplodedTiles();
  }

  animate(now: number) {
    this.frame(now)
    requestAnimationFrame(this.animate.bind(this));
  }

  private getTileAt(position: Position) {
    const x = Math.floor(position.x);
    const y = Math.floor(position.y);

    const tile = this.grid[y] && this.grid[y][x];
    return tile || new EmptyTile(position);
  }
}
