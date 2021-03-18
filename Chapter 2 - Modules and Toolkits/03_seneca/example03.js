const async = require("async");
const seneca = require("seneca");
const service = seneca();

service.use("basic");
//using entities, an API exposed by Seneca, which helps you store and manipulate data objects using a simple abstraction layer similar to an ORM
service.use("entity");
service.use("jsonfile-store", { folder : "data" });

const stack = service.make$("stack");

stack.load$((err) => {
	if (err) throw err;

	service.add("stack:push,value:*", (msg, next) => {
		stack.make$().save$({ value: msg.value }, (err) => {
			return next(err, { value: msg.value });
		});
	});

	service.add("stack:pop,value:*", (msg, next) => {
		stack.list$({ value: msg.value }, (err, items) => {
			async.each(items, (item, next) => {
				item.remove$(next);
			}, (err) => {
				if (err) return next(err);

				return next(err, { remove: items.length });
			});
		});
	});

	service.add("stack:get", (msg, next) => {
		stack.list$((err, items) => {
			if (err) return next(err);

			return next(null, items.map((item) => (item.value)));
		});
	});

	service.listen(3000);
});

/*
try it in your browser; the URL describes an action (/act) we want to perform and the query parameter gets converted to our pattern:
http://localhost:3000/act?stack=get -> []
http://localhost:3000/act?stack=push&value=one -> {"value":"one"}
http://localhost:3000/act?stack=push&value=two -> {"value":"two"}
http://localhost:3000/act?stack=get -> ["one", "two"]
http://localhost:3000/act?stack=pop&value=one -> {"remove":1}
http://localhost:3000/act?stack=get -> ["two"]
*/