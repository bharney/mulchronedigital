import dns = require("dns");

export class DnsHelpers {
    public static reverseDNSLookup(ipAddress: string): Promise<string> {
        return new Promise((resolve, reject) => {
            if (!ipAddress){ 
                reject(null);
            }
            dns.reverse(ipAddress, (err, hostnames) => {
                if (err) {
                    reject(err);
                }
                (!hostnames) ? resolve(null) : resolve(hostnames[0]);
            });
        });
    }
}
