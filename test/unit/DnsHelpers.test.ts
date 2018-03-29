import * as mocha from "mocha";
import * as chai from "chai";
import { DnsHelpers } from "../../server/globals/DnsHelpers";
const assert = chai.assert;


describe("DnsHelpers Class Tests", () => {
    it("it should resolve null because the string was emtpy", async () => {
        try {
            const lookup = await DnsHelpers.reverseDNSLookup("");
        } catch (error) {
            assert.equal(error, null);
        }
    });

    it("it should reject an error because its an invalid IP", async () => {
        try {
            const lookup = await DnsHelpers.reverseDNSLookup("127.0.0.1");
        } catch (error) {
            assert.equal(error.toString().includes("Error: getHostByAddr"), true);
        }
    });

    it("it should resolve Google's public DNS IP address of 8.8.8.8", async () => {
        const ip = "8.8.8.8";
        const dnsHostname = "google-public-dns-a.google.com";
        const dnsLookup = await DnsHelpers.reverseDNSLookup(ip);
        assert.equal(dnsLookup, dnsHostname);
    }); 
});