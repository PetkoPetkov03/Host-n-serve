import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { AuthModule } from './auth/auth.module';
import { SubscriptionsController } from './subscriptions/subscriptions.controller';
import { SubscriptionsService } from './subscriptions/subscriptions.service';
import { SubscriptionsModule } from './subscriptions/subscriptions.module';
import { UploaderModule } from './uploader/uploader.module';
import { CuponsModule } from './cupons/cupons.module';


@Module({
  imports: [AuthModule, SubscriptionsModule, UploaderModule, CuponsModule],
  controllers: [AppController, AuthController, SubscriptionsController],
  providers: [AppService, AuthService, SubscriptionsService],
})
export class AppModule {}
