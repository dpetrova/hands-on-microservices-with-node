/**
 * @name imagini-v1-api
 * @description This module packages the Imagini API.
 */
'use strict';

const hydraExpress = require('hydra-express');
const hydra = hydraExpress.getHydra();
const express = hydraExpress.getExpress();
const ServerResponse = require('fwsp-server-response');
const fs = require("fs");
const path = require("path");
const sharp = require("sharp");
const bodyparser = require("body-parser");

let serverResponse = new ServerResponse();

express.response.sendError = function(err) {
  serverResponse.sendServerError(this, {result: {error: err}});
};
express.response.sendOk = function(result) {
  serverResponse.sendOk(this, {result});
};

let api = express.Router();

api.param("image", (req, res, next, image) => {
  if (!image.match(/\.(png|jpg)$/i)) {
    return res.sendError("invalid image type/extension");
  }

  req.image = image;
  req.localpath = path.join(__dirname, "../uploads", req.image);
  
  return next();
});

api.get('/', (req, res) => {
  res.sendOk({greeting: 'Welcome to Hydra Express!'});
});

api.post("/:image", bodyparser.raw({limit : "10mb", type  : "image/*"}), (req, res) => {
  let writeStream = fs.createWriteStream(req.localpath, {flags: "w+", encoding: "binary"});
  
  req.pipe(writeStream);
  
  writeStream.on("close", () => {
    res.sendOk({ size: req.body.length });
  });
});

api.head("/:image", (req, res) => {
  fs.access(req.localpath, fs.constants.R_OK, (err) => {
      if (err) return res.sendError("image not found");

      return res.sendOk();
  });
});

api.get("/:image", (req, res) => {
  fs.access(req.localpath, fs.constants.R_OK, (err) => {
      if (err) return res.sendError("image not found");

      let image = sharp(req.localpath);

      let width = +req.query.width;
      let height = +req.query.height;
      let blur = +req.query.blur;
      let sharpen = +req.query.sharpen;
      let greyscale = [ "y", "yes", "true", "1", "on"].includes(req.query.greyscale);
      let flip = [ "y", "yes", "true", "1", "on"].includes(req.query.flip);
      let flop = [ "y", "yes", "true", "1", "on"].includes(req.query.flop);

      if (width > 0 && height > 0) image.resize(width, height, {fit:"fill"});
      if (width > 0 || height > 0) image.resize(width || null, height || null);
      if (greyscale) image.greyscale();        
      if (flip) image.flip();        
      if (flop) image.flop();       
      if (blur > 0) image.blur(blur);        
      if (sharpen > 0) image.sharpen(sharpen);

      res.setHeader("Content-Type", "image/" + path.extname(req.image).substr(1));

      image.pipe(res);
  });
});

module.exports = api;

/*
1. Use browser to test create and download thumbnail:
http://localhost:3000/v1/imagini/example.png
http://localhost:3000/v1/imagini/example.png?height=100&width=200
http://localhost:3000/v1/imagini/example.png?height=100
http://localhost:3000/v1/imagini/example.png?width=150
http://localhost:3000/v1/imagini/example.png?greyscale=yes
http://localhost:3000/v1/imagini/example.png?blur=20
http://localhost:3000/v1/imagini/example.png?flip=yes&bsharpen=10
http://localhost:3000/v1/imagini/example.png?height=100&width=200&flop=yes

2. Use curl to test an image exists in upload folder:
curl --head "http://localhost:3000/v1/imagini/example.png"
curl --head "http://localhost:3000/v1/imagini/other.png"

3. Use curl to test upload image:
curl -X POST -H 'Content-Type:image/png' --data-binary @example.png http://localhost:3000/v1/imagini/example.png

We're telling curl that we want to:
- send a POST request
- define the Content-Type header saying it's a PNG image
- add the content of the example.png file (downloaded locally) inside the request body
- send the request to the /v1/imagini/example.png path of our microservice

*/