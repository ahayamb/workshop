import { WebhookRequest, WebhookResponse } from 'dialogflow';

import { validateAndResetIfWrong, Field, extractNominal } from './utils';

export const SIMULASI_KREDIT = 'Simulasi Kredit - Filling';

export const simulasiKreditFulfillment = (body: WebhookRequest): WebhookResponse | undefined => {
    const eventName = 'simulasi-kredit-filling-evt';
    const response: WebhookResponse = {};
    const eventCtx = ((body.queryResult.outputContexts || []).filter(x => x.name.endsWith(eventName)) || [undefined])[0];

    const fields: Array<Field<any>> = [
        {
            name: 'nominalKredit',
            extractor: ((parameter) => extractNominal(parameter.nominalKredit)),
            validator: ((val: number, _: any) => (val > 10_000_000 && val < 1_000_000_000)),
        },
        {
            name: 'nominalDP',
            extractor: ((parameter) => parseFloat(parameter.nominalDP)),
            validator: ((val: number, param: any) => {
                const loan = extractNominal(param.nominalKredit);
                const dp = val;

                return dp / loan > 0.1 && dp / loan < 0.3;
            }),
        },
    ];

    const validationResult = validateAndResetIfWrong(body, fields, eventName);
    if (validationResult) {
        return validationResult;
    }

    if (eventCtx && eventCtx.parameters && eventCtx.parameters.wrongAnswer) {
        response.fulfillmentText = 'Jawaban anda salah\n' + body.queryResult.fulfillmentText;
        eventCtx.parameters.wrongAnswer = false;
        response.outputContexts = [eventCtx];
    }

    return response;
};
