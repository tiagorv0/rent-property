import { Cron, CronExpression } from "@nestjs/schedule";
import { RentService } from "../rent.service";

export class CronJobService {
    constructor(private rentService: RentService) {}

    @Cron(CronExpression.EVERY_DAY_AT_1AM, {
        name: 'renew-rent-job',
    })
    async renewRentJob() {
        console.log('Renew rent job executed');
    }
}