/* Redis -> in-memory database */

const bodyparser = require("body-parser");
const express = require("express");
const redis = require("redis");
const path = require("path");
const sharp = require("sharp");

const app = express();

//create redis client instance
const db = redis.createClient();

//connect to redis db
db.on("connect", () => {
	console.log("db: ready");
	//we will use hashes to store our images
	//each image will have a different hash, and the name of the hash will be the name of the image

	//preprocess any route that uses a parameter and check whether it's valid, and do some kind of stuff
	app.param("image", (req, res, next, name) => {
		if (!name.match(/\.(png|jpg)$/i)) {
			return res.status(403).end();
		}

		db.hgetall(name, (err, image) => {
			if (err || !image) return res.status(404).end();

			req.image = image;
			req.image.name = name;

			return next();
		});
	});


	//upload image route (accept content of type image with a maximum size of 10 MB)
	app.post("/uploads/:name", bodyparser.raw({limit: "10mb", type : "image/*"}), (req, res) => {
		//store image in db	(hmset command lets us set multiple fields of a hash)
		db.hmset(req.params.name, {size: req.body.length, data: req.body.toString("base64")	}, (err) => {
			if (err) {
				return res.send({ status : "error", code: err.code });
			}

			res.send({ status : "ok", size: req.body.length });
		});
	});

	app.head("/uploads/:image", (req, res) => {
		return res.status(200).end();
	});	


	//image manipulation route (and download)
	app.get("/uploads/:image", (req, res) => {
		let image = sharp(Buffer.from(req.image.data, "base64"));
		let width = +req.query.width;
		let height = +req.query.height;
		let blur = +req.query.blur;
		let sharpen = +req.query.sharpen;
		let greyscale = [ "y", "yes", "true", "1", "on"].includes(req.query.greyscale);
		let flip = [ "y", "yes", "true", "1", "on"].includes(req.query.flip);
		let flop = [ "y", "yes", "true", "1", "on"].includes(req.query.flop);

		//ignore aspect ratio if both width and height are provideded
        if (width > 0 && height > 0) image.resize(width, height, {fit:"fill"});
        //if we receive one of the width or height parameters, we resize the image (sharp will maintain aspect ratio)
        if (width > 0 || height > 0) image.resize(width || null, height || null);
		//blur image
        if (blur > 0) image.blur(blur);
        //sharpen image
        if (sharpen > 0) image.sharpen(sharpen);
        //enable grey scaling
        if (greyscale) image.greyscale();
        //flip the image vertically
        if (flip) image.flip();
        //flip the image horizontally
        if (flop) image.flop();

		//update image in db
		db.hset(req.image.name, "date_used", Date.now());
		//set the content type returned to the user (content type should be in the format image/extension (without a dot))
		res.setHeader("Content-Type", "image/" + path.extname(req.image.name).substr(1));
		//send image to the user
		image.pipe(res);
	});


	//delete image route
	app.delete("/uploads/:image", (req, res) => {
		//remove hash
		db.del(req.image.name, (err) => {
			return res.status(err ? 500 : 200).end();
		});
	});

	app.listen(3000, () => {
		console.log("app: ready");
	});
});


/*
!!!!THERE ARE SPECIFICS IN DIFFERENT CMD / OS -> TEST CURL COMMANDS IN git bash !!!

1. test upload image:
curl -H 'Content-Type:image/png' --data-binary @example.png http://localhost:3000/uploads/test.png

2. test image exists:
curl --head http://localhost:3000/uploads/test.png
curl --head http://localhost:3000/uploads/other.png

3. test image manipulations:
http://localhost:3000/uploads/test.png?height=100&greyscale=y

4. test delete image
curl -v -X DELETE http://localhost:3000/uploads/test.png

*/