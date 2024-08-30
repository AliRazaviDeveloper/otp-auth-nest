import { Module } from '@nestjs/common';
import { CustomConfigModule } from './modules/config/config.module';

@Module({
  imports: [CustomConfigModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
