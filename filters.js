/**
 *
 * @param {*} img
 * @returns Filtered image
 */
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
			inverted.pixels[index + 3] = alpha;
		}
	}
	inverted.updatePixels();
	return inverted;
}

/**
 * @param {*} img
 * @returns Filtered image
 */
function grayscaleFilter(img) {
	const grayscale = createImage(img.width, img.height);

	grayscale.loadPixels();
	img.loadPixels();

	let index = 0,
		red = 0,
		green = 0,
		blue = 0,
		alpha = 0;

	// Add 20% of brightness
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

/**
 *
 * @param {*} img
 * @param {'red'|'green'|'blue'} channel
 * @param {number} threshold
 * @returns Filtered image
 */
function RGBFilter(img, channel, threshold) {
	const channeled = createImage(img.width, img.height);

	channeled.loadPixels();
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

			if (threshold) {
				// Apply threshold to colors
				red = red > threshold ? 255 : 0;
				green = green > threshold ? 255 : 0;
				blue = blue > threshold ? 255 : 0;
			}

			// Replace channeled pixels into new image
			channeled.pixels[index + 0] = channel === "red" ? red : 0;
			channeled.pixels[index + 1] = channel === "green" ? green : 0;
			channeled.pixels[index + 2] = channel === "blue" ? blue : 0;
			channeled.pixels[index + 3] = alpha;
		}
	}

	channeled.updatePixels();
	return channeled;
}

/**
 *
 * @param {*} img
 * @param {'HSV'|'HSI'} colorSpace
 * @param {number} threshold
 * @returns Filtered image
 */
function colorSpaceFilter(img, colorSpace, threshold) {
	const transformed = createImage(img.width, img.height);

	transformed.loadPixels();
	img.loadPixels();

	let index = 0,
		red = 0,
		green = 0,
		blue = 0,
		alpha = 0;

	// Values used in HSV color space transformation
	let max, min, saturation;
	let value;
	let hue;

	// Values used in HSI color space transformation
	let H, S, I, sum;

	// Common values used by previous transformations
	let redPrime, greenPrime, bluePrime;

	for (let x = 0; x < img.width; x++) {
		for (let y = 0; y < img.height; y++) {
			index = (y * img.width + x) * 4;

			// Access original pixels
			red = img.pixels[index + 0];
			green = img.pixels[index + 1];
			blue = img.pixels[index + 2];
			alpha = img.pixels[index + 3];

			/// Compute transformed values
			if (colorSpace === "HSV") {
				// Saturation
				max = Math.max(red, green, blue);
				min = Math.min(red, green, blue);
				saturation = (max - min) / max;

				// Value
				value = max;

				// Normalize RGB channels
				redPrime = (max - red) / (max - min);
				greenPrime = (max - green) / (max - min);
				bluePrime = (max - blue) / (max - min);

				// Hue
				if (saturation === 0) hue = 0;
				else {
					if (red === max && green === min) hue = 5 + bluePrime;
					else if (red === max && green !== min) hue = 1 - greenPrime;
					else if (green === max && blue === min) hue = redPrime + 1;
					else if (green === max && blue !== min) hue = 3 - bluePrime;
					else if (red === max) hue = 3 + greenPrime;
					else hue = 5 - redPrime;
				}
				hue *= 60;

				// Apply threshold to colors if needed
				if (threshold) {
					hue = hue > threshold ? 255 : 0;
					saturation = saturation > threshold ? 255 : 0;
					value = value > threshold ? 255 : 0;
				}

				// Replace filtered pixels into new image
				transformed.pixels[index + 0] = hue;
				transformed.pixels[index + 1] = saturation;
				transformed.pixels[index + 2] = value;
			} else if (colorSpace === "HSI") {
				// Compute CMY color space
				sum = red + green + blue;
				I = sum / 3;
				S = 1 - (3 / sum) * Math.min(red, green, blue);
				H = Math.acos(
					(0.5 * (red - green) + (red - blue)) /
						Math.pow(
							Math.pow(red - green, 2) +
								(red - blue) * (green - blue),
							0.5
						)
				);

				if (S === 0) H = 0;
				if (blue / I > green / I) H = 360 - H;

				// Apply threshold to colors if needed
				if (threshold) {
					H = H > threshold ? 255 : 0;
					S = S > threshold ? 255 : 0;
					I = I > threshold ? 255 : 0;
				}

				// Replace filtered pixels into new image
				transformed.pixels[index + 0] = H;
				transformed.pixels[index + 1] = S;
				transformed.pixels[index + 2] = I;
			} else {
				transformed.pixels[index + 0] = red;
				transformed.pixels[index + 1] = green;
				transformed.pixels[index + 2] = blue;
			}

			// Every transformation keeps the image's alpha value
			transformed.pixels[index + 3] = alpha;
		}
	}

	transformed.updatePixels();
	return transformed;
}

