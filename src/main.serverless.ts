import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import express from 'express';
import { AppModule } from './app.module';

export async function createNestApplication() {
  console.log('[Serverless] Creating express server...');
  const server = express();

  console.log('[Serverless] Creating NestJS app...');
  const start = Date.now();
  const app = await NestFactory.create(AppModule, new ExpressAdapter(server));
  console.log(`[Serverless] NestJS app created in ${Date.now() - start}ms`);

  app.enableCors();

  console.log('[Serverless] Initializing app...');
  const initStart = Date.now();
  await app.init();
  console.log(`[Serverless] App initialized in ${Date.now() - initStart}ms`);

  return server;
}
