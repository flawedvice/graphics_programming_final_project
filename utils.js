/**
 *
 * @param {number} x
 * @param {number} y
 * @param {number[][]} kernel NxN matrix
 * @param {*} img
 * @returns
 */
function convolution(x, y, kernel, img) {
	let totalRed = 0,
		totalGreen = 0,
		totalBlue = 0;

	const offset = floor(kernel.length / 2);

	let xLoc, yLoc, index;

	for (let i = 0; i < kernel.length; i++) {
		for (let j = 0; j < kernel.length; j++) {
			xLoc = x + i - offset;
			yLoc = y + j - offset;

			index = (img.width * yLoc + xLoc) * 4;
			index = constrain(index, 0, img.pixels.length - offset);

			totalRed += img.pixels[index + 0] * kernel[i][j];
			totalGreen += img.pixels[index + 1] * kernel[i][j];
			totalBlue += img.pixels[index + 2] * kernel[i][j];
		}
	}

	return [totalRed, totalGreen, totalBlue];
}