/**
 *
 * @param {*} img
 * @param {number} level Blur level
 * @returns Filtered image
 */
function blurFilter(img, level) {
	const blurred = createImage(img.width, img.height);

	blurred.loadPixels();
	img.loadPixels();

	let index = 0,
		red = 0,
		green = 0,
		blue = 0,
		alpha = 0;

	// Create a dynamic kernel based on level of blur
	const baseArray = new Array(level).fill(1 / pow(level, 2));
	const kernel = new Array(level).fill(baseArray);

	// Convolution results array
	let c = [];

	for (let x = 0; x < img.width; x++) {
		for (let y = 0; y < img.height; y++) {
			index = (y * img.width + x) * 4;

			// Access original pixels
			red = img.pixels[index + 0];
			green = img.pixels[index + 1];
			blue = img.pixels[index + 2];
			alpha = img.pixels[index + 3];

			// Store convolution results
			c = convolution(x, y, kernel, img);

			// Replace blurred pixels into new image
			blurred.pixels[index + 0] = c[0]; //red;
			blurred.pixels[index + 1] = c[1]; //green;
			blurred.pixels[index + 2] = c[2]; //blue;
			blurred.pixels[index + 3] = alpha; //255;
		}
	}

	blurred.updatePixels();
	return blurred;
}

/**
 *
 * @param {*} img
 * @returns Filtered image
 */
function pixelatedFilter(img) {
	// First, set image to grayscale
	const pixelated = grayscaleFilter(img);

	// Split image into blocks of 5x5 pixels
	const blockSize = 5,
		blocks = [];
	let pixels = [];

	let index = 0,
		red = 0,
		green = 0,
		blue = 0,
		alpha = 0;

	for (let x = 0; x < img.width; x += blockSize) {
		for (let y = 0; y < img.width; y += blockSize) {
			// For every block
			pixels = [];
			for (let i = 0; i < blockSize; i++) {
				for (let j = 0; j < blockSize; j++) {
					index = (x + i + (y + j) * img.width) * 4;

					red = img.pixels[index + 0];
					green = img.pixels[index + 1];
					blue = img.pixels[index + 2];
					alpha = img.pixels[index + 3];

					// Save both RGBA channels and the pixel index for easy re-mapping
					pixels.push({
						idx: index,
						channels: [red, green, blue, alpha],
					});
				}
			}
			blocks.push(pixels);
		}
	}

	// Compute average pixel intensity of blocks
	let avgRed, avgGreen, avgBlue, avgAlpha;
	const blocksAvg = [];
	for (const block of blocks) {
		avgRed = 0;
		avgGreen = 0;
		avgBlue = 0;
		avgAlpha = 0;
		for (const pixels of block) {
			avgRed += pixels.channels[0];
			avgGreen += pixels.channels[1];
			avgBlue += pixels.channels[2];
			avgAlpha += pixels.channels[3];
		}
		avgRed = Math.round(avgRed / block.length);
		avgGreen = Math.round(avgGreen / block.length);
		avgBlue = Math.round(avgBlue / block.length);
		avgAlpha = Math.round(avgAlpha / block.length);

		blocksAvg.push({
			indices: block.map((pixels) => pixels.idx),
			avgChannels: [avgRed, avgGreen, avgBlue, avgAlpha],
		});
	}

	// Paint the image using average intensities
	let pixelRed, pixelGreen, pixelBlue, pixelAlpha;

	for (const block of blocksAvg) {
		pixelRed = block.avgChannels[0];
		pixelGreen = block.avgChannels[1];
		pixelBlue = block.avgChannels[2];
		pixelAlpha = block.avgChannels[3];

		block.indices.forEach((idx) => {
			pixelated.pixels[idx + 0] = pixelRed;
			pixelated.pixels[idx + 1] = pixelGreen;
			pixelated.pixels[idx + 2] = pixelBlue;
			pixelated.pixels[idx + 3] = pixelAlpha;
		});
	}

	pixelated.updatePixels();
	return pixelated;
}
