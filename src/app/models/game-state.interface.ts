import {ExplodedTile, Tile, TileType} from "./tile.model";
import Player from "./player.model";
import {Round} from "./round.model";
import Enemy from "./enemy.model";

export default interface GameState {
  grid: Tile[][];
  width: number;
  height: number;
  player: Player
  rounds: Set<Round>;
  explodedTiles: Set<ExplodedTile>;
  editorTile: TileType;
  enemies: Set<Enemy>;
}
