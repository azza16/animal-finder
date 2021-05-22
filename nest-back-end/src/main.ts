import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  if (process.env.NODE_ENV === 'production') {
    app.useStaticAssets(join(__dirname, '..', 'client'))
  }
  else {    
    app.enableCors();
  }

  app.useStaticAssets(join(__dirname, '..', 'uploads'));
  await app.listen(process.env.PORT || 3000);
}
bootstrap();
