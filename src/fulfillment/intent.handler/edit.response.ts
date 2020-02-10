import { Injectable } from '@nestjs/common';
import { TextMessage, WebhookRequest, WebhookResponse } from 'dialogflow';

import { IntentHandler } from '../fulfillment.service';

@Injectable()
export class EditResponse implements IntentHandler {
    
    isIntentMatch = async (request: WebhookRequest): Promise<boolean> => {
        return request.queryResult.intent.displayName === "demo - edit response";
    }    
    
    handleIntent = async (request: WebhookRequest): Promise<WebhookResponse> => {
        const response: WebhookResponse = {};
        const additionalResponse: TextMessage = {
            text: {
                text: ["Ini response tambahan"]
            },
            message: "text"
        }
        response.fulfillmentMessages = [...request.queryResult.fulfillmentMessages, additionalResponse];

        return response;
    }

}
