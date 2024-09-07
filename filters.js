function invertFilter(img) {
	const inverted = createImage(img.width, img.height);

	inverted.loadPixels();
	img.loadPixels();

	let index = 0,
		red = 0,
		green = 0,
		blue = 0,
		alpha = 0;

	for (let x = 0; x < img.width; x++) {
		for (let y = 0; y < img.height; y++) {
			index = (y * img.width + x) * 4;

			// Access original pixels
			red = img.pixels[index + 0];
			green = img.pixels[index + 1];
			blue = img.pixels[index + 2];
			alpha = img.pixels[index + 3];

			// Replace inverted pixels into new image
			inverted.pixels[index + 0] = 255 - red;
			inverted.pixels[index + 1] = 255 - green;
			inverted.pixels[index + 2] = 255 - blue;
			inverted.pixels[index + 3] = 255;
		}
	}
	inverted.updatePixels();
	return inverted;
}

function grayscaleFilter(img) {
	const grayscale = createImage(img.width, img.height);

	grayscale.loadPixels();
	img.loadPixels();

	let index = 0,
		red = 0,
		green = 0,
		blue = 0,
		alpha = 0;

	const brightness = 1.2;

	for (let x = 0; x < img.width; x++) {
		for (let y = 0; y < img.height; y++) {
			index = (y * img.width + x) * 4;

			// Access original pixels
			red = img.pixels[index + 0];
			green = img.pixels[index + 1];
			blue = img.pixels[index + 2];
			alpha = img.pixels[index + 3];

			// Compute average value
			let avg = (red + green + blue) / 3;

			// Add 20% of brightness to average, controlling intensity
			avg *= brightness;
			if (avg > 255) avg = 255;

			// Replace grayscale pixels into new image
			grayscale.pixels[index + 0] = avg;
			grayscale.pixels[index + 1] = avg;
			grayscale.pixels[index + 2] = avg;
			grayscale.pixels[index + 3] = alpha;
		}
	}

	grayscale.updatePixels();
	return grayscale;
}

/* /**
 * Separates image into four channels: RGBA
 * @param {*} img
 * @returns Channels object with one array of pixels per channel.
 
function separateChannels(img) {
	img.loadPixels();

	/**
	 * @type {{red: number[], green: number[], blue: number[], alpha: number[]}}
	 
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
	} 
	fill(255, 0, 0);

	rect(x, y, 100, 100);
} */
