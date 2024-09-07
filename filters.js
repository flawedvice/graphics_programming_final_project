/**
 * Separates image into four channels: RGBA
 * @param {*} img
 * @returns Channels object with one array of pixels per channel.
 */
function separateChannels(img) {
	img.loadPixels();

	/**
	 * @type {{red: number[], green: number[], blue: number[], alpha: number[]}}
	 */
	const channels = {
		red: [],
		green: [],
		blue: [],
		alpha: [],
	};

	let index = 0;
	// For every row of pixels
	for (let i = 0; i < img.height; ++i) {
		// For every column of pixels
		for (let j = 0; j < img.width / 4; ++j) {
			index = i * img.width + j * 4;
			channels.red.push(img.pixels[index + 0]);
			channels.green.push(img.pixels[index + 1]);
			channels.blue.push(img.pixels[index + 2]);
			channels.alpha.push(img.pixels[index + 3]);
		}
	}

	return channels;
}

/**
 *
 * @param {number[]} pixels
 * @param {'red'|'green'|'blue'} channel
 * @param {number} x
 * @param {number} y
 * @param {number} w
 * @param {number} h
 */
function drawChannel(pixels, channel, x, y, w, h) {
	rect;
	let xIndex = x,
		yIndex = y;

	// For every row
	/* for (let i = 0; i < h; ++i) {
		yIndex = y + i;
		// For every column
		for (let j = 0; j < w; ++j) {
			xIndex = x + j;

			switch (channel) {
				case "red":
					fill(pixels[yIndex * w + xIndex], 0, 0);
					break;
				case "green":
					fill(0, pixels[yIndex * w + xIndex], 0);
					break;
				case "blue":
					fill(0, 0, pixels[yIndex * w + xIndex]);
					break;
				default:
					fill(0, 0, 0);
			}
			rect(xIndex, yIndex, 1, 1);
		}
	} */
	fill(255, 0, 0);

	rect(x, y, 100, 100);
}
