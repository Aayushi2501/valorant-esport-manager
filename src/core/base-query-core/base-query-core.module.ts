import { Module } from '@nestjs/common';
import { BaseQueryCoreService } from './base-query-core.service';

@Module({
  providers: [BaseQueryCoreService],
  exports: [BaseQueryCoreService],
})
export class BaseQueryCoreModule {}
