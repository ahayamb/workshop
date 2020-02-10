import { Body, Controller, Get, Post, Res } from '@nestjs/common';
import { WebhookRequest, WebhookResponse } from 'dialogflow';
import { Response } from 'express';

import { FulfillmentService } from './fulfillment.service';

@Controller('fulfillment')
export class FulfillmentController {

    constructor(
        private readonly service: FulfillmentService,
    ) {}

    @Get()
    getHome(): string {
        return 'This is fulfillment!';
    }

    @Post()
    async getPrediction(@Body() request: WebhookRequest, @Res() res: Response): Promise<WebhookResponse | any> {
        try {
            const response = await this.service.processWebhook(request);
            res
                .status(201)
                .json(response)
                .send();
            return response;
        } catch (err) {
            res
                .status(err.code || 500)
                .json({message: err.message, type: err.constructor.name})
                .send();
        }
    }
}
