export const TILE_SIZE = 36;
export const TILE_ANIMATION_PERIOD = 500;
export const TILE_SPRITES: Record<string, string> = {
  BRICK: 'assets/sprites/wall.bmp',
  CONCRETE: 'assets/sprites/concrete.bmp',
  BUSH: 'assets/sprites/bush.bmp',
  EXPLODED: 'assets/sprites/exp_small.bmp',
  WATER: 'assets/sprites/water_1.bmp'
}

export const ENEMY_SPRITE = {
  UP: '',
  RIGHT: '',
  DOWN: '',
  LEFT: ''
}

export const PLAYER_SPRITE = {
  UP: ['assets/sprites/player/UP_1.bmp', 'assets/sprites/player/UP_2.bmp'],
  RIGHT: ['assets/sprites/player/RIGHT_1.bmp', 'assets/sprites/player/RIGHT_2.bmp'],
  DOWN: ['assets/sprites/player/DOWN_1.bmp', 'assets/sprites/player/DOWN_2.bmp'],
  LEFT: ['assets/sprites/player/LEFT_1.bmp', 'assets/sprites/player/LEFT_2.bmp'],
  ROUND_UP: 'assets/sprites/round_up.bmp',
  ROUND_RIGHT: 'assets/sprites/round_right.bmp',
  ROUND_DOWN: 'assets/sprites/round_down.bmp',
  ROUND_LEFT: 'assets/sprites/round_left.bmp',
}

export const AUDIO = {
  START: 'assets/audio/game_start.mp3',
  SHOT: 'assets/audio/player_shot.wav',
}
export const HIT_SOUNDS: Record<string, string> = {
  BRICK: 'assets/audio/hit_brick.wav',
  CONCRETE: 'assets/audio/hit_wall.wav'
}

export const IS_WALKABLE: Record<string, boolean> = {
  WALL: false,
  GRASS: true,
}
