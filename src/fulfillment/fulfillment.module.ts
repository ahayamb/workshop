import { ParameterManipulation } from './intent.handler/parameter.manipulation';
import { FollowupEvent } from './intent.handler/followup.event';
import { EditResponse } from './intent.handler/edit.response';
import { ContextManipulation } from './intent.handler/context.manipulation';
import { Module } from '@nestjs/common';

import { FulfillmentController } from './fulfillment.controller';
import { FulfillmentService } from './fulfillment.service';

@Module({
    providers: [
        {
            provide: 'INTENT_HANDLERS',
            useFactory: (
                creditSimulation: ContextManipulation,
                editResponse: EditResponse,
                followupEvent: FollowupEvent,
                parameterManipulation: ParameterManipulation,
            ) => {
                return [
                    creditSimulation, editResponse, followupEvent, parameterManipulation
                ];
            },
            inject: [ContextManipulation, EditResponse, FollowupEvent, ParameterManipulation],
        },
        FulfillmentService,
        ContextManipulation,
        EditResponse,
        FollowupEvent,
        ParameterManipulation
    ],
    controllers: [FulfillmentController],
})
export class FulfillmentModule {}
