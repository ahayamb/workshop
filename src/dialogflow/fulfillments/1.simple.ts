import { WebhookRequest, WebhookResponse } from 'dialogflow';

export const simpleFulfillment = (body: WebhookRequest): WebhookResponse | undefined => {
    const age = parseInt(body.queryResult.parameters.usia, 10);
    const response: WebhookResponse = {};
    if (age < 18) {
        response.fulfillmentText = 'Mohon maaf usia anda belum mencukupi';
    } else {
        response.fulfillmentText = 'Selamat anda sudah mencukupi prasyarat usia';
    }

    return response;
};
