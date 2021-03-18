const seneca  = require("seneca");
const service = seneca();

/*
expose a producer function that matches an object that has math equal to sum;
this means that any request object to the service that has the property math and that is equal to sum will be passed to this function;
this function accepts two arguments: msg, which is the request object, and next, which is callback that the function should invoke when finished or in case of an error.
In this particular case, we're expecting an object that also has a values property and we're returning the sum of all values by using the reduce method
*/
service.add({ math: "sum" }, (msg, next) => {
	next(null, {
		sum : msg.values.reduce((total, value) => (total + value), 0)
	});
});

/*
invoke act(), as passing an object with the math equal to sum and a list of values
*/
service.act({ math: "sum", values: [ 1, 2, 3 ] }, (err, msg) => {
	if (err) return console.error(err);
	console.log("sum = %s", msg.sum);
});
