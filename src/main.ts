import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: true,  // Allows requests from any origin
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,  // Set this if you're using authentication (cookies)
  });

  const config = new DocumentBuilder()
    .addBearerAuth()
    .setTitle('Valorant-API')
    .setVersion('1.0.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);


  await app.listen(process.env.PORT ?? 3000);

  console.log(`Nest App Started on ${process.env.PORT ?? 3000}`);
  console.log(`http://localhost:${process.env.PORT ?? 3000}/api/`);
}
bootstrap();
