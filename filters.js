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

/**
 *
 * @param {*} img
 * @param {'red'|'green'|'blue'} channel
 * @returns
 */
function rgbChannelFilter(img, channel) {
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
 * @param {'red'|'green'|'blue'} channel
 * @param {number} threshold
 * @returns
 */
function thresholdRGBFilter(img, channel, threshold) {
	const channeled = createImage(img.width, img.height);

	channeled.loadPixels();
	img.loadPixels();

	let index = 0,
		red = 0,
		green = 0,
		blue = 0,
		alpha = 0;

	let redThreshold = 0,
		greenThreshold = 0,
		blueThreshold = 0;

	for (let x = 0; x < img.width; x++) {
		for (let y = 0; y < img.height; y++) {
			index = (y * img.width + x) * 4;

			// Access original pixels
			red = img.pixels[index + 0];
			green = img.pixels[index + 1];
			blue = img.pixels[index + 2];
			alpha = img.pixels[index + 3];

			// Apply threshold to colors
			redThreshold = red > threshold ? 255 : 0;
			greenThreshold = green > threshold ? 255 : 0;
			blueThreshold = blue > threshold ? 255 : 0;

			// Replace channeled pixels into new image
			channeled.pixels[index + 0] = channel === "red" ? redThreshold : 0;
			channeled.pixels[index + 1] =
				channel === "green" ? greenThreshold : 0;
			channeled.pixels[index + 2] =
				channel === "blue" ? blueThreshold : 0;
			channeled.pixels[index + 3] = alpha;
		}
	}

	channeled.updatePixels();
	return channeled;
}

/**
 *
 * @param {*} img
 * @param {'HSV'|'HSI'|'LAB'} colorSpace
 */
function colorSpaceFilter(img, colorSpace) {
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

	// Values used in LAB color space transformation
	let X, Y, Z, white, L, A, B;

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
	console.log(colorSpace, Y, Cb, Cr);

	transformed.updatePixels();
	return transformed;
}
