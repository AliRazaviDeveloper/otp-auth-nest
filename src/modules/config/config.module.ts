import { ConfigModule, ConfigService } from '@nestjs/config';
import { Module } from '@nestjs/common';
import configuration from 'src/config/configuration';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from 'src/config/typeorm.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
    }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: typeOrmConfig,
    }),
  ],
})
export class CustomConfigModule {}
