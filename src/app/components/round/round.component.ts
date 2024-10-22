import {Component, Input, OnInit} from '@angular/core';
import {Round} from "../../models/round.model";
import TileStyle from "../../models/tile-style.interface";
import {TILE_SIZE} from "../../models/game.const";

@Component({
  selector: 'round',
  templateUrl: './round.component.html',
})
export class RoundComponent {

  @Input() round?: Round

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
