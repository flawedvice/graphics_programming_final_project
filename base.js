/**
 * Captures a picture from a video.
 * @param {*} capture
 * @returns img object
 */
function takePicture(capture) {
	if (!img) {
		img = createImage(capture.width, capture.height);
	}
	img.copy(
		capture,
		0,
		0,
		capture.width,
		capture.height,
		0,
		0,
		img.width,
		img.height
	);
	return img;
}
