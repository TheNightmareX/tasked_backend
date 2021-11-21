import { MikroOrmModule } from '@mikro-orm/nestjs';
import { DynamicModule, Module, NotFoundException } from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { DB_PATH, DEBUG } from 'src/env.constants';
import { Repository } from 'src/mikro/repository.class';

import { MikroBatchService } from './mikro-batch/mikro-batch.service';
import { MikroFlushInterceptor } from './mikro-flush/mikro-flush.interceptor';
import { MikroMiddlewareModule } from './mikro-middleware.module';
import { MikroQueryContextInterceptor } from './mikro-query-context/mikro-query-context.interceptor';
import { QuotaFilter } from './quota/quota.filter';
import { QuotaService } from './quota/quota.service';

@Module({})
export class MikroModule {
  static forRoot(): DynamicModule {
    return {
      module: MikroModule,
      imports: [
        MikroOrmModule.forRoot({
          type: 'sqlite',
          dbName: DB_PATH,
          autoLoadEntities: true,
          forceUndefined: true,
          context: MikroQueryContextInterceptor.context,
          findOneOrFailHandler: () => new NotFoundException(),
          entityRepository: Repository,
          debug: DEBUG,
        }),
        MikroMiddlewareModule,
      ],
      providers: [
        {
          provide: APP_INTERCEPTOR,
          useClass: MikroQueryContextInterceptor,
        },
        {
          provide: APP_INTERCEPTOR,
          useClass: MikroFlushInterceptor,
        },
        {
          provide: APP_FILTER,
          useClass: QuotaFilter,
        },
      ],
    };
  }

  static forFeature(): DynamicModule {
    return {
      module: MikroModule,
      providers: [QuotaService, MikroBatchService],
      exports: [QuotaService, MikroBatchService],
    };
  }
}
