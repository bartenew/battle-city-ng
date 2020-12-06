import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AudioService {

  public play(src: string) {
    let audio = new Audio();
    audio.src = src;
    audio.load();
    audio.play();
  }

}

