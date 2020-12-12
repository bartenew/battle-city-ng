import {Component, HostListener, OnInit} from '@angular/core';
import Player from "../../models/player.model";
import TileStyle from "../../models/tile-style.interface";
import {GameStoreService} from "../../game-store.service";
import {TILE_SIZE} from "../../models/game.const";
import {Tile} from "../../models/tile.model";
import {DirectorService} from "../../director.service";

@Component({
  selector: 'player',
  templateUrl: './player.component.html'
})
export class PlayerComponent implements OnInit {

  player?: Player;
  grid: Tile[][] = []

  constructor(private gameStore: GameStoreService, private director: DirectorService) {
  }

  ngOnInit(): void {
    this.gameStore.gameState$.subscribe(gameState => {
      this.player = gameState.player;
      this.grid = gameState.grid;
    })
  }

  getStyles(): TileStyle {
    const {position} = this.player!;
    return {
      left: position.x * TILE_SIZE + "px",
      top: position.y * TILE_SIZE + "px",
      width: TILE_SIZE + "px",
      height: TILE_SIZE + "px"
    };
  }

  getPlayer() {
    return this.player!;
  }

  @HostListener('document:keydown.arrowUp', ['$event'])
  moveUp(event: KeyboardEvent) {
    this.getPlayer().move(this.grid, 'UP');
  }

  @HostListener('document:keydown.arrowDown', ['$event'])
  moveDown(event: KeyboardEvent) {
    event.preventDefault()
    this.getPlayer().move(this.grid, 'DOWN')
  }

  @HostListener('document:keydown.arrowLeft', ['$event'])
  moveLeft(event: KeyboardEvent) {
    this.getPlayer().move(this.grid, 'LEFT');
  }

  @HostListener('document:keydown.arrowRight', ['$event'])
  moveRight(event: KeyboardEvent) {
    this.getPlayer().move(this.grid, 'RIGHT');
  }

  @HostListener('document:keydown.space', ['$event'])
  shoot() {
    this.director.shoot();
  }
}
