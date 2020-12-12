import {Component, HostListener} from '@angular/core';
import {DirectorService} from "../director.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'battle-city-ng';

  constructor(private director: DirectorService) {
  }

  @HostListener('document:keydown.1', ['$event'])
  selectBrick() {
    this.director.updateEditorTile('BRICK')
  }

  @HostListener('document:keydown.2', ['$event'])
  selectConcrete() {
    this.director.updateEditorTile('CONCRETE')
  }

  @HostListener('document:keydown.3', ['$event'])
  selectWater() {
    this.director.updateEditorTile('WATER')
  }

  @HostListener('document:keydown.4', ['$event'])
  selectBase() {
    this.director.updateEditorTile('BASE')
  }
}
