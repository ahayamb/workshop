import { simpleFulfillment } from './fulfillments/1.simple';
import { Controller, Post, Get, Body } from '@nestjs/common';
import { WebhookRequest, WebhookResponse } from 'dialogflow';

@Controller('fulfillment')
export class DialogflowController {

    private fulfillments: any = {};

    constructor() {
        this.fulfillments['Daftar SIM'] = simpleFulfillment;
    }

    @Get('webhook')
    async home(): Promise<string> {
        return 'Hello world';
    }

    @Post('webhook')
    async reply(@Body() request: WebhookRequest): Promise<WebhookResponse> {
        const intentName = request.queryResult.intent.displayName;
        const func = this.fulfillments[intentName];

        if (this.fulfillments[intentName]) {
            return func(request);
        }
    }
}
