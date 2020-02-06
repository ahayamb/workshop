import { Module } from '@nestjs/common';

import { FulfillmentController } from './fulfillment.controller';
import { FulfillmentService } from './fulfillment.service';
import { EarlyTermination } from './intent.handler/early.termination';

@Module({
    providers: [
        {
            provide: 'INTENT_HANDLERS',
            useFactory: (
                earlyTermination: EarlyTermination,
            ) => {
                return [
                    earlyTermination
                ];
            },
            inject: [EarlyTermination],
        },
        FulfillmentService,
        EarlyTermination,
    ],
    controllers: [FulfillmentController],
})
export class FulfillmentModule {}
