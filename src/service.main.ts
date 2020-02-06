import { Response } from 'express';
import { Body, Controller, Get, Post, Res, Module } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';


class LineUser {
    id: string
    terminationDate: number
}

@Controller('earlytermination')
export class EarlyTerminationController {

    private creditData = [
        { user: 'Uba402eef4cfc2ee5e62de7e1d18f8d4e', creditId: 1, creditAmount: 10000000, startDate: new Date('2020-01-01'), dueDate: new Date('2020-12-31'), paidAmount: 3000000 },
        { user: 'Uba402eef4cfc2ee5e62de7e1d18f8d4e', creditId: 2, creditAmount: 10000000, startDate: new Date('2020-01-01'), dueDate: new Date('2020-12-31'), paidAmount: 4000000 },
    ]

    @Get()
    getHome(): string {
        return 'This is early termination service!';
    }

    @Post()
    async getPrediction(@Body() request: LineUser, @Res() res: Response): Promise<any> {
        const userId = request.id;
        const terminationDate = new Date(request.terminationDate);
        const credits = this.creditData.filter(x => x.user === userId);

        if (credits.length > 0) {
            const credit = credits[0];
            const deltaMonth = this.getMonthDelta(terminationDate, credit.dueDate);
            const originalDelta = this.getMonthDelta(credit.startDate, credit.dueDate);

            if (credit.dueDate < terminationDate || (deltaMonth >= this.getMonthDelta(new Date(), credit.dueDate))) {
                res
                    .status(400)
                    .json({message: 'Tanggal yang diinputkan tidak sesuai'})
            } else {
                const penalty = Math.round((deltaMonth / originalDelta) * (credit.creditAmount - credit.paidAmount));
                const remainingAmount = credit.creditAmount - credit.paidAmount;

                res
                    .status(200)
                    .json({penalty: penalty, creditAmount: credit.creditAmount, paidAmount: credit.paidAmount, remainingAmount: remainingAmount})
            }
        } else {
            res
                .status(404)
                .json({message: 'User tidak ditemukan'})
        }

        res.send();
    }

    private getMonthDelta(start: Date, end: Date): number {
        const delta = new Date(Math.abs(start.getTime() - end.getTime())).getMonth();
        return delta === 0 ? 12 : delta;
    }
}

@Module({
    controllers: [EarlyTerminationController],
})
export class EarlyTerminationModule {}


async function bootstrap() {
    const app = await NestFactory.create(EarlyTerminationModule);
    await app.listen(5000);
}
bootstrap();
