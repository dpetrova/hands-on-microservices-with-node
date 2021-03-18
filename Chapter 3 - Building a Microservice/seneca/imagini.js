/* imagini plugin, a service that manipulates images */

const sharp = require("sharp");
const path = require("path");
const fs = require("fs");

//to be able to configure the local image folder, we define an optional settings parameter, which will default to an object with the property path equal to uploads
module.exports = function (settings = { path: "uploads" }) {
	//function that will convert our image parameter to the local path
	const localpath = (image) => {
		return path.join(settings.path, image);
	}

	//function that will check whether we have access to a local file
	const access = (filename, next) => {
		fs.access(filename, fs.constants.R_OK , (err) => {
			return next(!err, filename);
		});
	};

	//check existing image route
	//Seneca service will call our plugin function and reference itself to this
	this.add("role:check,image:*", (msg, next) => {
		access(localpath(msg.image), (exists) => {
			return next(null, { exists : exists });
		});
	});

	//upload image route
	this.add("role:upload,image:*,data:*", (msg, next) => {
	//Buffer objects are used to represent a fixed-length sequence of bytes
	//use Buffer.from to convert our image data, which we'll be uploading in base64 (by default, every message should be JSON-encoded, so we'll encode the image in base64 to pass it as a string)
		let data = Buffer.from(msg.data, "base64");

		fs.writeFile(localpath(msg.image), data, (err) => {
			return next(err, { size : data.length });
		});
	});

	//download image route
	this.add("role:download,image:*", (msg, next) => {
		access(localpath(msg.image), (exists, filename) => {
			if (!exists) return next(new Error("image not found"));

			let image = sharp(filename);
			let width = +msg.width || null;
			let height = +msg.height || null;

			if (width && height) image.ignoreAspectRatio();
			if (width || height) image.resize(width, height);
			if (msg.flip) image.flip();
			if (msg.flop) image.flop();
			if (msg.blur > 0) image.blur(blur);
			if (msg.sharpen > 0) image.sharpen(sharpen);
			if (msg.greyscale) image.greyscale();

			//convert image to base64 and pass it on the JSON response
			image.toBuffer().then((data) => {
				return next(null, { data: data.toString("base64") });
			});
		});
	});
};
