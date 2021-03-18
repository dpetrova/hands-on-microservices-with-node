/* CREATE THUMBNAILS USING IMAGE MANIPULATIONS */

const express = require("express");
const sharp = require("sharp"); //very fast image manipulation tool
const bodyparser = require("body-parser");
const path = require("path");
const fs = require("fs");

const app = express();

/* VALIDATE ROUTE PARAMS */
//preprocess any route that uses a parameter and check whether it's valid, and do some kind of stuff
app.param("image", (req, res, next, image) => {
    //check whether the image name passed ends with .png or .jpg; if not, reply with "Forbidden" for POST requests and "Not Found" for others
    if (!image.match(/\.(png|jpg)$/i)) return res.status(req.method == "POST" ? 403 : 404).end();

    //store the image and the expected local path in the request object
    req.image = image;
    req.localpath = path.join(__dirname, "uploads", req.image);
    return next();
});

/* UPLOAD AN IMAGE */
// a route to upload an image (expect an image with a maximum size of 10 MB)
app.post("/uploads/:image", bodyparser.raw({limit: "10mb", type: "image/*"}), (req, res) => {
    //create a stream to the local file where we'll save our image
    let writeStream = fs.createWriteStream(req.localpath, {flags: "w+", encoding: "binary"});

    //write the image to file   
    req.pipe(writeStream);
    
    //after properly closing the stream, we reply to the user with a JSON response with a status and a size property
    writeStream.on("close", () => {
      res.send({ status : "ok", size: req.body.length });
    });
});

/* CHECK WHETHER AN IMAGE EXISTS IN UPLOAD FOLDER */
//a HEAD request is like a GET request, but without a body (no content); it is used to request only information (headers) from a path
app.head("/uploads/:image", (req, res) => {
    //check if the current process has read access to the local file
    fs.access(req.localpath, fs.constants.R_OK, (err) => {
        //reply with "Not Fount" or "Found" depends on result
        res.status(err ? 404 : 200);
        res.end();
      }
    );
});

/* CREATE AND DOWNLOAD THUMBNAIL IMAGES */
function downloadImage(req, res) {    
    //check whether the image exists (whether current process has read access to the local file)
    fs.access(req.localpath, fs.constants.R_OK, (err) => {
        if (err) return res.status(404).end();

        //initialize the image processing by passing its local path
        let image = sharp(req.localpath);

        //get query parameters
        let width = +req.query.width;
        let height = +req.query.height;        
        let greyscale = [ "y", "yes", "1", "on"].includes(req.query.greyscale);
        let blur = +req.query.blur;
        let sharpen = +req.query.sharpen;
        let flip = [ "y", "yes", "1", "on"].includes(req.query.flip);
        let flop = [ "y", "yes", "1", "on"].includes(req.query.flop);

        //ignore aspect ratio if both width and height are provideded
        if (width > 0 && height > 0) image.resize(width, height, {fit:"fill"});
        //if we receive one of the width or height parameters, we resize the image (sharp will maintain aspect ratio)
        if (width > 0 || height > 0) image.resize(width || null, height || null);
        //enable grey scaling
        if (greyscale) image.greyscale();
        //flip the image vertically
        if (flip) image.flip();
        //flip the image horizontally
        if (flop) image.flop();
        //blur image
        if (blur > 0) image.blur(blur);
        //sharpen image
        if (sharpen > 0) image.sharpen(sharpen);
        
        //set the content type returned to the user (content type should be in the format image/extension (without a dot))
        res.setHeader("Content-Type", "image/" + path.extname(req.image).substr(1));

        //send image to the user
        image.pipe(res);
    });
}

app.get("/uploads/:image", downloadImage);

/* CREATE AN EMPTY IMAGE */
//a route to get an image, with a regular expression that will catch the address /thumbnail.png and /thumbnail.jpg (service will accept thumbnail requests on both PNG and JPEG formats)
app.get(/\/thumbnail\.(jpg|png)/, (req, res, next) => {
    //accept parameters from user
    let format = (req.params[0] == "png" ? "png" : "jpeg");
    let width = +req.query.width || 300;
    let height = +req.query.height || 200;
    let border = +req.query.border || 5;
    let bgcolor = req.query.bgcolor || "#fcfcfc";
    let fgcolor = req.query.fgcolor || "#ddd";
    let textcolor = req.query.textcolor || "#aaa";
    let textsize = +req.query.textsize || 24;

    //create an empty image using sharp
    let image = sharp({
        create: {
            width: width,
            height: height,
            channels: 4,
            background: { r: 0, g: 0, b: 0 },
       }
    });

    //create an SVG file with an outer border, two crossing lines, and a text in the middle with the size of the image
    const thumbnail = Buffer.from(
        `<svg width="${width}" height="${height}">
            <rect
                x="0" y="0"
                width="${width}" height="${height}"
                fill="${fgcolor}" />
            <rect
                x="${border}" y="${border}"
                width="${width - border * 2}" height="${height - border * 2}"
                fill="${bgcolor}" />
            <line
                x1="${border * 2}" y1="${border * 2}"
                x2="${width - border * 2}" y2="${height - border * 2}"
                stroke-width="${border}" stroke="${fgcolor}" />
            <line
                x1="${width - border * 2}" y1="${border * 2}"
                x2="${border * 2}" y2="${height - border * 2}"
                stroke-width="${border}" stroke="${fgcolor}" />
            <rect
                x="${border}" y="${(height - textsize) / 2}"
                width="${width - border * 2}" height="${textsize}"
                fill="${bgcolor}" />
            <text
                x="${width / 2}" y="${height / 2}" dy="8"
                font-family="Helvetica" font-size="${textsize}"
                fill="${textcolor}" text-anchor="middle">${width} x ${height}</text>
        </svg>`
    );

    //overlay the SVG on our empty image, and output the result to the user
    //image.overlayWith(thumbnail)[format]().pipe(res);
    image    
      .composite([{
          input: thumbnail
      }])
      [format]() //.png or .jpg
      .pipe(res)
});

//initialize our service on port 3000
app.listen(3000, () => {
    console.log("ready");
});

/*
!!!!THERE ARE SPECIFICS IN DIFFERENT CMD / OS -> TRY THIS IN cmder/bash/powershell !!!

1. Use browser to test create and download thumbnail:
http://localhost:3000/uploads/example.png
http://localhost:3000/uploads/example.png?height=100&width=200
http://localhost:3000/uploads/example.png?height=100
http://localhost:3000/uploads/example.png?width=150
http://localhost:3000/uploads/example.png?greyscale=yes
http://localhost:3000/uploads/example.png?blur=20
http://localhost:3000/uploads/example.png?flip=yes&bsharpen=10
http://localhost:3000/uploads/example.png?height=100&width=200&flop=yes

2. Use browser to test create an empty thumbnail:
http://localhost:3000/thumbnail.jpg
http://localhost:3000/thumbnail.jpg?width=500&border=2&fgcolor=cyan

3. Use curl to test an image exists in upload folder:
curl --head "http://localhost:3000/uploads/example.png"
curl --head "http://localhost:3000/uploads/other.png"

4. Use curl to test upload image:
curl -X POST -H 'Content-Type:image/png' --data-binary @example.png http://localhost:3000/uploads/example.png

We're telling curl that we want to:
- send a POST request
- define the Content-Type header saying it's a PNG image
- add the content of the example.png file (downloaded locally) inside the request body
- send the request to the /upload/example.png path of our microservice

*/