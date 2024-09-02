class Widget {
	/**
	 * @param {string} img
	 * @param {(img)=>img} filter
	 * @param {[number, number]} position Position vector
	 */
	constructor(img, filter, position) {
		this.img = img;
		this.filter = filter;
		this.position = position;
	}

	// Resizes the image.
	#resize() {
		this.img.resize(160, 120);
	}

	#applyFilter() {
		// Apply filter to image
	}

	// Draws the image into the canvas.
	draw() {
		image(this.img, this.position[0], position[1]);
	}
}
