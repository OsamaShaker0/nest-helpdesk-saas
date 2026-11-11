import { Global, Module } from '@nestjs/common';
import { PaginationProvider } from './pagination.provider.js';
@Global()
@Module({
  providers: [PaginationProvider],
  exports: [PaginationProvider],
})
export class PaginationModule {}
