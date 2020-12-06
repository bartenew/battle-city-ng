import {Component, HostListener} from '@angular/core';
import {GameStoreService} from "../game-store.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'battle-city-ng';

  constructor(private gameStore: GameStoreService) {
  }

  @HostListener('document:keydown.1', ['$event'])
  selectBrick() {
    this.gameStore.updateEditorTile('BRICK')
  }

  @HostListener('document:keydown.2', ['$event'])
  selectConcrete() {
    this.gameStore.updateEditorTile('CONCRETE')
  }

  @HostListener('document:keydown.3', ['$event'])
  selectWater() {
    this.gameStore.updateEditorTile('WATER')
  }
}
