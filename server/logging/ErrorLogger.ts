const winston = require("winston");
const MongoDB = require("winston-mongodb").MongoDB;

const errorLogger = new (winston.Logger)({
    level: "error",
    transports: [
        new (winston.transports.MongoDB)({
            db: (!process.env.MONGO_URL) ? "mongodb://localhost:27017/Node-Angular-Starter" : process.env.MONGO_URL,
            collection: "ErrorLogs",
            timestamp: new Date().toLocaleTimeString(),
            storeHost: true,
            includeIds: true,
        })
    ]
});

export default errorLogger;
