import winston from 'winston';
import ENV from '@src/common/ENV';

// Create logger instance
const logger = winston.createLogger({
    level: ENV.NodeEnv === 'production' ? 'warn' : 'debug',
    format: winston.format.combine(
        winston.format.timestamp({
            format: 'YYYY-MM-DD HH:mm:ss'
        }),
        winston.format.errors({ stack: true }),
        winston.format.json()
    ),
    defaultMeta: { service: 'talketeer-backend' },
    transports: [
        // Write all logs with importance level of `error` or less to `error.log`
        new winston.transports.File({
            filename: 'logs/error.log',
            level: 'error',
            maxsize: 5242880, // 5MB
            maxFiles: 5
        }),
        // Write all logs with importance level of `info` or less to `combined.log`
        new winston.transports.File({
            filename: 'logs/combined.log',
            maxsize: 5242880, // 5MB
            maxFiles: 5
        })
    ]
});

// If we're not in production, log to the console as well
if (ENV.NodeEnv !== 'production') {
    logger.add(new winston.transports.Console({
        format: winston.format.combine(
            winston.format.colorize(),
            winston.format.simple()
        )
    }));
}

// Create a stream for Morgan HTTP logging
export const morganStream = {
    write: (message: string) => {
        logger.info(message.trim());
    }
};

export default logger;
