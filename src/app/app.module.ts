import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './components/app.component';
import {GameContainerComponent} from './components/game-container/game-container.component';
import {TileComponent} from './components/tile/tile.component';
import {PlayerComponent} from './components/player/player.component';
import {HttpClientModule} from "@angular/common/http";
import {RoundComponent} from './components/round/round.component';

@NgModule({
  declarations: [
    AppComponent,
    GameContainerComponent,
    TileComponent,
    PlayerComponent,
    RoundComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
