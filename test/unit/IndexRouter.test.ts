import * as mocha from "mocha";
import * as chai from "chai";
const assert = chai.assert;
import { IndexRouter } from "../../server/routes/IndexRouter";
import { Router } from "express";

describe("Index Router Tests", () => {
    let router;
    before(() => {
        router = new IndexRouter();
    });

    it("it should have a user authenication router", () => {
        assert.equal(router.hasOwnProperty("userAuthenicationRouter"), true);
        assert.equal(typeof (router.userAuthenicationRouter), typeof (Router));
    });

    it("it should have a user dasboard router", () => {
        assert.equal(router.hasOwnProperty("userDashboardRouter"), true);
        assert.equal(typeof (router.userDashboardRouter), typeof (Router));
    });

    it("it should have a home router", () => {
        assert.equal(router.hasOwnProperty("homeRouter"), true);
        assert.equal(typeof (router.homeRouter), typeof (Router));
    });

    it("it should have a admin dashboard router", () => {
        assert.equal(router.hasOwnProperty("adminDashboardRouter"), true);
        assert.equal(typeof (router.adminDashboardRouter), typeof (Router));
    });
});
