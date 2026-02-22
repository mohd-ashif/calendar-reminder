export const logger = {
    info: (message: string, meta?: any) => {
        console.log(`\x1b[36m[INFO]\x1b[0m ${new Date().toISOString()} - ${message}`, meta ? meta : '');
    },
    warn: (message: string, meta?: any) => {
        console.warn(`\x1b[33m[WARN]\x1b[0m ${new Date().toISOString()} - ${message}`, meta ? meta : '');
    },
    error: (message: string, error?: any) => {
        console.error(`\x1b[31m[ERROR]\x1b[0m ${new Date().toISOString()} - ${message}`);
        if (error) {
            console.error(`\x1b[31m`, error, `\x1b[0m`);
        }
    },
    danger: (message: string, error?: any) => {
        console.error(`\x1b[41m\x1b[37m[DANGER]\x1b[0m ${new Date().toISOString()} - ${message}`);
        if (error) {
            console.error(`\x1b[41m\x1b[37m`, error, `\x1b[0m`);
        }
    }
};
