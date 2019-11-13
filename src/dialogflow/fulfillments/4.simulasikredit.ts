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
            validator: ((val: number, _: any) => {
                const result = (val > 10_000_000 && val < 1_000_000_000);
                return result;
            }),
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

    if (body.queryResult.allRequiredParamsPresent) {
        const nominalKredit = extractNominal(body.queryResult.parameters.nominalKredit);
        const nominalDP = body.queryResult.parameters.nominalDP;
        const tenorKredit = parseInt(body.queryResult.parameters.tenorKredit, 0) * 12;

        let pembayaranPerBulan = Math.floor((nominalKredit - nominalDP) / tenorKredit).toLocaleString();
        pembayaranPerBulan = pembayaranPerBulan.replace(/\./, ',');

        response.fulfillmentText = 'Jadi pembayaran per bulan kamu adalah ' + pembayaranPerBulan;
    }

    return response;
};
