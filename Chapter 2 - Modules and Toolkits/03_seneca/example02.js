const seneca  = require("seneca");
const service = seneca({ log: "silent" }); //we don't care about logging
const stack = [];

// define our pattern as a string instead of an object (this action string is a shortcut to the extended object definition)
// explicitly indicate that we need a value
// indicate that we don't care what the value is (remember, this is pattern matching)
service.add("stack:push,value:*", (msg, next) => {
	stack.push(msg.value);
	next(null, stack);
});

service.add("stack:pop", (msg, next) => {
	stack.pop();
	next(null, stack);
});

service.add("stack:get", (msg, next) => {
	next(null, stack);
});

// tell our service to listen for messages
service.listen(3000);

/*
try it in your browser; the URL describes an action (/act) we want to perform and the query parameter gets converted to our pattern:
http://localhost:3000/act?stack=get -> []
http://localhost:3000/act?stack=push&value=one -> ["one"]
http://localhost:3000/act?stack=push&value=two -> ["one", "two"]
http://localhost:3000/act?stack=pop -> ["one"]
*/