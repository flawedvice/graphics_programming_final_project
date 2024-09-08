class Widget {
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
	constructor(img, x, y, color, useTreshold = false) {
		super(img, x, y);
		this.color = color;
		this.useTreshold = useTreshold;

		this.thresholdSlider = null;

		if (this.useTreshold) {
			this.thresholdSlider = createSlider(0, 255, 125);
			this.thresholdSlider.position(
				this.x,
				this.y + this.img.height - 50
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
	constructor(img, x, y, colorSpace, useTreshold = false) {
		super(img, x, y);
		this.colorSpace = colorSpace;
		this.useTreshold = useTreshold;

		this.thresholdSlider = null;

		if (this.useTreshold) {
			this.thresholdSlider = createSlider(0, 255, 125);
			this.thresholdSlider.position(
				this.x,
				this.y + this.img.height - 50
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
