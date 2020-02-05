import { FulfillmentService } from './fulfillment.service';
import { FulfillmentController } from './fulfillment.controller';
import { CreditSimulation } from './intent.handler/credit.simulation';
import { Module } from "@nestjs/common";

@Module({
    providers: [
        {
            provide: 'INTENT_HANDLERS',
            useFactory: (
                creditSimulation: CreditSimulation,
            ) => {
                return [
                    creditSimulation
                ];
            },
            inject: [CreditSimulation],
        },
        FulfillmentService,
        CreditSimulation,
    ],
    controllers: [FulfillmentController],
})
export class FulfillmentModule {}
