class Widget {
	/**
	 *
	 * @param {*} img
	 * @param {number} x
	 * @param {number} y
	 */
	constructor(img, x, y) {
		this.img = img;
		this.x = x;
		this.y = y;
	}

	draw() {
		image(this.img, this.x, this.y);
	}
}

class ColorWidget extends Widget {
	/**
	 *
	 * @param {*} img
	 * @param {number} x
	 * @param {number} y
	 * @param {'red'|'green'|'blue'} color
	 * @param {boolean} useTreshold
	 */
	constructor(img, x, y, color, useTreshold = false) {
		super(img, x, y);
		this.color = color;
		this.useTreshold = useTreshold;

		this.thresholdSlider = null;

		if (this.useTreshold) {
			this.thresholdSlider = createSlider(0, 255, 125);
			this.thresholdSlider.position(
				this.x,
				this.y + this.img.height - 20
			);
		}
	}
	draw() {
		if (this.useTreshold && this.thresholdSlider) {
			image(
				RGBFilter(this.img, this.color, this.thresholdSlider.value()),
				this.x,
				this.y
			);
		} else {
			image(RGBFilter(this.img, this.color, null), this.x, this.y);
		}
	}
}

class ColorSpaceWidget extends Widget {
	/**
	 *
	 * @param {*} img
	 * @param {number} x
	 * @param {number} y
	 * @param {'HSV'|'HSI'} colorSpace
	 * @param {boolean} useTreshold
	 */
	constructor(img, x, y, colorSpace, useTreshold = false) {
		super(img, x, y);
		this.colorSpace = colorSpace;
		this.useTreshold = useTreshold;

		this.thresholdSlider = null;

		if (this.useTreshold) {
			this.thresholdSlider = createSlider(0, 255, 125);
			this.thresholdSlider.position(
				this.x,
				this.y + this.img.height - 20
			);
		}
	}
	draw() {
		if (this.useTreshold && this.thresholdSlider) {
			image(
				colorSpaceFilter(
					this.img,
					this.colorSpace,
					this.thresholdSlider.value()
				),
				this.x,
				this.y
			);
		} else {
			image(
				colorSpaceFilter(this.img, this.colorSpace, null),
				this.x,
				this.y
			);
		}
	}
}

class FaceDetectionWidget extends Widget {
	/**
	 *
	 * @param {*} img
	 * @param {number} x
	 * @param {number} y
	 * @param {'grayscale'|'colorSpace'|'inverted'|'blur'|'pixelated'|null} filter
	 * @param {*} face
	 */
	constructor(img, x, y, filter, face) {
		super(img, x, y);

		this.face = face;
		this.box = {
			x: this.face ? Math.floor(this.face.box.xMin) : x,
			y: this.face ? Math.floor(this.face.box.yMin) : y,
			w: this.face ? Math.ceil(this.face.box.width) : img.width,
			h: this.face ? Math.ceil(this.face.box.height) : img.height,
		};

		// Crop image using bounding box
		this.croppedImg = this.crop(this.img, this.box);

		// Filter cropped image
		this.filter = filter;
		switch (this.filter) {
			case "grayscale":
				this.filteredImg = grayscaleFilter(this.croppedImg);
				break;
			case "colorSpace":
				this.filteredImg = colorSpaceFilter(
					this.croppedImg,
					"HSV",
					null
				);
				break;
			case "inverted":
				this.filteredImg = invertFilter(this.croppedImg);
				break;
			case "blur":
				const blurLevel = 10; // Enough to make unrecognizable
				this.filteredImg = blurFilter(this.croppedImg, blurLevel);
				break;
			case "pixelated":
				this.filteredImg = pixelatedFilter(
					this.croppedImg,
					this.x,
					this.y
				);
				break;
			default:
				this.filteredImg = this.croppedImg;
		}
	}

	async draw() {
		// Draw image...
		image(this.img, this.x, this.y);

		if (this.filter) {
			// Filtered and cropped image
			image(this.filteredImg, this.x, this.y);
		} else {
			// Bounding box
			push();
			noFill();
			strokeWeight(2);
			stroke(0, 250, 0);
			rect(
				this.x + this.box.x,
				this.y + this.box.y,
				this.box.w,
				this.box.h
			);
			pop();
		}
	}

	crop(img, box) {
		const cropped = createImage(img.width, img.height);

		cropped.loadPixels();
		img.loadPixels();

		let index,
			red = 0,
			green = 0,
			blue = 0,
			alpha = 0;

		const rightLimit = box.x + box.w,
			bottomLimit = box.y + box.h;
		for (let x = box.x; x < rightLimit; x++) {
			for (let y = box.y; y < bottomLimit; y++) {
				// Access original pixels
				index = (y * img.width + x) * 4;

				red = img.pixels[index + 0];
				green = img.pixels[index + 1];
				blue = img.pixels[index + 2];
				alpha = img.pixels[index + 3];

				// Access cropped pixels
				cropped.pixels[index + 0] = red;
				cropped.pixels[index + 1] = green;
				cropped.pixels[index + 2] = blue;
				cropped.pixels[index + 3] = alpha;
			}
		}

		cropped.updatePixels();
		return cropped;
	}
}

class LiveFaceDetectionWidget extends Widget {
	/**
	 *
	 * @param {*} capture
	 * @param {*} img
	 * @param {number} x
	 * @param {number} y
	 * @param {*} face
	 */
	constructor(capture, img, x, y, face) {
		super(img, x, y);

		this.capture = capture;
		this.face = face;
	}

	async draw() {
		// Draw capture as image
		image(this.capture, this.x, this.y);

		if (this.face) {
			this.drawOval();

			this.drawEyes();

			this.drawMouth();
		}
	}

