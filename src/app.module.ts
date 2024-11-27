// import { Module } from '@nestjs/common';
// import { AppController } from './app.controller';
// import { AppService } from './app.service';
// import {TypeOrmModule} from '@nestjs/typeorm';
// import {TasksModule} from './modules/tasks/tasks.module';
// import { AuthModule } from './modules/auth/auth.module';
// import { UsersModule } from './modules/users/users.module';

// @Module({
//   imports: [TasksModule,
//     TypeOrmModule.forRoot({
//       type: 'postgres',
//       host: 'localhost',
//       port: 5432,
//       username: 'postgres',
//       password: '12345',
//       database: 'task_management_api',
//       autoLoadEntities: true,
//       synchronize: true,}),
//     AuthModule,
//     UsersModule
//   ],
//   controllers: [AppController],
//   providers: [AppService],
// })
// export class AppModule {}

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TasksModule } from './modules/tasks/tasks.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import appConfig from './config/app.config';
import jwtConfig from './config/jwt.config';
import databaseConfig from './config/database.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      load: [appConfig, jwtConfig, databaseConfig],
    }),
    TypeOrmModule.forRootAsync({
      useFactory: async () => databaseConfig(),
    }),
    TasksModule,
    AuthModule,
    UsersModule,
  ],
})
export class AppModule {}
//ok
