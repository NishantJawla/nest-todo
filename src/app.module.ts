import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CatsModule } from './cats/cats.module';
import { LoggerMiddleware } from './logger.middleware';

// The root module is the starting point Nest uses to build the application graph - the internal data structure Nest uses to resolve module and provider relationships and dependencies.
@Module({
  imports: [CatsModule], // the list of imported modules that export the providers which are required in this module
  controllers: [AppController], // the set of controllers defined in this module which have to be instantiated
  providers: [AppService], // the providers that will be instantiated by the Nest injector and that may be shared at least across this module
  // exports : the subset of providers that are provided by this module and should be available in other modules which import this module. You can use either the provider itself or just its token (provide value)
})
export class AppModule {
  // Instead, we set them up using the configure() method of the module class. Modules that include middleware have to implement the NestModule interface. Let's set up the LoggerMiddleware at the AppModule level.
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('cats');
    // consumer.apply(cors(), helmet(), logger).forRoutes(CatsController); This is an example of how we can use multiple middleware in a single route
  }
}
// The module encapsulates providers by default. This means that it's impossible to inject providers that are neither directly part of the current module nor exported from the imported modules
