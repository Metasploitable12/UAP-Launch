import winston from 'winston';

const logLevel = process.env.LOG_LEVEL || 'info';
const isProduction = process.env.NODE_ENV === 'production';

// Define log format
const logFormat = winston.format.combine(
  winston.format.timestamp({
    format: 'YYYY-MM-DD HH:mm:ss'
  }),
  winston.format.errors({ stack: true }),
  winston.format.json(),
  winston.format.printf(({ timestamp, level, message, ...meta }) => {
    let logMessage = `${timestamp} [${level.toUpperCase()}]: ${message}`;
    
    if (Object.keys(meta).length > 0) {
      logMessage += ` ${JSON.stringify(meta)}`;
    }
    
    return logMessage;
  })
);

// Create logger instance
export const logger = winston.createLogger({
  level: logLevel,
  format: logFormat,
  defaultMeta: { 
    service: 'syncron-security-awareness',
    version: '1.0.0'
  },
  transports: [
    // Console output
    new winston.transports.Console({
      format: isProduction 
        ? winston.format.json()
        : winston.format.combine(
            winston.format.colorize(),
            winston.format.simple()
          )
    })
  ]
});

// Add file transport for production
if (isProduction) {
  logger.add(new winston.transports.File({
    filename: 'logs/error.log',
    level: 'error',
    maxsize: 10485760, // 10MB
    maxFiles: 5
  }));
  
  logger.add(new winston.transports.File({
    filename: 'logs/combined.log',
    maxsize: 10485760, // 10MB
    maxFiles: 10
  }));
}

// Handle uncaught exceptions and unhandled rejections
logger.exceptions.handle(
  new winston.transports.File({ filename: 'logs/exceptions.log' })
);

logger.rejections.handle(
  new winston.transports.File({ filename: 'logs/rejections.log' })
);

export default logger;