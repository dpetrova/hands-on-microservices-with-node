/* MySQL -> relational database */

const bodyparser = require("body-parser");
const express = require("express");
const path = require("path");
const sharp = require("sharp");
const mysql = require("mysql");

//to avoid having the credentials in our code, we can create a separate file and put settings there that we may change in the future, 
//and that shouldn't belong in the code
const settings = require("./settings");

const app = express();

//create database connection
const db = mysql.createConnection(settings.db);

//msql module only connects to the database when you make a query
//this means the service would start and you wouldn't know whether your connection settings are correct until you make the first query
//so let's force a connection and check if the server is running and accepts our connection:
db.connect((err) => {
	if (err) throw err;

	console.log("db: ready");

	//create a table to store images
	db.query(
		`CREATE TABLE IF NOT EXISTS images
		(
			id INT(11) UNSIGNED NOT NULL AUTO_INCREMENT,
			date_created TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
			date_used TIMESTAMP NULL DEFAULT NULL,
			name VARCHAR(300) NOT NULL,
			size INT(11) UNSIGNED NOT NULL,
			data LONGBLOB NOT NULL,
			PRIMARY KEY (id),
			UNIQUE KEY name (name)
		) 
		ENGINE=InnoDB DEFAULT CHARSET=utf8`
	);
	//this will create the images table only if it doesn't exist already
	//define unique identification number (id), it is automatically incremented when insert a new item
	//define name as a unique key, meaning it has an index for quickly finding images by name, and also ensures our name does not repeat to prevent overwriting them
	//creation date is automatic as it defaults to the current timestamp
	//use date defaults to NULL, which means we haven't used the image yet	

	//preprocess any route that uses a parameter and check whether it's valid, and do some kind of stuff  
	app.param("image", (req, res, next, image) => {
		//validate image extension against png or jpg, and if not reply with "Forbidden" 
		if (!image.match(/\.(png|jpg)$/i)) {
			return res.status(403).end();
		}

		//get image from db
		db.query("SELECT * FROM images WHERE name = ?", [ image ], (err, images) => {
			//if not found -> return "Not Found"
			if (err || !images.length) {
				return res.status(404).end();
			}

			//if found -> stores the image information in req.image
			req.image = images[0];

			return next();
		});
	});


	//upload image route (accept content of type image with a maximum size of 10 MB)
	app.post("/uploads/:name", bodyparser.raw({limit: "10mb", type: "image/*"}), (req, res) => {		
		//store image in db		
		db.query("INSERT INTO images SET ?", {name: req.params.name, size: req.body.length,	data: req.body}, (err) => {			
			if (err) {
				console.log(err.sqlMessage)
				return res.send({ status : "error", code: err.code });
			}

			res.send({ status : "ok", size: req.body.length });
		});
	});


	// check image exists route	
	app.head("/uploads/:image", (req, res) => {
		//this method relies on the previous app.param to check whether the image exists, 
		//so, if we get to this point, we already know the image exists (it's on req.image), so we just need to return the code 200
		return res.status(200).end();
	});
	//a HEAD request is like a GET request, but without a body (no content); it is used to request only information (headers) from a path	


	//image manipulation route (and download)
	app.get("/uploads/:image", (req, res) => {
		let image = sharp(req.image.data);
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
		db.query("UPDATE images SET date_used = UTC_TIMESTAMP WHERE id = ?", [ req.image.id ]);

		//set the content type returned to the user (content type should be in the format image/extension (without a dot))
		res.setHeader("Content-Type", "image/" + path.extname(req.image.name).substr(1));

		//send image to the user
		image.pipe(res);
	});


	//delete image route
	app.delete("/uploads/:image", (req, res) => {
		db.query("DELETE FROM images WHERE id = ?", [ req.image.id ], (err) => {
			return res.status(err ? 500 : 200).end();
		});
	});


	//get db statistics route
	app.get("/stats", (req, res) => {
		//get information about: total number of images, total size of the images, when the last time was that we uploaded an image
		db.query("SELECT COUNT(*) total" +
		         ", SUM(size) size " +
		         ", MAX(date_used) last_used " +
		         "FROM images",
		(err, rows) => {
			if (err) {
				return res.status(500).end();
			}

			//how long our service is running
			rows[0].uptime = process.uptime();

			return res.send(rows[0]);
		});
	});


	//check our database periodically and delete old images that are not used for longer than a specific time period:
	//images that were not used in the past month (but were used before) or images that were not used in the past week (and never used before)
	setInterval(() => {
		db.query("DELETE FROM images " +
		         "WHERE (date_created < UTC_TIMESTAMP - INTERVAL 1 WEEK AND date_used IS NULL) " +
		         "OR (date_used < UTC_TIMESTAMP - INTERVAL 1 MONTH)");
	}, 3600 * 1000);


	app.listen(3000, () => {
		console.log("app: ready");
	});
});

/*
!!!!THERE ARE SPECIFICS IN DIFFERENT CMD / OS -> TEST CURL COMMANDS IN git bash !!!

1. test upload image:
curl -X POST -H 'Content-Type:image/png' --data-binary @example.png http://localhost:3000/uploads/test.png

We're telling curl that we want to:
- send a POST request
- define the Content-Type header saying it's a PNG image
- add the content of the example.png file inside the request body
- send the request to the /upload/test.png path of our microservice

2. test image exists:
curl --head http://localhost:3000/uploads/test.png
curl --head http://localhost:3000/uploads/other.png

3. test image manipulations:
http://localhost:3000/uploads/test.png
http://localhost:3000/uploads/test.png?height=100&width=200
http://localhost:3000/uploads/test.png?height=100
http://localhost:3000/uploads/test.png?width=150
http://localhost:3000/uploads/test.png?greyscale=yes
http://localhost:3000/uploads/test.png?blur=20
http://localhost:3000/uploads/test.png?flip=yes&bsharpen=10
http://localhost:3000/uploads/test.png?height=100&width=200&flop=yes

4. test delete image
curl -v -X DELETE http://localhost:3000/uploads/test.png

5. test get db statistics:
curl http://localhost:3000/stats

*/