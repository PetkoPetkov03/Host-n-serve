import { Body, Controller, Get, Post } from '@nestjs/common';
import { CuponsService } from './cupons.service';

@Controller('cupons')
export class CuponsController {
    constructor(private readonly cuponService: CuponsService) {}

    @Post("create")
    createCupon(@Body("user_id") user_id: string) {
        return this.cuponService.genCupon(user_id);
    };

    @Get("left")
    fetchLeftCupons() {
        return this.cuponService.cuponsLeft();
    };

    @Post("cupon")
    fetchUserCupon(@Body("user_id") user_id: string) {
        return this.cuponService.userCupon(user_id);
    }
}
