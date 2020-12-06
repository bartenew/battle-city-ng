import {Injectable} from '@angular/core';
import {EmptyTile, Tile, TileType} from "./models/tile.model";
import Position from "./models/position.model";
import {HttpClient} from "@angular/common/http";
import {map} from "rxjs/operators";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class GridService {

  constructor(private http: HttpClient) {
  }

  loadGrid(): Observable<Tile[][]> {
    return this.http.get<TileBuildArg[]>('assets/grid.json').pipe(map(tileArgs => {
      const grid = this.createEmptyGrid();
      tileArgs.forEach((arg) => {
        const tile = Tile.create(arg.type, arg.position);
        grid[tile.position.y][tile.position.x] = tile;
      });
      return grid;
    }));
  }

  createEmptyGrid() {
    const grid = []
    for (let y = 0; y < 13; y++) {
      grid[y] = new Array(13);
      for (let x = 0; x < 13; x++) {
        grid[y][x] = new EmptyTile(new Position(x, y));
      }
    }
    return grid;
  }
}

export interface TileBuildArg {
  position: Position;
  type: TileType;
}
