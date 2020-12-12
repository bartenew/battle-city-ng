import {Direction} from "./player.model";

export default class Position {
  x: number
  y: number
  direction?: Direction

  constructor(x: number, y: number, direction?: Direction) {
    this.x = x;
    this.y = y;
    this.direction = direction;
  }
  move(speed: number): Position {
    switch (this.direction) {
      case "UP":
        return new Position(this.x, this.y - speed, this.direction);
      case "DOWN":
        return new Position(this.x, this.y + speed, this.direction);
      case "LEFT":
        return new Position(this.x - speed, this.y, this.direction);
      case "RIGHT":
        return new Position(this.x + speed, this.y, this.direction);
      default:
        return this;
    }
  }

  asRoundedPosition() {
    return new Position(Math.floor(this.x), Math.floor(this.y), this.direction)
  }
}
