/*
	COMMENTARY
	------------------------------------------------------------------------------------------------

	# Findings:
	This was my first time working with color spaces, which I found quite challenging to work with. I didn't know all the math that was behind implementing color space transformations, along with how many schemes or "spaces" were there.

	# Approach:
	I found that an Object Oriented Programming approach would suit this project pretty well, as I would need shared properties for every widget (inheritance) and would therefore allow me to reuse code blocks. The, for every filter I could create a reusable function too. Along with this organization, I decided to separate the code into different files, storing related code blocks together.

	# Problems found:
	The first problem was getting my head around the organization of pixels inside an image object. The logic behind the iteration over every set of RGB(a) pixels needed to be refactored several times.

	Another issue I had was developing the pixelated filter. What I found complicated about it was mapping the averaged pixels back to a full-size image. After some testing, I found a clever approach: I could save every pixel's index at the moment of reading the values from the original image. This way, I could just copy the averaged values over the stored indices, which in turn solved my problem.

	# About the project's success
	I think I did manage to do every task at least to a good degree. I would have liked to have spent more time developing this project, but as it wasn't possible, I'm happy with the result.

	# About the extension
	I thought that I couldn't finish this project without further testing the capabilities of the ml5js library, and 3 factors made me decide to implement a live face filter:
	- The reduced size of the image would allow me to implement real-time filtering.
	- The faceMesh API is well enough documented for me to learn to use it in a short time.
	- Every filter and widget processed and displayed, respectively, only static images, so this one needed to be different.
	I thought that would be interesting to replace different parts of my face to build a dynamic new face, so I chose the Japanese Daruma as a model. I managed to replace my whole face, eyes, nose, and mouth independently while allowing the real-time positioning of every element to follow my face.
 */

// Image and video variables
let capture,
	img,
	ready = false;

// Face detection variables
let faceMesh,
	faces = [],
	liveFaces = [];

// Widgets variable
let widgets;

function preload() {
	// Use sample image took using this program (keyReleased function)
	img = loadImage("samples/image.png");

	// Start capturing the video
	capture = createCapture(VIDEO);
	capture.hide();
	capture.elt.addEventListener("playing", () => (ready = true));

	// Instantiate faceMesh
	faceMesh = ml5.faceMesh({
		maxFaces: 1,
		refineLandmarks: false,
		flipHorizontal: false,
	});
}

function setup() {
	// Basix canvas and image configuration
	createCanvas(1200, 900);
	pixelDensity(1);

	// Resize both image and video
	img.resize(160, 120);
	capture.size(160, 120);

	// Instantiate widgets array
	widgets = [
		// 0.- Original
		new Widget("Webcam image", img, 0, 0),
		// 1.- Grayscale + 20% brightness
		new Widget(
			"Grayscale + brightness",
			grayscaleFilter(img),
			img.width,
			0
		),
		// 2.- Red Channel
		new ColorWidget("Red", img, 0, img.height, "red"),
		// 3.- Green Channel
		new ColorWidget("Green", img, img.width, img.height, "green"),
		// 4.- Blue Channel
		new ColorWidget("Blue", img, img.width * 2, img.height, "blue"),
		// 5.- Red Channel with Threshold
		new ColorWidget("Red + control", img, 0, img.height * 2, "red", true),
		// 6.- Green Channel with Threshold
		new ColorWidget(
			"Green + control",
			img,
			img.width,
			img.height * 2,
			"green",
			true
		),
		// 7.- Blue Channel with Threshold
		new ColorWidget(
			"Blue + control",
			img,
			img.width * 2,
			img.height * 2,
			"blue",
			true
		),
		// 8.- Repeat original
		new Widget("Repeat original", img, 0, img.height * 3),
		// 9.- Color Space 1 (HSV)
		new ColorSpaceWidget(
			"Color Space (HSV)",
			img,
			img.width,
			img.height * 3,
			"HSV"
		),
		// 10.- Color Space 2 (HSI)
		new ColorSpaceWidget(
			"Color Space (HSI)",
			img,
			img.width * 2,
			img.height * 3,
			"HSI"
		),
		// 11.- Face detection. `null` until face detection is enabled
		null,
		// 12.- Color Space 1 (HSV) with Threshold
		new ColorSpaceWidget(
			"Color Space (HSV) + control",
			img,
			img.width,
			img.height * 4,
			"HSV",
			true
		),
		// 13.- Color Space 2 (HSI) with Threshold
		new ColorSpaceWidget(
			"Color Space (HSI) + control",
			img,
			img.width * 2,
			img.height * 4,
			"HSI",
			true
		),
		// 14.- Custom Filter Widget
		new LiveFaceDetectionWidget(
			capture,
			"Daruma",
			img,
			img.width * 2,
			0,
			liveFaces[0]
		),
	];

	// Detect and add face filters
	// Image face
	faceMesh.detect(img, (results, error) => {
		if (results) {
			faces = results;
			widgets[11] = new FaceDetectionWidget(
				"Face detection",
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

	// Live face
	faceMesh.detectStart(capture, (results, error) => {
		if (results) {
			liveFaces = results;
		}
		if (error) {
			console.log(error);
			return;
		}
	});
}

function draw() {
	// Set a clear background
	background(245, 245, 245);

	if (img && widgets) {
		// Update Live Face Detection on every tick
		widgets[14] = new LiveFaceDetectionWidget(
			capture,
			"Daruma",
			img,
			img.width * 2,
			0,
			liveFaces[0]
		);

		// Draw every widget's image
		for (const widget of widgets) {
			if (widget) widget.draw();
		}
	} else {
		// Use to take picture and later replace in `samples/image.png`
		image(capture, 0, 0, w * 2, h * 2);
	}
}

function keyReleased() {
	// Used to take sample picture
	if (keyCode === 32 && ready) {
		img = takePicture(capture);
		faceMesh.detect(img.canvas, (results) => (faces = results));
		ready = false;
	}

	// Enables face filter switch
	switch (key) {
		case "1":
			// keystroke "1"
			widgets[11] = new FaceDetectionWidget(
				"Face detection: grayscale",
				img,
				0,
				img.height * 4,
				"grayscale",
				faces[0]
			);
			break;
		case "2":
			// keystroke "2"
			widgets[11] = new FaceDetectionWidget(
				"Face detection: blur",
				img,
				0,
				img.height * 4,
				"blur",
				faces[0]
			);
			break;
		case "3":
			// keystroke "3"
			widgets[11] = new FaceDetectionWidget(
				"Face detection: colorSpace",
				img,
				0,
				img.height * 4,
				"colorSpace",
				faces[0]
			);
			break;
		case "4":
			// keystroke "4"
			widgets[11] = new FaceDetectionWidget(
				"Face detection: pixelated",
				img,
				0,
				img.height * 4,
				"pixelated",
				faces[0]
			);
			break;
		case "5":
			// keystroke "5"
			widgets[11] = new FaceDetectionWidget(
				"Face detection: inverted",
				img,
				0,
				img.height * 4,
				"inverted",
				faces[0]
			);
			break;
		case "6":
			// keystroke "6"
			widgets[11] = new FaceDetectionWidget(
				"Face detection: none",
				img,
				0,
				img.height * 4,
				null,
				faces[0]
			);
			break;
	}
}
