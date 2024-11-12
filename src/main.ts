import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
// import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { abortOnError: false });
  // Note, however, you don't need to specify a type unless you actually want to access the underlying platform API.
  // const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: false, // strips away any properties that do not present in the DTO
      forbidNonWhitelisted: true, // throws an error if the request body have properties that do not present in the DTO
    }),
  );

  // app.use(logger); This how we use a global middleware
  // Accessing the DI container in a global middleware is not possible. You can use a functional middleware instead when using app.use(). Alternatively, you can use a class middleware and consume it with .forRoutes('*') within the AppModule (or any other module).

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
