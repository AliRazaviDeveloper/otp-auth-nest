import { Module } from '@nestjs/common';
import { CustomConfigModule } from './modules/config/config.module';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [CustomConfigModule, UserModule, AuthModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
