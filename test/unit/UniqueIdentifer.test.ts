import * as mocha from "mocha";
import * as chai from "chai";
import { UniqueIdentifier } from "../../shared/UniqueIdentifer";
const assert = chai.assert;

describe("UniqueIdentifer Class Tests", () => {
    it("it should create a guid section", async () => {
        const section = await UniqueIdentifier.createSection();
        assert.equal(section.length, 4);
    });

    it("it should create a valid GUID", async () => {
        const guid = await UniqueIdentifier.createGuid();
        const validatioResult = await UniqueIdentifier.testUniqueIdentifer(guid);
        assert.equal(validatioResult, true);
    });

    it("it should create an invalid GUID", async () => {
        let guid = await UniqueIdentifier.createGuid();
        guid = guid.substring(4, 10);
        const validatioResult = await UniqueIdentifier.testUniqueIdentifer(guid);
        assert.equal(validatioResult, false);
    });
});