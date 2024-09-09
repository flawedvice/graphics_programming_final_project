/*
let ready = false;
const gap = 20;
*/

let capture, img;
let widgets;
let faceMesh,
	faces = [],
	liveFaces = [];

const loadFaces = true;

function preload() {
	img = loadImage("samples/image.png");

	// Start capturing the video
	capture = createCapture(VIDEO);
	capture.hide();

	if (loadFaces) {
		// Instantiate faceMesh
		faceMesh = ml5.faceMesh({
			maxFaces: 1,
			refineLandmarks: false,
			flipHorizontal: false,
		});
	}
}

function setup() {
	createCanvas(1200, 900);
	pixelDensity(1);

	img.resize(160, 120);
	capture.size(160, 120);

	widgets = [
		// 0.- Original
		//new Widget(img, 0, 0),
		// 1.- Grayscale + 20% brightness
		//new Widget(grayscaleFilter(img), img.width, 0),
		// 2.- Red Channel
		//new ColorWidget(img, 0, img.height, "red"),
		// 3.- Green Channel
		//new ColorWidget(img, img.width, img.height, "green"),
		// 4.- Blue Channel
		//new ColorWidget(img, img.width * 2, img.height, "blue"),
		// 5.- Red Channel with Threshold
		//new ColorWidget(img, 0, img.height * 2, "red", true),
		// 6.- Green Channel with Threshold
		//new ColorWidget(img, img.width, img.height * 2, "green", true),
		// 7.- Blue Channel with Threshold
		//new ColorWidget(img, img.width * 2, img.height * 2, "blue", true),
		// 8.- Repeat original
		//new Widget(img, 0, img.height * 3),
		// 9.- Color Space 1 (HSV)
		//new ColorSpaceWidget(img, img.width, img.height * 3, "HSV"),
		// 10.- Color Space 2 (HSI)
		//new ColorSpaceWidget(img, img.width * 2, img.height * 3, "HSI"),
		// 11.- Face replaced
		null,
		// 12.- Color Space 1 (HSV) with Threshold
		//new ColorSpaceWidget(img, img.width, img.height * 4, "HSV", true),
		// 13.- Color Space 2 (HSI) with Threshold
		//new ColorSpaceWidget(img, img.width * 2, img.height * 4, "HSI", true),
		// 14.- Custom!
		new LiveFaceDetectionWidget(capture, img, img.width * 2, 0),
	];

	// Detect and add face filters
	if (loadFaces) {
		// Image faces
		faceMesh.detect(img, (results, error) => {
			if (results) {
				faces = results;
				widgets[11] = new FaceDetectionWidget(
					img,
					0,
					img.height * 4,
					null,
					faces[0]
				);
			}
			if (error) {
				console.log(error);
				return;
			}
		});

		// Live faces
		faceMesh.detectStart(capture, (results, error) => {
			if (results) {
				if (!liveFaces[0]) console.log(results);
				liveFaces = results;
			}
			if (error) {
				console.log(error);
				return;
			}
		});
	}
}

function draw() {
	background(245, 245, 245);

	if (widgets) {
		// Update Live Face Detection on every tick
		widgets[14] = new LiveFaceDetectionWidget(
			capture,
			img,
			img.width * 2,
			0,
			liveFaces[0]
		);
		for (const widget of widgets) {
			if (widget) widget.draw();
		}
	}
}

function keyReleased() {
	if (keyCode === 32 && ready) {
		img = takePicture(capture);
		faceMesh.detect(img.canvas, (results) => (faces = results));
		ready = false;
	}

	switch (keyCode) {
		case 49:
			// keystroke "1"
			widgets[11] = new FaceDetectionWidget(
				img,
				0,
				img.height * 4,
				"grayscale",
				faces[0]
			);
			break;
		case 50:
			// keystroke "2"
			widgets[11] = new FaceDetectionWidget(
				img,
				0,
				img.height * 4,
				"blur",
				faces[0]
			);
			break;
		case 51:
			// keystroke "3"
			widgets[11] = new FaceDetectionWidget(
				img,
				0,
				img.height * 4,
				"colorSpace",
				faces[0]
			);
			break;
		case 52:
			// keystroke "4"
			widgets[11] = new FaceDetectionWidget(
				img,
				0,
				img.height * 4,
				"pixelated",
				faces[0]
			);
			break;
		case 53:
			// keystroke "5"
			widgets[11] = new FaceDetectionWidget(
				img,
				0,
				img.height * 4,
				"inverted",
				faces[0]
			);
			break;
		case 54:
			// keystroke "6"
			widgets[11] = new FaceDetectionWidget(
				capture,
				0,
				img.height * 4,
				"custom",
				faces[0]
			);
			break;
		case 55:
			// keystroke "7"
			widgets[11] = new FaceDetectionWidget(
				img,
				0,
				img.height * 4,
				null,
				faces[0]
			);
			break;
	}
}

/* function preload() {

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

 */
