/* RethinkDB -> no-relational database */

const settings = require("./settings");
const bodyparser = require("body-parser");
const express = require("express");
const rethinkdb = require("rethinkdb");
const path = require("path");
const sharp = require("sharp");

const app = express();

//connect to rethinkDB server
rethinkdb.connect(settings.db, (err, db) => {
	if (err) throw err;

	console.log("db: ready");

	rethinkdb.tableList().run(db, (err, tables) => {
		if (err) throw err;

		//create table images if not exists
		if (!tables.includes("images")) {
			rethinkdb.tableCreate("images").run(db);
		}
	});	

	//preprocess any route that uses a parameter and check whether it's valid, and do some kind of stuff
	app.param("image", (req, res, next, image) => {
		if (!image.match(/\.(png|jpg)$/i)) {
			return res.status(403).end();
		}

		//get image by name from db
		rethinkdb.table("images").filter({name: image}).limit(1).run(db, (err, images) => {
			if (err) return res.status(404).end();

			images.toArray((err, images) => {
				if (err) return res.status(500).end();
				if (!images.length) return res.status(404).end();

				//if found -> stores the image information in req.image
				req.image = images[0];

				return next();
			});
		});
	});


	//upload image route (accept content of type image with a maximum size of 10 MB)
	app.post("/uploads/:name", bodyparser.raw({limit: "10mb", type: "image/*"}), (req, res) => {
		//store image in db	
		rethinkdb.table("images").insert({name: req.params.name, size: req.body.length,	data: req.body}).run(db, (err) => {
			if (err) {
				return res.send({ status : "error", code: err.code });
			}

			res.send({ status : "ok", size: req.body.length });
		});
	});


	// check image exists route
	app.head("/uploads/:image", (req, res) => {
		return res.status(200).end();
	});	

	
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
		rethinkdb.table("images").get(req.image.id).update({ date_used : Date.now() }).run(db);
		//set the content type returned to the user (content type should be in the format image/extension (without a dot))
		res.setHeader("Content-Type", "image/" + path.extname(req.image.name).substr(1));
		//send image to the user
		image.pipe(res);
	});


	//delete image route
	app.delete("/uploads/:image", (req, res) => {
		//delete by id
		rethinkdb.table("images").get(req.image.id).delete().run(db, (err) => {
			return res.status(err ? 500 : 200).end();
		});
	});


	//get db statistics route
	app.get("/stats", (req, res) => {
		rethinkdb.table("images").count().run(db, (err, total) => {
			if (err) return res.status(500).end();

			rethinkdb.table("images").sum("size").run(db, (err, size) => {
				if (err) return res.status(500).end();

				rethinkdb.table("images").max("date_used").run(db, (err, last_used) => {
					if (err) return res.status(500).end();

					last_used = (last_used ? new Date(last_used.date_used) : null);

					return res.send({ total, size, last_used });
				});
			});
		});
	});
	

	//check our database periodically and delete images older than 1 month
	setInterval(() => {
		let expiration = Date.now() - (30 * 86400 * 1000);
		rethinkdb.table("images").filter((image) => (image("date_used").lt(expiration))).delete().run(db);
	}, 3600 * 1000);

	app.listen(3000, () => {
		console.log("app: ready");
	});
});
