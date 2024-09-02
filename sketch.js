let capture, img;
let ready = false;

let faceMesh,
	options = { maxFaces: 1, refineLandmarks: false, flipped: false },
	faces = [];

const w = 160,
	h = 120,
	gap = 20;

function preload() {
	// Face detection configuration
	faceMesh = ml5.faceMesh(options);

	// Start capturing the video
	capture = createCapture(VIDEO);
	capture.hide();
	capture.elt.addEventListener("playing", () => (ready = true));
}

function setup() {
	createCanvas(1920, 963);
	background(255);
}

function draw() {
	background(255);
	if (img) {
		createGrid();
		/* for (let i = 0; i < faces.length; i++) {
			let face = faces[i];
			for (let j = 0; j < face.keypoints.length; j++) {
				let keypoint = face.keypoints[j];
				fill(0, 255, 0);
				noStroke();
				circle(keypoint.x, keypoint.y, 1.5);
			}
		} */
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
			if (j === 2 && i === 0) continue;
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
