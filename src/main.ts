import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

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


  // Enable validation
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));


  await app.listen(process.env.PORT ?? 4000);
}
bootstrap();
