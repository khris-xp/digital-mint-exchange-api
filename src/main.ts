import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const allowedOrigins = configService.get('allowedOrigins');
  app.enableCors({
    origin: (origin, callback) => {
      if (!origin || !allowedOrigins || allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      } else {
        callback(new Error('Origin not allowed by CORS'));
      }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD'],
    optionsSuccessStatus: 200,
    exposedHeaders: ['Authorization'],
  });
  await app.listen(8081);
}
bootstrap();
