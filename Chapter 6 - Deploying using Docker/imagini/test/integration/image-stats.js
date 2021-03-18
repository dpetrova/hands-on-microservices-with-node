const chai = require("chai");
const sinon = require("sinon");
const http = require("chai-http");
const tools = require("../tools");

chai.use(http);

describe("Statistics", () => {
	it("should return an object with total, size, last_used and uptime", (done) => {
		chai
		.request(tools.service)
		.get("/stats")
		.end((err, res) => {
			chai.expect(res).to.have.status(200);
			chai.expect(res.body).to.have.property("total");
			chai.expect(res.body).to.have.property("size");
			chai.expect(res.body).to.have.property("last_used");
			chai.expect(res.body).to.have.property("uptime");

			return done();
		});
	});

	it("should return 500 if a database error happens", (done) => {
		//create a stub on the db.query method
		let query = sinon.stub(tools.service.db, "query");
		//tell Sinon that when the stub is called with the first argument with SELECT, we want it to asynchronously call the second argument with a fake error
		query.withArgs("SELECT COUNT(*) total, SUM(size) size, MAX(date_used) last_used FROM images").callsArgWithAsync(1, new Error("Fake"));
		query.callThrough();

		chai
		.request(tools.service)
		.get("/stats")
		.end((err, res) => {
			chai.expect(res).to.have.status(500);
			//restore the stub to the original function
			query.restore();
			return done();
		});
	});
});
