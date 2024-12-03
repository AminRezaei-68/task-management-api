import { DynamicModule, Module } from '@nestjs/common';
import { ConnectionOptions, createConnection, DataSource } from 'typeorm';
import { DataSourceOptions } from 'typeorm';

@Module({})
export class DatabaseModule {
  static register(options: DataSourceOptions): DynamicModule {
    return {
      module: DatabaseModule,
      providers: [
        {
          provide: 'DATA_SOURCE',
          useFactory: async () => {
            const dataSource = new DataSource(options);
            await dataSource.initialize();
            return dataSource;
          },
        },
      ],
      exports: ['DATA_SOURCE'],
    };
  }
}
