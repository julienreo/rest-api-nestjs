import { MiddlewareConsumer, Module } from '@nestjs/common';
import { UsersModule } from './domain/resources/users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompaniesModule } from './domain/resources/companies/companies.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { IamModule } from './iam/iam.module';
import appConfig from './config/app.config';
import { LoggingMiddleware } from './common/middleware/logging/logging.middleware';

@Module({
  imports: [
    // Load app configuration file
    ConfigModule.forRoot({ load: [appConfig] }),
    // Instanciate database connection
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('database.host'),
        port: configService.get('database.port'),
        username: configService.get('database.user'),
        password: configService.get('database.password'),
        database: configService.get('database.name'),
        autoLoadEntities: true,
      }),
      inject: [ConfigService],
    }),
    UsersModule,
    CompaniesModule,
    IamModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {
  // Apply middleware
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggingMiddleware).forRoutes('*');
  }
}
