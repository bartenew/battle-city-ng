export const TILE_SIZE = 36;
export const TILE_ANIMATION_PERIOD = 500;
export const TILE_SPRITES: Record<string, string> = {
  BRICK: 'assets/sprites/wall.bmp',
  CONCRETE: 'assets/sprites/concrete.bmp',
  BUSH: 'assets/sprites/bush.bmp',
  EXPLODED: 'assets/sprites/exp_small.bmp',
  WATER: 'assets/sprites/water_1.bmp',
  BASE: 'assets/sprites/base.bmp'
}

export const ENEMY_SPRITE = {
  UP: ['assets/sprites/enemy_1/up_1.bmp', 'assets/sprites/enemy_1/up_2.bmp'],
  RIGHT: ['assets/sprites/enemy_1/right_1.bmp', 'assets/sprites/enemy_1/right_2.bmp'],
  DOWN: ['assets/sprites/enemy_1/down_1.bmp', 'assets/sprites/enemy_1/down_2.bmp'],
  LEFT: ['assets/sprites/enemy_1/left_1.bmp', 'assets/sprites/enemy_1/left_2.bmp'],
}

export const PLAYER_SPRITE = {
  UP: ['assets/sprites/player/up_1.bmp', 'assets/sprites/player/up_2.bmp'],
  RIGHT: ['assets/sprites/player/right_1.bmp', 'assets/sprites/player/right_2.bmp'],
  DOWN: ['assets/sprites/player/down_1.bmp', 'assets/sprites/player/down_2.bmp'],
  LEFT: ['assets/sprites/player/left_1.bmp', 'assets/sprites/player/left_2.bmp'],
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
  CONCRETE: 'assets/audio/hit_wall.wav',
  BASE: 'assets/audio/base_explode.wav'
}
