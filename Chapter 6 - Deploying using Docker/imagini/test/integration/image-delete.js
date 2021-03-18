const chai = require("chai");
const sinon = require("sinon");
const http = require("chai-http");
const tools = require("../tools");

chai.use(http);

describe("Deleting image", () => {
	beforeEach((done) => {
		chai
		.request(tools.service)
		.delete("/uploads/test_image_delete.png")
		.end(() => {
			return done();
		});
	});

	it("should return 200 if it exists", (done) => {
		chai
		.request(tools.service)
		.post("/uploads/test_image_delete.png")
		.set("Content-Type", "image/png")
		.send(tools.sample)
		.end((err, res) => {
			chai.expect(res).to.have.status(200);
			chai.expect(res.body).to.have.status("ok");

			//delete image
			chai
			.request(tools.service)
			.delete("/uploads/test_image_delete.png")
			.end((err, res) => {
				chai.expect(res).to.have.status(200);
				return done();
			});
		});
	});

	it("should return 500 if a database error happens", (done) => {
		chai
		.request(tools.service)
		.post("/uploads/test_image_delete.png")
		.set("Content-Type", "image/png")
		.send(tools.sample)
		.end((err, res) => {
			chai.expect(res).to.have.status(200);
			chai.expect(res.body).to.have.status("ok");

			//create a stub on the db.query method
			let query = sinon.stub(tools.service.db, "query");
			//tell Sinon that when the stub is called with the first argument with DELETE, we want it to asynchronously call the third argument with a fake error
			query.withArgs("DELETE FROM images WHERE id = ?").callsArgWithAsync(2, new Error("Fake"));
			query.callThrough();

			chai
			.request(tools.service)
			.delete("/uploads/test_image_delete.png")
			.end((err, res) => {
				chai.expect(res).to.have.status(500);
				//restore the stub to the original function
				query.restore();
				return done();
			});
		});
	});
});
