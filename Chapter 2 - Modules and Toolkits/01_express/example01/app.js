let express = require("express");
let app = express();

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.listen(3000);


/* 
To install Express, create a folder and run the following command:
npm init –y
npm install express ––save

To run your code using the following command: 
node app 
*/