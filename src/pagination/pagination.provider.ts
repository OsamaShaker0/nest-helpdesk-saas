import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { privateDecrypt } from 'crypto';
import {
  DataSource,
  EntityTarget,
  FindOptionsOrder,
  FindOptionsWhere,
  ObjectLiteral,
} from 'typeorm';

import { PaginatedResult } from '../interfaces/pagination-result.interface.js';

@Injectable()
export class PaginationProvider {
  constructor(
    private readonly dataSource: DataSource,
    private readonly configService: ConfigService,
  ) {}

  public async paginateResponse<T extends ObjectLiteral>(
    entityClass: EntityTarget<T>,
    where: FindOptionsWhere<T> = {},
    page = this.configService.getOrThrow('pagination.page'),
    limit = this.configService.getOrThrow('pagination.limit'),
  ): Promise<PaginatedResult<T>> {
    const currentPage = Math.max(1, Math.floor(Number(page)));
    const itemsPerPage = Math.min(100, Math.max(1, Math.floor(Number(limit))));

    const [data, totalItems] = await this.dataSource.manager.findAndCount(
      entityClass,
      {
        where,
        order: { id: 'ASC' } as unknown as FindOptionsOrder<T>,
        skip: (currentPage - 1) * itemsPerPage,
        take: itemsPerPage,
      },
    );

    const totalPages = Math.ceil(totalItems / itemsPerPage);

    return {
      data,
      meta: {
        totalItems,
        itemCount: data.length,
        itemsPerPage,
        totalPages,
        currentPage,
        hasNextPage: currentPage < totalPages,
        hasPreviousPage: currentPage > 1,
      },
    };
  }
}
