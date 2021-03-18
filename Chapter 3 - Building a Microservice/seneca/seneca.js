const seneca  = require("seneca");
//create a Seneca service
const service = seneca();

//load the imagini.js plugin and passes our desired path
service.use("./imagini.js", { path: __dirname + "/uploads" });

//start service on port 3000
service.listen(3000);


/*
!!!!THERE ARE SPECIFICS IN DIFFERENT CMD / OS -> TRY THIS IN cmder/bash/powershell !!!

1.test image upload:
- in git bash: -> Arguments too long -> to fix it instead of sending encoded image, send just filepath ()
curl -H "Content-Type: application/json" --data '{"role":"upload","image":"example.png","data":"'"$( base64 example.png)"'"}' http://localhost:3000/act
- in cmder: upload doesn't work -> because cannot execute $(base64 example.png), it recognise it as simple string:
curl -H "Content-Type: application/json" --data "{\"role\":\"upload\",\"image\":\"example.png\",\"data\":\"'$(base64 example.png)'\"}" http://localhost:3000/act

2.test check image exists:
- in cmder:
curl -H "Content-Type: application/json" --data "{\"role\":\"check\",\"image\":\"example.png\"}" http://localhost:3000/act
curl -H "Content-Type: application/json" --data "{\"role\":\"check\",\"image\":\"other.png\"}" http://localhost:3000/act
- in git bash:
curl -H "Content-Type: application/json" --data '{"role":"check","image":"other.png"}' http://localhost:3000/act

3.test download image (you need to install jq: choco install jq)
- in git bash:
curl -H "Content-Type: application/json" --data '{"role":"download","image":"example.png","greyscale":true,"height":100}' http://localhost:3000/act | jq -r '.data' | base64 --decode > example2.png
curl -H "Content-Type: application/json" --data '{"role":"download","image":"other.png"}' http://localhost:3000/act | jq -r '.data | length'
curl -H "Content-Type: application/json" --data '{"role":"download","image":"example.png"}' http://localhost:3000/act
curl -H "Content-Type: application/json" --data '{"role":"download","image":"example.png","flip":true}' http://localhost:3000/act | jq -r '.data' | example2.png
*/
