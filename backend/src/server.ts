import http from 'http';
import app from './app';
import { connectDB } from './config/db';
import { config } from './config/env';
import { startCronJobs } from './cron/calendar.cron';
import { logger } from './utils/logger';

const server = http.createServer(app);

const startServer = async () => {
    await connectDB();

    server.listen(config.port, () => {
        logger.info(`Server running on port ${config.port}`);
        startCronJobs();
    });
};

const gracefulShutdown = () => {
    logger.info('SIGINT/SIGTERM received. Shutting down gracefully.');
    server.close(() => {
        logger.info('HTTP server closed.');
        process.exit(0);
    });
};

process.on('SIGINT', gracefulShutdown);
process.on('SIGTERM', gracefulShutdown);

startServer();
