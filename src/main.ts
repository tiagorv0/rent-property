import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filters/all-exception.filter';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { ValidationPipe } from '@nestjs/common';
import { FileCleanupInterceptor } from './common/interceptors/file-cleanup.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Apply global exception filter
  app.useGlobalFilters(new AllExceptionsFilter());

  // Apply global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Strips properties not in DTO
      forbidNonWhitelisted: true, // Returns error if non-whitelisted props found
      transform: true, // Automatically transform payloads to DTO instances
    }),
  );

  // Apply global interceptors
  app.useGlobalInterceptors(new LoggingInterceptor(), new FileCleanupInterceptor());

  const config = new DocumentBuilder()
    .setTitle('Rent Property API')
    .setDescription('API for managing rental properties, tenants, and rent')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
