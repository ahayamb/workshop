import { WebhookRequest, WebhookResponse, EventInput } from 'dialogflow';

export interface Field<T> {
    name: string;
    validator: ((value: T, other: any) => boolean);
    extractor: ((other: any) => T);
}

export const validateAndResetIfWrong = <T> (body: WebhookRequest, fields: Array<Field<T>>, eventName: string): WebhookResponse => {
    const response: WebhookResponse = {};
    const eventCtx = ((body.queryResult.outputContexts || []).filter(x => x.name.endsWith(eventName)) || [undefined])[0];
    const parameter = body.queryResult.parameters;

    const constructFallback = (key: string, originalParameter: any): EventInput => {
        const param: any = {...originalParameter};
        param[key] = '';
        param[`${key}.original`] = '';
        param.wrongAnswer = true;

        return {
            name: eventName, languageCode: 'id-ID', parameters: param,
        };
    };

    for (const field of fields) {
        const value = field.extractor(parameter);
        const validationResult = field.validator(value, parameter);

        if (value && !validationResult) {
            return { followupEventInput: constructFallback(field.name, parameter) };
        }
    }

    if (eventCtx && eventCtx.parameters && eventCtx.parameters.wrongAnswer) {
        response.fulfillmentText = 'Jawaban anda salah\n' + body.queryResult.fulfillmentText;
        eventCtx.parameters.wrongAnswer = false;
        response.outputContexts = [eventCtx];
    }

    return response;

};
