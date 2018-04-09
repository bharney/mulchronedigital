import * as mocha from "mocha";
import * as chai from "chai";
import { DataAccessObjects } from "../../server/data-access/objects/DataAccessObjects";
const assert = chai.assert;


describe("DataAccessObjects Class Tests", () => {

    it("it should resolve a blank object literal", async () => {
        const query = await DataAccessObjects.blankQuery();
        assert.equal(typeof (query), typeof ({}));
    });

    it("it should reject an error because no id was provided", async () => {
        try {
            const userId = null;
            const query = await DataAccessObjects.findInactiveUserAccountByIdQuery(userId);
        } catch (error) {
            const errorToTest = "No user ID was provided at findInactiveUserAccountByIdQuery(userId: string)";
            assert.equal(error.toString().includes(errorToTest), true);
        }
    });

    it("it should resolve a query with an _id property", async () => {
        const userId = "123987asdhjk";
        const query = await DataAccessObjects.findUserByIdQuery(userId);
        assert.equal(typeof (query), typeof ({}));
        assert.equal(query.hasOwnProperty("_id"), true);
    });

    it("it should reject an error for no userId at findUserByIdQueryMatchingIpAndDomain(userId: string, ip: string, domain: string)", async () => {
        try {
            const userId = null;
            const ip = "8.8.8.8";
            const domain = "google-public-dns-a.google.com";
            const query = await DataAccessObjects.findUserByIdQueryMatchingIpAndDomain(userId, ip, domain);
        } catch (error) {
            const errorToTest = "No user ID was provided at findUserIpAdressObject(userId: string, ip: string)";
            assert.equal(error.toString().includes(errorToTest), true);
        }
    });

    it("it should reject an error for no userId at findUserByIdQueryMatchingIpAndDomain(userId: string, ip: string, domain: string)", async () => {
        try {
            const userId = "098123098213089231";
            const ip = null;
            const domain = "google-public-dns-a.google.com";
            const query = await DataAccessObjects.findUserByIdQueryMatchingIpAndDomain(userId, ip, domain);
        } catch (error) {
            const errorToTest = "No ip address object was provided at findUserIpAdressObject(userId: string, ip: string)";
            assert.equal(error.toString().includes(errorToTest), true);
        }
    });

    it("it should resolve an object literal for findUserByIdQueryMatchingIpAndDomain(userId: string, ip: string, domain: string)", async () => {
        const userId = "5ac8f01264d120110c18e9f7";
        const ip = "8.8.8.8";
        const domain = "google-public-dns-a.google.com";
        const query = await DataAccessObjects.findUserByIdQueryMatchingIpAndDomain(userId, ip, domain);
        assert.equal(typeof(query), typeof({}));
        assert.equal(query.hasOwnProperty("_id"), true);    
        assert.equal(query.hasOwnProperty("ipAddresses"), true);
    });
});
