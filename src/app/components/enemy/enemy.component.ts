import {Component, Input, OnInit} from '@angular/core';
import TileStyle from "../../models/tile-style.interface";
import {TILE_SIZE} from "../../models/game.const";
import Enemy from "../../models/enemy.model";

@Component({
  selector: 'enemy',
  templateUrl: './enemy.component.html'
})
export class EnemyComponent implements OnInit {

  @Input() enemy?: Enemy;

  constructor() {}

  ngOnInit(): void {}

  getStyles(): TileStyle {
    const {position} = this.enemy!;
    return {
      left: position.x * TILE_SIZE + "px",
      top: position.y * TILE_SIZE + "px",
      width: TILE_SIZE + "px",
      height: TILE_SIZE + "px"
    };
  }
}
