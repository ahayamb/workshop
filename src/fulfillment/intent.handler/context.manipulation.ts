import { WebhookRequest, WebhookResponse, Context } from 'dialogflow';
import { IntentHandler } from "../fulfillment.service";
import { Injectable } from '@nestjs/common';

@Injectable()
export class ContextManipulation implements IntentHandler {
    
    isIntentMatch = async (request: WebhookRequest): Promise<boolean> => {
        return request.queryResult.intent.displayName === "demo - context manipulation";
    }    
    
    handleIntent = async (request: WebhookRequest): Promise<WebhookResponse> => {
        const contextOne = request.queryResult.outputContexts.filter(x => x.name.endsWith('context-one'));
        const contextTwo = request.queryResult.outputContexts.filter(x => x.name.endsWith('context-two'));
        const response: WebhookResponse = {outputContexts: []};

        if (contextOne) {
            contextOne[0].lifespanCount = 10;
            response.outputContexts.push(contextOne[0]);
        }

        if (contextTwo) {
            contextTwo[0].lifespanCount = 0;
            response.outputContexts.push(contextTwo[0]);
        }

        const contextName = `${request.session}/contexts/context-three`;
        const contextThree: Context = {
            name: contextName,
            lifespanCount: 5
        }
        response.outputContexts.push(contextThree);

        return response;
    }

}
