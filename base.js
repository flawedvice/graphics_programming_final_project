/**
 * Captrues picture from video.
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

/**
 * Detects faces asynchronously using ml5js faceMesh api
 * @param {*} img
 * @returns Promise with detected faces array
 */
async function detectFaces(img) {
	const promise = new Promise((resolve, reject) => {
		faceMesh.detect(img, (results, error) => {
			if (error) {
				reject(error);
			} else {
				resolve(results);
			}
		});
	});
	return promise;
}
