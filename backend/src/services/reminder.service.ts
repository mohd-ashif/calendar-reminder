import { getActiveUsers } from '../repositories/user.repo';
import { fetchUpcomingEvents } from './calendar.service';
import { triggerVoiceCall } from './call.service';
import { getUpcomingTimeWindow } from '../utils/time';
import EventLog from '../models/eventLog.model';
import { logger } from '../utils/logger';

export const processReminders = async () => {
    logger.info('CRON START: Running reminder workflow...');

    let stats = {
        usersProcessed: 0,
        callsTriggered: 0,
        errors: 0,
        skipped: 0
    };

    try {
        // STEP 1: Fetch Active Users
        const users = await getActiveUsers();
        logger.info(`Found ${users.length} active users with phone numbers.`);

        const { timeMin, timeMax } = getUpcomingTimeWindow(5);
        logger.info(`Time Window: ${timeMin} to ${timeMax}`);

        for (const user of users) {
            stats.usersProcessed++;
            logger.info(`Processing User: ${user.email} (${user._id})`);

            try {
               
                const events = await fetchUpcomingEvents(user, timeMin, timeMax);

                if (events.length === 0) {
                    logger.info(`No upcoming valid events for user ${user.email}`);
                    continue;
                }

                for (const event of events) {
                    if (!event.start?.dateTime) continue;

             
                    const idempotencyKey = {
                        userId: user._id,
                        googleEventId: event.id
                    };

                    const existingLog = await EventLog.findOne(idempotencyKey);

                    if (existingLog) {
                        logger.info(`Event already processed: ${event.summary} (ID: ${event.id})`);
                        stats.skipped++;
                        continue;
                    }

                    const log = await EventLog.create({
                        ...idempotencyKey,
                        eventStartTime: new Date(event.start.dateTime),
                        callStatus: 'pending',
                        timestamp: new Date()
                    });

                    logger.info(`Triggering call for event: ${event.summary}`);

                    try {
                        const callSid = await triggerVoiceCall(user.phoneNumber!, event.summary || 'Upcoming Event');

                        if (callSid) {
                            log.callStatus = 'completed';
                            log.twilioCallSid = callSid;
                            stats.callsTriggered++;
                        } else {
                            log.callStatus = 'failed';
                            stats.errors++;
                        }
                    } catch (callError: any) {
                        logger.error(`Twilio Call Failed for ${user.email}: ${callError.message}`);
                        log.callStatus = 'failed';
                        stats.errors++;
                    }

                    await log.save();
                }
            } catch (userError: any) {
                stats.errors++;
                logger.error(`User Failure: Error processing user ${user.email} - ${userError.message}`);
                continue;
            }
        }
    } catch (globalError: any) {
        logger.error(`CRITICAL: Global cron failure - ${globalError.message}`);
    }

    logger.info('CRON END: Reminder workflow finished.');
    logger.info(`Summary - Users: ${stats.usersProcessed}, Calls: ${stats.callsTriggered}, Skipped: ${stats.skipped}, Errors: ${stats.errors}`);
};
