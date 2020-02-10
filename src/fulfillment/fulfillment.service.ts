import { WebhookRequest, WebhookResponse } from 'dialogflow';
import { Injectable, Inject } from '@nestjs/common';

export abstract class IntentHandler {
    abstract isIntentMatch(request: WebhookRequest): Promise<boolean>;
    abstract handleIntent(request: WebhookRequest): Promise<WebhookResponse>;
}

@Injectable()
export class FulfillmentService {
    constructor(
        @Inject('INTENT_HANDLERS') private readonly handlers: IntentHandler[],
    ) {}

    processWebhook = async (request: WebhookRequest): Promise<WebhookResponse> => {
        for (const handler of this.handlers) {
            if (await handler.isIntentMatch(request)) {
                return await handler.handleIntent(request);
            }
        }
    }
}
