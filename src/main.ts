import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  console.log('ENV KEY:', process.env.RESEND_API_KEY);

  const app = await NestFactory.create(AppModule);

  app.enableCors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST'],
  credentials: true,
});

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  await app.listen(process.env.PORT ?? 4000);

  console.log(`Server running on http://localhost:${process.env.PORT ?? 4000}`);
}

bootstrap();