export class UniqueIdentifier {

    static async createGuid(): Promise<string> {
        try {
            let guid;
            const sections = [];
            for (let i = 0; i < 8; i++) {
                const guidSection = this.createSection();
                sections.push(guidSection);
            }
            Promise.all(sections)
                .then(values => {
                    for (let i = 0; i < values.length; i++) {
                        if (i !== (values.length - 1)) {
                            guid += values[i] + "-";
                            continue;
                        }
                        guid += values[i];
                    }
                });
            return guid;
        } catch (error) {
            console.log(error);
            return null;
        }
    }

    static async createSection(): Promise<string> {
        try {
            return Math.floor((1 + Math.random() * 0x10000)).toString(16).substring(1);
        } catch (error) {

        }
    }

    static async testUniqueIdentifer(uniqueIdentifer: string): Promise<boolean> {
        try {
            if (!uniqueIdentifer.match(`^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$`)) {
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
