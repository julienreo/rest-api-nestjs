import * as fs from 'fs';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import { UnhandledErrorsFilter } from './domain/filters/unhandled-errors.filter';

async function bootstrap() {
  // Create Nest application instance
  const app = await NestFactory.create(AppModule);

  // Apply cookie-parser middleware globally
  app.use(cookieParser());

  // Apply ValidationPipe globally for DTOs validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Apply Exception filters globally to transform unhandled Business errors into HTTP exceptions
  app.useGlobalFilters(new UnhandledErrorsFilter());

  // Generate OpenAPI documentation
  const options = new DocumentBuilder()
    .setTitle('Biblio API')
    .setDescription('Biblio API documentation')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  fs.writeFileSync('./swagger-spec.json', JSON.stringify(document));
  SwaggerModule.setup('api', app, document);

  // Start web server
  await app.listen(3000);
}
bootstrap();
