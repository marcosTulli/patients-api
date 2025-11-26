import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { ValidationPipe } from '@nestjs/common';
import express from 'express';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule, OpenAPIObject } from '@nestjs/swagger';
import * as swaggerUi from 'swagger-ui-express';

export async function createNestApplication() {
  const server = express();
  const app = await NestFactory.create(AppModule, new ExpressAdapter(server));

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Patients API')
    .setDescription('Serve and operate patient data')
    .setVersion('1.0')
    .addApiKey(
      { type: 'apiKey', name: 'x-api-key', in: 'header' },
      'ApiKeyAuth',
    )
    .build();

  const document: OpenAPIObject = SwaggerModule.createDocument(
    app,
    swaggerConfig,
  );

  server.use('/api', swaggerUi.serve);
  server.get('/api', swaggerUi.setup(document));

  server.get('/api-json', (_req, res) => {
    res.json(document);
  });

  app.enableCors();
  await app.init();
  return server;
}
