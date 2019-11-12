import { WebhookRequest, WebhookResponse } from 'dialogflow';

export const TERSANGKA = 'Tersangka';
export const tersangkaFulfillment = (body: WebhookRequest): WebhookResponse | undefined => {
    return {
        followupEventInput: {
            name: 'korban-evt',
            languageCode: 'id-ID',
        },
    };
};
