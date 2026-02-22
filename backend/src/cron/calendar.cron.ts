import cron from 'node-cron';
import { processReminders } from '../services/reminder.service';
import { logger } from '../utils/logger';

// Runs every 1 minute
export const startCronJobs = (): void => {
    logger.info('Starting cron jobs...');
    cron.schedule('* * * * *', async () => {
        try {
            await processReminders();
        } catch (error) {
            logger.error('Error executing reminder cron job', error);
        }
    });
};
