import * as mocha from "mocha";
import * as chai from "chai";
import chaiHttp = require("chai-http");
const assert = chai.assert;
chai.use(chaiHttp);

describe("BaseRouter Tests", () => {
    // I suppose it really doesnt matter the exact route we test, I'm just testing the methods the other routers in inherit 
    // from the abstract class BaseRouter.
    const host = "http://localhost:8080";
    const path = "/api/admindashboard/getusers";
    it("it should say no Token in Header", async () => {
        return chai.request(host)
            .get(path)
            .catch(async error => {
                assert.equal(error.status, 401);
                const body = JSON.parse(error.response.text);
                assert.equal(body.status, false);
                assert.equal(body.relogin, true);
                assert.equal(body.message, "No token in header");
            });
    });
});