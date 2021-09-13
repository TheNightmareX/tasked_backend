import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { useContainer } from 'class-validator';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  );

  await app.listen(3000);

  // https://github.com/nestjs/nest/issues/528#issuecomment-403212561
  useContainer(app.select(AppModule), { fallbackOnErrors: true });
}
bootstrap();
