export const COLOR_GREEN  = Phaser.Display.Color.GetColor(0, 255, 0)
export const COLOR_RED    = Phaser.Display.Color.GetColor(255, 0, 0)
export const COLOR_BLACK  = Phaser.Display.Color.GetColor(0, 0, 0);
export const COLOR_YELLOW = Phaser.Display.Color.GetColor(255, 255, 0);
export const COLOR_GRAY   = Phaser.Display.Color.GetColor(100, 100, 100);
export const COLOR_WHITE  = Phaser.Display.Color.GetColor(255, 255, 255);

/**
 * 
 * @param {string} hexColor Hex representation of a color
 * @returns Converted color in the format used by Phaser
 */
export const convertHexToColor = hexColor => {
    const red = parseInt(hexColor.substring(0, 2), 16);
    const green = parseInt(hexColor.substring(2, 2), 16);
    const blue = parseInt(hexColor.substring(4, 2), 16);

    const colorValue = Phaser.Display.Color.GetColor(red, green, blue);
    console.log(colorValue, "more");
    return colorValue;
}

/**
 * 
 * @param {Array[]} rgbColor 
 * @returns Convert color in the format used by phaser
 */
export const convertRGBToColor = rgbColor => {
    const [r, g, b] = [...rgbColor];
    const colorValue = Phaser.Display.Color.GetColor(r, g, b);

    return colorValue;
}