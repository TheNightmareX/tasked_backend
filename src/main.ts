import { NestFactory } from '@nestjs/core';
import { useContainer } from 'class-validator';

import { AppModule } from './app.module';
import { PORT } from './env.constants';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Use Nest DI in class-validator custom validators.
  // https://github.com/nestjs/nest/issues/528#issuecomment-403212561
  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  await app.listen(PORT);
}
bootstrap();
