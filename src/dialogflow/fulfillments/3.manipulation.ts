import { WebhookRequest, WebhookResponse } from 'dialogflow';

import { validateAndResetIfWrong, Field } from './utils';

export const TEBAK_ANGKA = 'Tebak Angka';

export const tebakAngkaFulfillment = (body: WebhookRequest): WebhookResponse | undefined => {
    const fields: Array<Field<any>> = [
        {
            name: 'angka',
            extractor: ((parameter) => parseInt(parameter.angka, 10)),
            validator: ((val: number, _: any) => (val > 200 && val < 500)),
        },
        {
            name: 'warna',
            extractor: ((parameter) => parameter.warna),
            validator: ((val: string, _: any) => (val.toLowerCase() === 'biru')),
        },
        {
            name: 'negara',
            extractor: ((parameter) => parameter.negara),
            validator: ((val: string, _: any) => (val.toLowerCase() === 'malaysia')),
        },
    ];

    return validateAndResetIfWrong(body, fields, 'tebak-angka-evt');
};

// export const tebakAngkaFulfillment = (body: WebhookRequest): WebhookResponse | undefined => {
//     console.log(JSON.stringify(body));
//     const response: WebhookResponse = {};
//     const eventCtx = ((body.queryResult.outputContexts || []).filter(x => x.name.endsWith('tebak-angka-evt')) || [undefined])[0];

//     const numberValidator = (val: number) => (val > 200 && val < 500);
//     const colorValidator = (val: string) => (val.toLowerCase() === 'biru');
//     const countryValidator = (val: string) => (val.toLowerCase() === 'malaysia');

//     const parameter = body.queryResult.parameters;
//     const num: number = parseInt(parameter.angka, 10);
//     const color: string = parameter.warna;
//     const country: string = parameter.negara;

//     const foll = (prm: string): EventInput => {
//         const param: any = {...parameter};
//         param[prm] = '';
//         param[`${prm}.original`] = '';
//         param.wrongAnswer = true;

//         return {
//             name: 'tebak-angka-evt',
//             languageCode: 'id-ID',
//             parameters: param,
//         };
//     };

//     if (num && !numberValidator(num)) {
//         return {
//             followupEventInput: foll('angka'),
//         };
//     }

//     if (color && !colorValidator(color)) {
//         return {
//             followupEventInput: foll('warna'),
//         };
//     }

//     if (country && !countryValidator(country)) {
//         return {
//             followupEventInput: foll('negara'),
//         };
//     }

//     if (eventCtx && eventCtx.parameters && eventCtx.parameters.wrongAnswer) {
//         response.fulfillmentText = 'Jawaban anda salah\n' + body.queryResult.fulfillmentText;
//         eventCtx.parameters.wrongAnswer = false;
//         response.outputContexts = [eventCtx];
//     }

//     return response;
// };
