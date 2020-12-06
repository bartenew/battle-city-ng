import {Component, Input, OnInit} from '@angular/core';
import TileStyle from "../../models/tile-style.interface";
import Position from "../../models/position.model";
import {GameStoreService} from "../../game-store.service";
import {TILE_SIZE} from "../../models/game.const";
import {Tile} from "../../models/tile.model";

@Component({
  selector: 'tile',
  templateUrl: './tile.component.html',
})
export class TileComponent implements OnInit {

  @Input() tile?: Tile;

  constructor(private gameStore: GameStoreService) {
  }

  ngOnInit(): void {
  }

  getStyles(): TileStyle {
    const {x, y} = this.tile!.position!;
    return {
      left: x * TILE_SIZE + "px",
      top: y * TILE_SIZE + "px",
      width: TILE_SIZE + "px",
      height: TILE_SIZE + "px"
    };
  }

  toggleTile() {
    const {x, y} = this.tile!.position!;
    this.gameStore.setTile(Tile.create(this.gameStore.gameState.editorTile, new Position(x, y)));
  }
}
