import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  const configService: ConfigService = app.get(ConfigService);
  const PORT = configService.get('port');

  await app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`);
  });
}
bootstrap();
