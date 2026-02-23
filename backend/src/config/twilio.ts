import { config } from './env';

export const validatePhoneNumber = (phone: string): boolean => {
    const phoneRegex = /^\+[1-9]\d{6,14}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
};

