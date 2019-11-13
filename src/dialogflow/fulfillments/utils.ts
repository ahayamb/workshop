import { WebhookRequest, WebhookResponse, EventInput } from 'dialogflow';

export interface Field<T> {
    name: string;
    validator: ((value: T, other: any) => boolean);
    extractor: ((other: any) => T);
}

export const validateAndResetIfWrong = <T> (body: WebhookRequest, fields: Array<Field<T>>, eventName: string): WebhookResponse => {
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

};

interface Nominal {
    nominal: number;
    metric: string;
}

export const extractNominal = (value: Nominal): number => {
    if (value.nominal && value.metric) {
        return value.nominal * parseFloat(value.metric);
    } else if (value.nominal) {
        return value.nominal;
    }
};
