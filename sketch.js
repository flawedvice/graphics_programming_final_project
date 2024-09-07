let capture, img;
let ready = false;

let faceMesh,
	options = { maxFaces: 1, refineLandmarks: false, flipped: false },
	faces = [];

const w = 160,
	h = 120,
	gap = 20;

/**
 * @type {{red: number[], green: number[], blue: number[], alpha: number[]}}
 */
let rgbaChannels;

function preload() {
	img = loadImage("image.png");
}

function setup() {
	createCanvas(img.width * 2, img.height * 2);
	pixelDensity(1);
}

function draw() {
	background(255, 0, 255);

	image(img, 0, 0);

	// Invert filter
	image(invertFilter(img), img.width, 0);

	// Grayscale filter
	image(grayscaleFilter(img), 0, img.height);

	noLoop();
}

/* function redChannelFilter(img) {
	const grayscale = createImage(img.width, img.height);

	grayscale.loadPixels();
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

			// Compute average value
			const avg = (red + green + blue) / 3;

			// Replace grayscale pixels into new image
			grayscale.pixels[index + 0] = avg;
			grayscale.pixels[index + 1] = avg;
			grayscale.pixels[index + 2] = avg;
			grayscale.pixels[index + 3] = alpha;
		}
	}

	grayscale.updatePixels();
	return grayscale;
} */

/* function preload() {
	// Face detection configuration
	//faceMesh = ml5.faceMesh(options);

	// Start capturing the video
	//capture = createCapture(VIDEO);
	//capture.hide();
	//capture.elt.addEventListener("playing", () => (ready = true));

	// Debugging
	img = loadImage("image.png");
	rgbaChannels = separateChannels(img);
}

function setup() {
	createCanvas(1920, 963);
	pixelDensity(1);
	background(255);
}

function draw() {
	background(255);
	if (img) {
		if (!rgbaChannels) {
			rgbaChannels = separateChannels(img);
		}

		image(img, 100, 200, w * 2, h * 2);
		drawChannel(rgbaChannels.red, "red", 250, 200, w * 2, h * 2);
		//createGrid();

		for (let i = 0; i < faces.length; i++) {
			let face = faces[i];
			for (let j = 0; j < face.keypoints.length; j++) {
				let keypoint = face.keypoints[j];
				fill(0, 255, 0);
				noStroke();
				circle(keypoint.x, keypoint.y, 1.5);
			}
		} 
	} else {
		image(capture, 0, 0, w * 2, h * 2);
	}
}

function createGrid() {
	let x = 0,
		y = 0;

	// Define rows (15)
	for (let i = 0; i < 15; i++) {
		x = 0;

		// Define columns (3)
		for (let j = 0; j < 3; j++) {
			if (j === 2 && i === 0) {
				drawChannel(
					rgbaChannels.red,
					"red",
					x,
					y,
					img.width,
					img.height
				);
				//continue;
			}
			image(img, x, y, w, h);
			x += gap + w;
		}
		y += gap + h;
	}
}

function keyReleased() {
	if (keyCode === 32 && ready) {
		img = takePicture(capture);
		faceMesh.detect(img.canvas, (results) => (faces = results));
		ready = false;
	}
}
 */
