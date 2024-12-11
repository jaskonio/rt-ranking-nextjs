import winston from "winston";


const logger = winston.createLogger({
    level: "debug",
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.printf(({ level, message, timestamp, ...meta }) => {
            const metaString = meta && Object.keys(meta).length > 0 ? JSON.stringify(meta) : "";

            return `[${timestamp}] ${level.toUpperCase()}: ${message}. ${metaString}`;
        })
    ),
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: "logs/app.log" }),
    ],
});

export default logger;
