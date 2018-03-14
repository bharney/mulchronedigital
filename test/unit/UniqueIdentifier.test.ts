import * as mocha from "mocha";
import * as chai from "chai";
const assert = chai.assert;
import { UniqueIdentifier } from "../../shared/UniqueIdentifer";
import { Encryption } from "../../shared/Encryption";


describe("Encryption class Tests", () => {
    it("it should return a globally unique identifer prefixed with mulchronedigital", async () => {
        const key = await Encryption.generateUniqueSymmetricKey();
        const splitKey = key.split(" ");
        assert.equal(splitKey[0].includes("mulchronedigital"), true);
        assert.equal(await UniqueIdentifier.testUniqueIdentifer(splitKey[1]), true);
    });
});
