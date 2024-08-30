import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService: ConfigService = app.get(ConfigService);
  const PORT = configService.get('port');

  await app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`);
  });
}
bootstrap();
