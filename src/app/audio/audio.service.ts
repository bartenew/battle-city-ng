import {Injectable} from '@angular/core';
import {AUDIO} from "../models/game.const";

@Injectable({
  providedIn: 'root'
})
export class AudioService {

  gameOver: HTMLAudioElement;

  constructor() {
    this.gameOver = new Audio(AUDIO.SHOT)
    this.gameOver.load();
  }


  public play(src: string) {
    let audio = new Audio();
    audio.src = src;
    audio.load();
    audio.play();
  }
}

