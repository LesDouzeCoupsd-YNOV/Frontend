// config
export const GRID_COLS = 4;
export const GRID_ROWS = 4;
export const TILES_PER_CORRECT = 1;
export const TILE_BORDER_COLOR = "#c7b136ff";
export const TILE_COLOR = "#0f3460";

// état du jeu
export const state = {
    gameId: null,
    celebrities: [],
    currentCorrectName: "",
    currentNum: 0,
    totalCelebs: 0,
    tiles: [],
    score: 0,
    hasGuessed: false,
    currentImage: null,
};