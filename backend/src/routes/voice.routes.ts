import { Router, Request, Response } from 'express';

const router = Router();


//  * Query Params

router.get('/exoml', (req: Request, res: Response) => {
    const message = (req.query.message as string) ||
        'Hello! You have a calendar event starting very soon. Please be prepared. Have a great day!';

    // ExoML — identical structure to TwiML. Exotel supports <Say> natively.
    const exoml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
    <Say voice="female" language="en">${escapeXml(message)}</Say>
    <Pause length="1"/>
    <Say voice="female" language="en">This was your calendar reminder. Goodbye!</Say>
</Response>`;

    res.type('text/xml');
    res.send(exoml);
});


router.post('/', (req: Request, res: Response) => {
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
    <Say>Hello from your Google Calendar Reminder system. Have a great day!</Say>
</Response>`;
    res.type('text/xml');
    res.send(xml);
});

/**
 * Escapes special XML characters to prevent broken ExoML.
 */
function escapeXml(unsafe: string): string {
    return unsafe
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');
}

export default router;
