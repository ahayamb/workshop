import { WebhookRequest, WebhookResponse } from 'dialogflow';
import { IntentHandler } from "../fulfillment.service";
import { Injectable } from '@nestjs/common';

@Injectable()
export class FollowupEvent implements IntentHandler {
    
    isIntentMatch = async (request: WebhookRequest): Promise<boolean> => {
        return request.queryResult.intent.displayName === "demo - followup event source";
    }    
    
    handleIntent = async (request: WebhookRequest): Promise<WebhookResponse> => {
        const response: WebhookResponse = {};
        response.followupEventInput = {
            name: 'followup-event-destination-evt',
            languageCode: 'id-ID'
        };

        return response;
    }

}
