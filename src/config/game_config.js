import { windowConfig } from './window_config.js';

const windowWidth = windowConfig.windowWidth;
const windowHeight = windowConfig.windowHeight;

const gameToMenuRatio = 0.7;

export const gameConfig = {
    gameWidth: gameToMenuRatio * windowWidth,
    gameHeight: windowHeight,
    numRows: 20,
    numCols: 10,
}

export const animationConfig = {
    tetrisAnimationDuration: 300,
    tetrisAnimationEase: 'Linear'
}

const calculateRectSize = config => {
    config.rectWidth = config.gameWidth / config.numCols;
    config.rectHeight = config.gameHeight / config.numRows;
}

const calculateSidebarSize = config => {
    config.sidebarWidth = windowWidth - config.gameWidth;
    config.sidebarHeight = windowHeight;
}

calculateRectSize(gameConfig);
calculateSidebarSize(gameConfig);