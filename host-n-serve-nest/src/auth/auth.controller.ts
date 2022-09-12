import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
    constructor (private readonly authService: AuthService) {}
    @Post("sign-up")
    registerUser(
    @Body('email') email: string,
    @Body('domain') domain: string,
    @Body('first_name') first_name: string,
    @Body('last_name') last_name: string,
    @Body('password') pwd: string,
    ) {
        return this.authService.registerUser(email, first_name, last_name, pwd, domain);
    };

    @Post("sign-in")
    loginUser(@Body('domain') domain: string, @Body('password') pwd: string) {
        return this.authService.signin(domain, pwd);
    }

    @Post("accountinfo")
    getAccountInfo(@Body("AuthToken") auth: string): Promise<{domain: string}> {
        return this.authService.getUserInfo(auth);
    }

    @Post("verify_user")
    verify(@Body("AuthToken") auth: string) {
        return this.authService.verifyUser(auth);
    }
}
