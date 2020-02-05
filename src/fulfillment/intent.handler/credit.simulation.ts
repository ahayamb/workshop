import { WebhookRequest, WebhookResponse } from 'dialogflow';
import { IntentHandler } from "../fulfillment.service";
import { Injectable } from '@nestjs/common';

@Injectable()
export class CreditSimulation implements IntentHandler {

    isIntentMatch = async (request: WebhookRequest): Promise<boolean> => {
        // TODO
        throw new Error('Not implemented');
    }

    handleIntent = async (request: WebhookRequest): Promise<WebhookResponse> => {
        const response: WebhookResponse = {};

        this.processParameter(request, response);

        return response;
    }

    private processParameter = async (request: WebhookRequest, response: WebhookResponse): Promise<void> => {
        // TODO
    }

}
