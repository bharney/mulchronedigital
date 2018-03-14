export class UniqueIdentifier {

    static async createGuid(): Promise<string> {
        try {
            let guid = "";
            const sections = [];
            for (let i = 0; i < 8; i++) {
                const guidSection = this.createSection();
                sections.push(guidSection);
            }
            await Promise.all(sections).then(values => {
                for (let i = 0; i < values.length; i++) {
                    if (i === 1 || i === 2 || i === 3 || i === 4) {
                        guid += values[i] + "-";
                    } else {
                        guid += values[i];
                    }
                }
            });
            return guid;
        } catch (error) {
            console.log(error);
            return null;
        }
    }

    static createSection(): Promise<string> {
        return new Promise(resolve => {
            resolve(Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1));
        });
    }

    static async testUniqueIdentifer(uniqueIdentifer: string): Promise<boolean> {
        try {  
            const guidRegex: RegExp = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
            if (!guidRegex.test(uniqueIdentifer)) {
                return false;
            }
            return true;
        } catch (error) {
            // TODO: Log it.
            console.log(error);
            return false;
        }
    }
}
