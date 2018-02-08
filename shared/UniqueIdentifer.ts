export class UniqueIdentifier {
    static async createGuid(): Promise<string> {
        try {
            let guid = await this.section() + await this.section() + "-";
            guid += await this.section() + "-" + await this.section() + "-"; 
            guid += await this.section() + "-" + await this.section() + await this.section() + await this.section();
            return guid;
        } catch (error) {
            console.log(error);
            return null;
        }
    }

    static async section(): Promise<string> {
        try {
            return Math.floor((1 + Math.random() * 0x10000)).toString(16).substring(1);
        } catch (error) {

        }
    }
}
