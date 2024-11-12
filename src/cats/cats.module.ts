import { Global, Module } from '@nestjs/common';
import { CatsController } from './cats.controller';
import { CatsService } from './cats.service';

//The @Global() decorator makes the module global-scoped. Global modules should be registered only once, generally by the root or core module. In the above example, the CatsService provider will be ubiquitous, and modules that wish to inject the service will not need to import the CatsModule in their imports array.

@Global()
@Module({
  controllers: [CatsController],
  providers: [CatsService],
  exports: [CatsService], // Now any module that imports the CatsModule has access to the CatsService and will share the same instance with all other modules that import it as well.
})
export class CatsModule {
  // constructor(private catsService: CatsService) {} , here the CatsService is injected through the class constructor. This helps to avoid the need to pass the CatsService instance around to every service that requires it.
}
// If we were to directly register the CatsService in every module that requires it, it would indeed work, but it would result in each module getting its own separate instance of the CatsService. This can lead to increased memory usage since multiple instances of the same service are created, and it could also cause unexpected behavior, such as state inconsistency if the service maintains any internal state.

// Modules can export their internal providers
// @Module({
//     imports: [CommonModule],
//     exports: [CommonModule],
//   })
//   export class CoreModule {}

// The Nest module system includes a powerful feature called dynamic modules. This feature enables you to easily create customizable modules that can register and configure providers dynamically. Dynamic modules are covered extensively here. In this chapter, we'll give a brief overview to complete the introduction to modules.

// import { Module, DynamicModule } from '@nestjs/common';
// import { createDatabaseProviders } from './database.providers';
// import { Connection } from './connection.provider';

// @Module({
//   providers: [Connection],
//   exports: [Connection],
// })
// export class DatabaseModule {
//   static forRoot(entities = [], options?): DynamicModule {
//     const providers = createDatabaseProviders(options, entities);
//     return {
//       global: true, the global property is set to true. This is because the module is designed to be a global module, and it should be registered only once, generally by the root or core module.
//       module: DatabaseModule,
//       providers: providers,
//       exports: providers,
//     };
//   }
// }

// Note that the properties returned by the dynamic module extend (rather than override) the base module metadata defined in the @Module() decorator. That's how both the statically declared Connection provider and the dynamically generated repository providers are exported from the module.
