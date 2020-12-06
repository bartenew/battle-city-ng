import {Component, OnInit} from '@angular/core';
import {Round} from "../../models/round.model";
import TileStyle from "../../models/tile-style.interface";
import {GameStoreService} from "../../game-store.service";
import {TILE_SIZE} from "../../models/game.const";

@Component({
  selector: 'round',
  templateUrl: './round.component.html',
})
export class RoundComponent implements OnInit {

  round?: Round

  constructor(private gameStore: GameStoreService) {
  }

  ngOnInit(): void {
    this.gameStore.gameState$.subscribe(gameState => {
      this.round = gameState.round;
    })
  }

  getStyles(): TileStyle {
    const {position} = this.round!;
    return {
      left: position.x * TILE_SIZE + "px",
      top: position.y * TILE_SIZE + "px",
      width: TILE_SIZE + "px",
      height: TILE_SIZE + "px"
    };
  }
}
