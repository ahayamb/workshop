import { Module, HttpModule, HttpService } from '@nestjs/common';

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
            inject: [EarlyTermination, HttpService],
        },
        FulfillmentService,
        EarlyTermination,
    ],
    controllers: [FulfillmentController],
    imports: [HttpModule]
})
export class FulfillmentModule {}
