import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';

//solution one
// export const typeOrmConfig = (
//   configService: ConfigService,
// ): TypeOrmModuleOptions => ({
//   type: 'postgres',
//   host: configService.get<string>('database.host'),
//   port: configService.get<number>('database.port'),
//   username: configService.get<string>('database.username'),
//   password: configService.get<string>('database.password'),
//   database: configService.get<string>('database.database'),
//   entities: [],
//   autoLoadEntities: true,
//   synchronize: true,
// });

//solution two
@Injectable()
export class TypeOrmConfig implements TypeOrmOptionsFactory {
  constructor(private configService: ConfigService) {}
  createTypeOrmOptions(
    connectionName?: string,
  ): Promise<TypeOrmModuleOptions> | TypeOrmModuleOptions {
    return {
      type: 'postgres',
      host: this.configService.get<string>('database.host'),
      port: this.configService.get<number>('database.port'),
      username: this.configService.get<string>('database.username'),
      password: this.configService.get<string>('database.password'),
      database: this.configService.get<string>('database.database'),
      // entities: ['/dist/**/**/**/*.entity{.js,.ts}'],
      entities: [],
      autoLoadEntities: true,
      synchronize: true,
    };
  }
}
