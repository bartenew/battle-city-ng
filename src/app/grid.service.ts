import {Injectable} from '@angular/core';
import {TerrainTile, Tile, TileType} from "./models/tile.model";
import Position from "./models/position.model";
import {HttpClient} from "@angular/common/http";
import {map} from "rxjs/operators";
import {Observable} from "rxjs";
import {environment} from "../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class GridService {

  gridUrl: string
  constructor(private http: HttpClient) {
    this.gridUrl = environment.gridUrl;
  }

  loadGrid(): Observable<Tile[][]> {
    return this.http.get<TileBuildArg[]>(this.gridUrl).pipe(map(tileArgs => {
      const grid = this.createEmptyGrid();
      tileArgs.forEach((arg) => {
        const tile = TerrainTile.create(arg.type, arg.position);
        grid[tile.position.y][tile.position.x] = tile;
      });
      return grid;
    }));
  }

  createEmptyGrid() {
    const grid = []
    for (let y = 0; y < 21; y++) {
      grid[y] = new Array(21);
      for (let x = 0; x < 21; x++) {
        grid[y][x] = TerrainTile.create('EMPTY', new Position(x, y));
      }
    }
    return grid;
  }
}

export interface TileBuildArg {
  position: Position;
  type: TileType;
}
