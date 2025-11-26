// src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ExpressAdapter } from '@nestjs/platform-express';
import { Express } from 'express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export async function createApp(server?: Express) {
  const app = server
    ? await NestFactory.create(AppModule, new ExpressAdapter(server))
    : await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.enableCors();

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Patients API')
    .setDescription('Serve and operate patient data')
    .setVersion('1.0')
    .addApiKey(
      { type: 'apiKey', name: 'x-api-key', in: 'header' },
      'ApiKeyAuth',
    )
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, document);

  if (!server) {
    const port = process.env.PORT ?? 8080;
    await app.listen(port);
  }

  await app.init();
  return app;
}
