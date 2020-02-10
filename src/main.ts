import { FulfillmentModule } from './fulfillment/fulfillment.module';
import { NestFactory } from '@nestjs/core';

async function bootstrap() {
    const app = await NestFactory.create(FulfillmentModule);
    await app.listen(4000);
}
bootstrap();
