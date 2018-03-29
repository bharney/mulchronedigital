import dns = require("dns");

export class DnsHelpers {
    public static reverseDNSLookup(ipAddress: string): Promise<string> {
        return new Promise((resolve) => {
            if (!ipAddress){ 
                resolve(null);
            }
            dns.reverse(ipAddress, (err, hostnames) => {
                if (err) {
                    resolve(null);
                }
                (!hostnames) ? resolve(null) : resolve(hostnames[0]);
            });
        });
    }
}
