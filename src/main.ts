import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import {
  ApiExceptionFilter,
  ExternalApiExceptionFilter,
} from './modules/pokemon/filter/exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Set up documentation
  const config = new DocumentBuilder()
    .setTitle('Pokémon API')
    .setDescription('API to manage Pokémons')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  // Define route for documentation
  SwaggerModule.setup('api', app, document);

  // Enable validation globally
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Enable filters globally
  app.useGlobalFilters(new ExternalApiExceptionFilter());
  app.useGlobalFilters(new ApiExceptionFilter());

  await app.listen(process.env.PORT ?? 4000);
}
bootstrap();
