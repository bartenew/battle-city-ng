import {ExplodedTile, Tile, TileType} from "./tile.model";
import Player from "./player.model";
import {Round} from "./round.model";

export default interface GameState {
  grid: Tile[][];
  width: number;
  height: number;
  player?: Player
  round?: Round
  explodedTiles: Set<ExplodedTile>
  editorTile: TileType
}
