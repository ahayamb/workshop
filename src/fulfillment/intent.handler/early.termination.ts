import { HttpService, Injectable } from '@nestjs/common';
import { WebhookRequest, WebhookResponse } from 'dialogflow';

import { IntentHandler } from '../fulfillment.service';

interface ApiResponse {
    penalty: number;
    creditAmount: number;
    paidAmount: number;
    remainingAmount: number;
}

class ApiRequest {
    id: string
    terminationDate: number
}

@Injectable()
export class EarlyTermination implements IntentHandler {

    private MAIN_CONTEXT = 'demo_-_early_termination_dialog_context';
    private ALTERNATIVE_CONTEXT = 'demo-early-termination';
    private MAIN_EVENT = 'demo-early-termination-evt';

    constructor(private readonly client: HttpService) {}

    isIntentMatch = async (request: WebhookRequest): Promise<boolean> => {
        // TODO: implement me
    }

    handleIntent = async (request: WebhookRequest): Promise<WebhookResponse> => {
        const response: WebhookResponse = {};

        if (request.queryResult.queryText === this.MAIN_EVENT) {
            // TODO: implement me
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

        let deletedParameter = '';
        const contextParameters = context.parameters;

        let terminationDate = contextParameters['terminationDate'];

        // resolve parameter
        // TODO: implement me validate terminationDate

        // validate parameter
        // no validation since terminationDate will be validated along with the service request

        // Request api
        const apiParam = this.getApiParam(request, contextParameters);
        if (this.isParameterComplete(contextParameters) && apiParam) {
            const result = await this.requestAPI(apiParam);

            if (result.code === 200) {
                Object.assign(contextParameters, result.data);
                contextParameters['errorMessage'] = '';
            } else if (result.code === 403) {
                contextParameters['errorMessage'] = 'User anda tidak ditemukan';
            } else if (result.code === 400) {
                contextParameters['errorMessage'] = 'Terdapat input yang kurang tepat';
                contextParameters['terminationDate'] = '';
                deletedParameter = 'terminationDate';
            } else {
                contextParameters['errorMessage'] = 'Terjadi kesalahan pada sistem kami';
            }
        }

        context.parameters = {...contextParameters, deletedParameter};

        response.outputContexts = [context];
        response.followupEventInput = {
            name: this.MAIN_EVENT,
            parameters: context.parameters,
            languageCode: 'id-ID'
        }
        response.payload = request.originalDetectIntentRequest;
    }

    private resolveTerminationDate = (terminationDate: string | {date_time: string}): number => {
        // TODO: implement me
        throw new Error('Error');
    }

    private requestAPI = async (param: ApiRequest): Promise<{code: number, data: ApiResponse}> => {
        try {
            const result = await this.client.post('http://localhost:5000/earlytermination', param).toPromise();
            return {code: result.status, data: result.data};
        } catch(err) {
            const response = err.response;
            return {code: response.status || 500, data: err.response.data};
        }
    }

    private isParameterComplete = (param: any): boolean => {
        return param['terminationDate'] !== undefined;
    }

    private getApiParam = (req: WebhookRequest, param: any): {id: string, terminationDate: number} | undefined => {
        return {id: 'Uba402eef4cfc2ee5e62de7e1d18f8d4e', terminationDate: param['terminationDate']};
        if (req.originalDetectIntentRequest.source === "line") {
            return {id: req.originalDetectIntentRequest.payload.data.source.userId, terminationDate: param['terminationDate']};
        }
    }

}
