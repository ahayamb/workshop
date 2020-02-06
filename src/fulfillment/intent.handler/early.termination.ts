import { WebhookRequest, WebhookResponse } from 'dialogflow';
import { IntentHandler } from "../fulfillment.service";
import { Injectable } from '@nestjs/common';

@Injectable()
export class EarlyTermination implements IntentHandler {

    isIntentMatch = async (request: WebhookRequest): Promise<boolean> => {
        throw new Error('Not implemented');
    }

    handleIntent = async (request: WebhookRequest): Promise<WebhookResponse> => {
        throw new Error('Not implemented');
    }

}
