const chai = require("chai");
const sinon = require("sinon");
const http = require("chai-http");
const tools = require("../tools");

chai.use(http);

describe("Deleting older images", () => {
	//replace the global timer functions (setTimeoutand setInterval) with fake timers
	let clock = sinon.useFakeTimers({ shouldAdvanceTime: true });

	it("should run every hour", (done) => {
		chai
		.request(tools.service)
		.get("/stats")
		.end((err, res) => {
			chai.expect(res).to.have.status(200);
			//advance time by one hour
			clock.tick(3600 * 1000);
			//restore timers
			clock.restore();

			return done();
		});
	});
});
