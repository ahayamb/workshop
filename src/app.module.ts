import { DialogflowController } from './dialogflow/dialogflow.controllers';
import { Module } from '@nestjs/common';

@Module({
    controllers: [DialogflowController],
    imports: [],
})
export class AppModule {}
