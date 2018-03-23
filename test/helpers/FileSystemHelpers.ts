const exec = require("child_process").exec;

export const executeCommand = (cmd: string): Promise<string> => {
    return new Promise((resolve, reject) => {
        exec(cmd, (err, stdout, stderr) => {
            if (err) {
                reject(err);
            }
            resolve(stdout.toString("base64"));
        });
    });
};
