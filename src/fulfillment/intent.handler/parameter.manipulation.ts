import { WebhookRequest, WebhookResponse } from 'dialogflow';
import { IntentHandler } from "../fulfillment.service";
import { Injectable } from '@nestjs/common';

@Injectable()
export class ParameterManipulation implements IntentHandler {

    private MAIN_EVENT = 'parameter-manipulation-evt';
    private MAIN_CONTEXT = 'demo_-_parameter_manipulation_dialog_context';
    private ALTERNATIVE_CONTEXT = 'parameter-manipulation';
    
    isIntentMatch = async (request: WebhookRequest): Promise<boolean> => {
        return request.queryResult.intent.displayName === "demo - parameter manipulation";
    }    
    
    handleIntent = async (request: WebhookRequest): Promise<WebhookResponse> => {
        const response: WebhookResponse = {};

        if (request.queryResult.queryText === this.MAIN_EVENT) {
            return response;
        }

        await this.processParameter(request, response);

        return response;
    }

    private processParameter = async (request: WebhookRequest, response: WebhookResponse): Promise<void> => {
        const context = request.queryResult.outputContexts
            .filter(x => x.name.endsWith(this.MAIN_CONTEXT) || x.name.endsWith(this.ALTERNATIVE_CONTEXT))[0];

        if (!context) {
            return;
        }

        const contextParameters = context.parameters;
        if (contextParameters['number'] === '' || contextParameters['number'] === null) {
            return;
        }
        
        contextParameters['number'] = 999999;
        context.parameters = {...contextParameters};

        response.outputContexts = [context];
        response.followupEventInput = {
            name: this.MAIN_EVENT,
            parameters: context.parameters,
            languageCode: 'id-ID'
        }
    }
}
