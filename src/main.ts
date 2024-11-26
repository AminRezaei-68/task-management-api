import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { WrapResponseInterceptor } from './common/interceptors/wrap-response/wrap-response.interceptor';
import { TimeoutInterceptor } from './common/interceptors/timeout/timeout.interceptor';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, 
      transform: true, 
      forbidNonWhitelisted: true, 
      transformOptions: {
        enableImplicitConversion: true, 
      },
    }),
  );

    app.useGlobalInterceptors(
    new WrapResponseInterceptor(), 
    new TimeoutInterceptor(), 
  );

  const options = new DocumentBuilder()
    .setTitle('Task Management API') 
    .setDescription('API documentation for managing tasks') 
    .setVersion('1.0') 
    .addBearerAuth() 
    .build();

  const document = SwaggerModule.createDocument(app, options); 
  SwaggerModule.setup('api', app, document); 

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}/api`);

}
bootstrap();
// بررسی شده