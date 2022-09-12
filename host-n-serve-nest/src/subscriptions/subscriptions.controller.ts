import { Body, Controller, Delete, Get, Post } from '@nestjs/common';
import { SubscriptionsService } from './subscriptions.service';

@Controller('subscriptions')
export class SubscriptionsController {
    constructor(private readonly subscriptionService: SubscriptionsService) {}

    @Post()
    getAllSubscriptions(@Body('AuthToken') AuthToken: string) {
        return this.subscriptionService.fetchSubs(AuthToken);
    }

    @Post('session')
    buySubscription(@Body('AuthToken') AuthToken: string, @Body('price_id') id: string, @Body("cupon_id") cupon_id: string | undefined){
        return this.subscriptionService.session(AuthToken, id, cupon_id);
    }
    
    @Post('compleate-transaction')
    compTransaction(@Body('AuthToken') AuthToken: string, @Body('session_id') id: string, @Body('nickname') nickname: string, @Body('year') year: number, @Body("month") month: number){
        return this.subscriptionService.log(AuthToken, id, nickname);
    }

    @Post('active')
    activeAccountSubscription(@Body('AuthToken') AuthToken: string){
        return this.subscriptionService.activeSubs(AuthToken);
    }

    @Delete('unsubscribe')
    removeAccountSubscription(@Body('AuthToken') AuthToken: string, @Body('subscription_id') id: string){
        return this.subscriptionService.cancelSub(AuthToken, id);
    }

    @Post('checkifsub')
    checkSubs(@Body("AuthToken") AuthToken: string) {
        return this.subscriptionService.checkIfSubscribed(AuthToken);
    }

    @Post("calc_monthly")
    calcMonthly(@Body('password') password: string) {
        return this.subscriptionService.calc(password);
    }
}
