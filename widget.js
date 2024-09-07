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

		if (this.useTreshold) {
			const thresholdSlider = createSlider(0, 255, 125);
			const thresholdID = `thresholder-${Math.floor(
				Math.random() * (99999 - 1) - 1
			)}`;
			thresholdSlider.id(thresholdID);
			thresholdSlider.position(this.x, this.y + this.img.height - 50);

			this.thresholdSlider = thresholdSlider;
		} else {
			this.thresholdSlider = null;
		}
	}
	draw() {
		if (this.useTreshold && this.thresholdSlider) {
			image(
				thresholdRGBFilter(
					this.img,
					this.color,
					this.thresholdSlider.value()
				),
				this.x,
				this.y
			);
		} else {
			image(rgbChannelFilter(this.img, this.color), this.x, this.y);
		}
	}
}