	drawOval() {
		push();
		noStroke();
		ellipseMode(CENTER);
		fill(255, 0, 0);
		let centerX = this.x + this.face.faceOval.centerX,
			centerY = this.face.faceOval.centerY,
			faceWidth = this.face.faceOval.width * 1.4,
			faceHeight = this.face.faceOval.height;
		ellipse(centerX, centerY, faceWidth);
		fill(250, 250, 250);
		ellipse(centerX, centerY, faceWidth * 0.9);
		pop();
	}

	drawEyes() {
		push();
		noStroke();
		ellipseMode(CENTER);

		// Left Eye
		let centerXLeft = this.x + this.face.leftEye.centerX + 4,
			centerYLeft = this.face.leftEye.centerY + 4,
			eyeRadiusLeft = this.face.leftEye.width * 2;

		// Lid
		fill(253, 224, 71);
		ellipse(centerXLeft, centerYLeft, eyeRadiusLeft);
		// Sclera
		fill(250, 250, 250);
		ellipse(centerXLeft, centerYLeft, eyeRadiusLeft * 0.8);
		// Iris
		fill(50, 50, 50);
		ellipse(centerXLeft, centerYLeft, eyeRadiusLeft * 0.6);
		// Eyebrow
		noFill();
		strokeWeight(2);
		stroke(50, 50, 50);
		arc(
			centerXLeft,
			centerYLeft,
			eyeRadiusLeft * 1.3,
			eyeRadiusLeft * 1.3,
			PI + QUARTER_PI,
			QUARTER_PI,
			OPEN
		);

		noStroke();
		// Right Eye
		let centerXRight = this.x + this.face.rightEye.centerX - 4,
			centerYRight = this.face.rightEye.centerY + 4,
			eyeRadiusRight = this.face.rightEye.width * 2;
		// Lid
		fill(253, 224, 71);
		ellipse(centerXRight, centerYRight, eyeRadiusRight);
		// Sclera
		fill(250, 250, 250);
		ellipse(centerXRight, centerYRight, eyeRadiusRight * 0.8);
		// Iris
		fill(50, 50, 50);
		ellipse(centerXRight, centerYRight, eyeRadiusRight * 0.6);
		// Eyebrow
		noFill();
		strokeWeight(2);
		stroke(50, 50, 50);
		arc(
			centerXRight,
			centerYRight,
			eyeRadiusRight * 1.3,
			eyeRadiusRight * 1.3,
			PI - QUARTER_PI,
			TWO_PI - QUARTER_PI,
			OPEN
		);

		pop();
	}

	drawMouth() {
		push();
		noStroke();
		ellipseMode(CENTER);

		/// Nose
		// Shadow
		let centerNoseX = this.x + this.face.lips.centerX,
			centerNoseY = this.face.lips.centerY - 4,
			widthNose = this.face.lips.width * 1.5,
			heightNose = 2;

		fill(218, 197, 183);
		ellipse(centerNoseX, centerNoseY, widthNose, heightNose);

		// Nasals
		noFill();
		strokeWeight(1);
		stroke(255, 0, 0);
		arc(
			centerNoseX - widthNose / 4,
			centerNoseY,
			widthNose / 3,
			(widthNose / 3) * 1.3,
			PI,
			0,
			OPEN
		);
		arc(
			centerNoseX + widthNose / 4,
			centerNoseY,
			widthNose / 3,
			(widthNose / 3) * 1.3,
			PI,
			0,
			OPEN
		);

		/// Mouth
		// Lips
		arc(centerNoseX, centerNoseY + 6, widthNose * 1.2, 4, PI, 0, OPEN);
		// Left Shadow
		noFill();
		strokeWeight(3);
		stroke(50, 50, 50);
		arc(
			centerNoseX + widthNose * 0.65,
			centerNoseY + 4,
			widthNose * 0.4,
			widthNose * 0.4,
			PI + QUARTER_PI,
			PI - QUARTER_PI,
			OPEN
		);
		// Right Shadow
		arc(
			centerNoseX - widthNose * 0.65,
			centerNoseY + 4,
			widthNose * 0.4,
			widthNose * 0.4,
			QUARTER_PI,
			TWO_PI - QUARTER_PI,
			OPEN
		);

		/// Bottom Shadows
		// Bottom Left Shadow
		arc(
			centerNoseX - widthNose * 0.3,
			centerNoseY + 14,
			widthNose * 0.4,
			widthNose * 0.4,
			-QUARTER_PI,
			PI - QUARTER_PI,
			OPEN
		);
		// Bottom Center Shadow
		line(
			centerNoseX,
			centerNoseY + 10,
			centerNoseX,
			centerNoseY + 10 + widthNose * 0.4
		);
		// Bottom Right Shadow
		arc(
			centerNoseX + widthNose * 0.3,
			centerNoseY + 14,
			widthNose * 0.4,
			widthNose * 0.4,
			QUARTER_PI,
			PI + QUARTER_PI,
			OPEN
		);
		pop();
	}

	/**
	 *
	 * @param {{x:number, y:number}} keypoints
	 * @returns
	 */
	mapKeypoints(keypoints) {
		const x = map(
			keypoints.x,
			0,
			width,
			this.face.box.xMin,
			this.face.box.xMax
		);
		const y = keypoints.y;
		return { x, y };
	}
}
/* class PixelatedWidget extends Widget {
	constructor(img, x, y) {
		super(img, x, y);
	}

	draw() {
		image(this.img, this.x, this.y);
		pixelatedFilter(this.img, this.x, this.y, 4);
	}
} */
